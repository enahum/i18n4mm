#!/usr/bin/env node
var cli = require('cli').enable("version"),
    winston = require('winston'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob').sync,
    babel = require('babel-core'),
    clean = require('rimraf').sync,
    exec = require('child_process').exec,
    mkdirp = require('mkdirp'),
    merge = require('../lib/merge'),
    cp = require("../lib/copy"),
    version = require('../package.json').version,
    colors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green'
    },
    log = new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug'
            })
        ]
    }),
    outDir, msgDir, lang, base, temp, files;

var sortObject = function(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
};

var execute = function(command, callback, errback){
    exec(command, {maxBuffer: 1024 * 1024 * 5}, function(err, stdout, stderr){
        err = err || stderr;
        if (err) {
            if (errback) {
                return errback(err, stdout);
            }
            return cli.fatal('exec() failed\n' + err);
        }
        if (callback) {
            callback(stdout.split('\n'));
        }
    });
};

winston.addColors(colors);

cli.setUsage("i18n4react [OPTIONS]");
cli.setApp("i18n4react", version);

cli.parse({
    extract: ['e', 'Input directory', 'path'],
    output: ['o', 'Output directory (Default is i18n)', 'path'],
    lang: ['l', 'Set the default language to name the merged output file', 'string', 'en'],
    compare: ['c', 'Compare JSON files with the original and translated flags'],
    deep: [false, 'Deep comparison includes values for each key'],
    diff: ['d', 'Create a diff file with missing keys and changed values'],
    diffFile: ['j', 'Differential JSON file', 'file'],
    original: ['g', 'Original JSON file', 'file'],
    translated: ['t', 'Translated JSON file', 'file'],
    patch: ['p', 'Patch an Original file with a Differential file'],
    merge: ['m', 'Merge values from the Translated file found in the original file'],
    sort: ['s', 'Sort json file by id', 'file']
});

cli.main(function (args, options) {
    outDir = options.output || path.join(process.cwd() + '/i18n');
    msgDir = path.join(process.cwd(), './temp', 'messages');
    lang = options.lang;

    if(options.extract) {
        extract(options);
    }
    else if(options.compare) {
        compare(options);
    }
    else if(options.patch) {
        patch(options);
    }
    else if(options.merge) {
        mergeFiles(options);
    }
    else if(options.sort) {
        sortfile(options.sort);
    }
    else {
        console.error("ERROR: directory that contains the files to be used in extraction must be set\n");
        cli.getUsage(1);
    }
});

function mergeFiles(options) {
    var diff = {};
    if(options.original && options.translated) {
        files = [options.original, options.translated];
        files.map(function (filename) {
            return fs.readFileSync(filename, 'utf8');
        })
            .map(function(file) {
                return JSON.parse(file);
            })
            .reduce(function(original, translated) {
                for(var key in original) {

                    if(translated.hasOwnProperty(key)) {
                        diff[key] = translated[key];
                        log.info("Added %s key to file", key);
                    } else {
                        diff[key] = original[key];
                        log.warn('The %s key needs to be translated manually', key)
                    }
                }
            });

        if(Object.keys(diff).length > 0) {
            var filename = path.basename(options.translated, '.json');
            mkdirp.sync(outDir);
            fs.writeFileSync(path.join(outDir, filename + '.json'), JSON.stringify(sortObject(diff), null, 2));
        }
        log.info("Merge complete");
    } else if(options.original) {
        return console.log('Translated JSON file missing');
    } else if (options.translated) {
        return console.log('Original JSON file missing');
    } else {
        return console.log('To merge files the -g and -t flag are required')
    }
}

function compare(options) {
    var diff = {};
    if(options.original && options.translated) {
        files = [options.original, options.translated];
        files.map(function (filename) {
            return fs.readFileSync(filename, 'utf8');
        })
            .map(function(file) {
                return JSON.parse(file);
            })
            .reduce(function(original, translated) {
                var error = false, addToDiff;
                for(var key in original) {
                    addToDiff = false;
                    if(!translated.hasOwnProperty(key)) {
                        error = true;
                        addToDiff = true;
                        log.warn('missing: %s key', key);
                    } else if(options.deep) {
                        if(original[key] !== translated[key]) {
                            error = true;
                            addToDiff = true;
                            log.warn('not equal: %s key has different values', key);
                        }
                    }

                    if(addToDiff && options.diff) {
                        diff[key] = original[key];
                    }
                }
                if(error){
                    log.error('Add the missing keys to the translated file and try again')
                } else {
                    log.info("Original and Translated files have the same keys");
                }
            });

        if(options.diff && Object.keys(diff).length > 0) {
            var filename = path.basename(options.original, '.json');
            mkdirp.sync(outDir);
            fs.writeFileSync(path.join(outDir, filename + '.diff.json'), JSON.stringify(sortObject(diff), null, 2));
        }

    } else if(options.original) {
        return console.log('Translated JSON file missing');
    } else if (options.translated) {
        return console.log('Original JSON file missing');
    } else {
        return console.log('To compare files the -g and -t flag are required')
    }
}

function patch(options) {
    if(options.original && options.diffFile) {
        var files = [options.original, options.diffFile];
        var original_with_diff = files.map(function (filename) {
            return JSON.parse(fs.readFileSync(filename, 'utf-8'));
        })
            .reduce(function (original, diff) {
                for(var key in diff) {
                    original[key] = diff[key];
                }

                return original;
            });

        mkdirp.sync(outDir);
        fs.writeFileSync(options.original, JSON.stringify(sortObject(original_with_diff), null, 2));
    }
    else if(options.original) {
        return console.log('Differential JSON file missing');
    } else if (options.diffFile) {
        return console.log('Original JSON file missing');
    } else {
        return console.log('To patch a file the -g and -j flag are required')
    }
}

function extract(options) {
    var dir = options.extract;
    base = path.parse(dir).base;
    temp = path.join(msgDir, '../', base);
    if(fs.lstatSync(dir).isDirectory()) {
        cp(dir, temp, function() {
            files = glob(path.join(temp, "/**/*.jsx"));

            files.forEach(function(file){
                babel.transformFileSync(file);
            });

            console.log('done extracting');

            merge({msgDir: msgDir, output: outDir, lang: lang}, function() {
                clean(path.join(msgDir, '../'));
                console.log('done merging');
            });
        });
    } else {
        console.error("ERROR: extract option is not a directory\n");
        cli.getUsage(1);
    }
}

function sortfile(filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            return log.error('Could not read %s', filename);
        }
        var json = JSON.parse(data);
        fs.writeFileSync(filename, JSON.stringify(sortObject(json), null, 2));
    });
}
