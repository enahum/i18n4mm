var lift = require('lift-result/cps'),
    mkdir = lift(require('mkdirp')),
    each = require('foreach/async'),
    fs = require('lift-result/fs'),
    join = require('path').join,
    Result = require('result');

module.exports = dispatch;

/**
 * copy whatever is at `a` to `b`
 *
 * @param {String} a
 * @param {String} b
 * @return {Promise}
 */

function dispatch(a, b, exclude){
    exclude = exclude || [];

    return fs.lstat(a).then(function(s){
        if (s.isFile()) return copyFile(a, b, s);
        if (s.isDirectory()) return copyDir(a, b, s, exclude);
        if (s.isSymbolicLink()) return fs.symlink(fs.readlink(a), b);
    })
}

/**
 * copy `a` and its contents to `b`
 *
 * @param {String} a
 * @param {String} b
 * @param {Object} opts
 * @return {Promise}
 * @param exclude
 */

function copyDir(a, b, opts, exclude){
    return mkdir(b, opts).then(function(){
        return each(fs.readdir(a), function(name){
            if(exclude.indexOf(name) < 0)
                return dispatch(join(a, name), join(b, name));
        });
    });
}

/**
 * Copy file `a` to `b`
 *
 * @param {String} a
 * @param {String} b
 * @param {Object} opts
 * @return {Promise}
 */

function copyFile(a, b, opts){
    var result = new Result;

    function done(err) {
        if (result.state != 'pending') return;
        read.destroy();
        write.destroy();
        if (err) result.error(err);
        else result.write();
    }

    var write = fs.createWriteStream(b, opts)
        .on('error', done)
        .on('close', done);

    var read = fs.createReadStream(a)
        .on('error', done)
        .pipe(write);

    return result;
}
