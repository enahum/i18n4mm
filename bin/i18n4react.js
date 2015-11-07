#!/usr/bin/env node
var cli = require('cli').enable("version"),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob').sync,
    babel = require('babel-core'),
    clean = require('rimraf').sync,
    exec = require('child_process').exec,
    merge = require('../lib/merge'),
    cp = require("../lib/copy");

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

cli.setUsage("i18n4react [OPTIONS]");
cli.setApp("i18n4react", "0.1.2");

cli.parse({
    extract: ['e', 'Input directory', 'path'],
    output: ['o', 'Output directory (Default is i18n)', 'path'],
    lang: ['l', 'Set the default language to name the merged output file', 'string', 'en']
});

cli.main(function (args, options) {
    var dir = options.extract,
        outDir = options.output || path.join(process.cwd() + '/i18n'),
        baseDir = path.dirname(fs.realpathSync(__filename)),
        msgDir = path.join(process.cwd(), './temp', 'messages'),
        lang = options.lang,
        base, temp, files;

    if(dir) {
        base = path.parse(dir).base;
        temp = path.join(baseDir, '../temp', base);
        if(fs.lstatSync(dir).isDirectory()) {
            cp(dir, temp, ['node_modules']).read(function() {
                files = glob(path.join(temp, "/**/*.jsx"));
                files.forEach(function(file){
                    babel.transformFileSync(file, {
                        plugins: ["react-intl"],
                        modules: "amd"
                    });
                });
                console.log('done extracting');
                merge({msgDir: msgDir, output: outDir, lang: lang}, function() {
                    clean(path.join(baseDir, '../temp'));
                    clean(path.join(msgDir, '../'));
                    console.log('done merging');
                });
            });
        } else {
            console.error("ERROR: extract option is not a directory\n");
            cli.getUsage(1);
        }
    } else {
        console.error("ERROR: directory that contains the files to be used in extraction must be set\n");
        cli.getUsage(1);
    }
});
