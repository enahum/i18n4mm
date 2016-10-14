#!/usr/bin/env node
var cli = require('cli').enable("version"),
    winston = require('winston'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    _ = require('lodash');

var sortObjectByProperty = function(obj, property) {
    return _.orderBy(obj, [property], ['asc']);
};

var sortObjectByKey = function(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
};

var colors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green'
};

winston.addColors(colors);

var log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            level: 'debug'
        })
    ]
});

cli.setUsage("i18n4mm [OPTIONS]");
cli.setApp("i18n4mm", "1.0.0");

cli.parse({
    output: ['o', 'Output directory (Default is i18n)', 'path'],
    sort: ['s', 'Sort platform or webapp i18n file', 'string'],
    prop: ['p', 'The property to use when sorting', 'string'],
    filename: ['f', 'JSON file', 'file']
});

cli.main(function (args, options) {
    if (options.sort && options.filename) {
        if (options.sort !== 'platform' && options.sort !== 'webapp') {
            log.error('Soft option must be "platform" or "webapp"');
            return cli.getUsage(1);
        } else if (options.sort === 'platform' && !options.prop) {
            log.error('Property to be sorted by is missing');
            return cli.getUsage(1);
        } else if (options.prop) {
            log.info("Sorting by %s", options.prop);
        }
        sort(options);
    } else {
        return cli.getUsage(1);
    }
});


function sort(options) {
    var outDir = options.output || path.join(process.cwd() + '/i18n');
    var content = JSON.parse(fs.readFileSync(options.filename, 'utf-8'));
    var filename = path.basename(options.filename, '.json');
    var destination = path.join(outDir, filename + '.json');
    var jsonContent = null;

    try {
        fs.accessSync(destination, fs.F_OK);
        // Do something
    } catch (e) {
        // It isn't accessible
    }

    mkdirp.sync(outDir);

    if (options.sort === 'platform') {
        jsonContent = sortObjectByProperty(content, options.prop);
    } else {
        jsonContent = sortObjectByKey(content);
    }

    fs.writeFileSync(destination, JSON.stringify(jsonContent, null, 2));
    fs.appendFileSync(destination, '\n', 'utf8');
}