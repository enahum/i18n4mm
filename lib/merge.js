'use strict';
var path = require('path');
var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _glob = require('glob');

var _mkdirp = require('mkdirp');

var _libTranslator = require('./translator');

var _libTranslator2 = _interopRequireDefault(_libTranslator);

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
module.exports = function(options, callback) {
    var MESSAGES_PATTERN = path.join(options.msgDir, '/**/*.json');

    var LANG_DIR = options.output;
    var defaultMessages = (0, _glob.sync)(MESSAGES_PATTERN).map(function (filename) {
        return fs.readFileSync(filename, 'utf8');
    }).map(function (file) {
        return JSON.parse(file);
    }).reduce(function (collection, descriptors) {
        descriptors.forEach(function (_ref) {
            var id = _ref.id;
            var defaultMessage = _ref.defaultMessage;

            if (collection.hasOwnProperty(id) && collection[id] !== defaultMessage) {
                throw new Error('Duplicate message id with different values: ' + id);
            }

            collection[id] = defaultMessage.replace(/\s +/g, "");
        });

        return collection;
    }, {});

    (0, _mkdirp.sync)(LANG_DIR);
    fs.writeFileSync(path.join(LANG_DIR, options.lang + '.json'), JSON.stringify(defaultMessages, null, 2));
    if(callback && typeof(callback) == 'function') {
        callback();
    }
};