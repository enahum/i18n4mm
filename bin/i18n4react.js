#!/usr/bin/env node
var cli = require('cli').enable("version"),
    fs = require('fs'),
    path = require('path'),
    cp = require("cp-r"),
    clean = require('rimraf').sync,
    exec = require('child_process').exec,
    merge = require('../lib/merge');

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
cli.setApp("i18n4react", "0.1.1");

cli.parse({
    extract: ['e', 'Input directory', 'path'],
    output: ['o', 'Output directory (Default is i18n)', 'path'],
    lang: ['l', 'Set the default language to name the merged output file', 'string', 'en']
});

cli.main(function (args, options) {
    var dir = options.extract,
        outDir = options.output || path.join(process.cwd() + '/i18n'),
        baseDir = path.dirname(fs.realpathSync(__filename)),
        lang = options.lang,
        base, temp;

    if(dir) {
        base = path.parse(dir).base;
        temp = path.join('./', base);
        if(fs.lstatSync(dir).isDirectory()) {
            cp(dir, temp).read(function() {
                execute(path.join(baseDir, "../node_modules/.bin/babel") + " -q --plugins react-intl " + path.join(temp, '**/*.jsx'), function(out){
                    console.log('done extracting');
                    merge({output: outDir, lang: lang}, function() {
                        clean(temp);
                        clean('./messages');
                        console.log('done merging');
                    })
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
