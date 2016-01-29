var copyDir = require('copy-dir');

module.exports = function(src, dst, cb) {
    copyDir.sync(src, dst, function(_stat, _path, _file){
        if(_stat === 'directory' && _file === 'node_modules') {
            return false;
        }
        return !(_stat === 'file' && _file.indexOf('.jsx') === -1);
    });

    if(cb && typeof cb === 'function') {
        cb();
    }
};