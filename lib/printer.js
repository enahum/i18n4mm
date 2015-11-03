'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = printICUMessage;
var ESCAPED_CHARS = {
    '\\': '\\\\',
    '\\#': '\\#',
    '{': '\\{',
    '}': '\\}'
};

var ESAPE_CHARS_REGEXP = /\\#|[{}\\]/g;

function printICUMessage(ast) {
    return ast.elements.reduce(function (message, el) {
        var format = el.format;
        var id = el.id;
        var type = el.type;
        var value = el.value;

        if (type === 'messageTextElement') {
            return message + value.replace(ESAPE_CHARS_REGEXP, function (char) {
                    return ESCAPED_CHARS[char];
                });
        }

        if (!format) {
            return message + ('{' + id + '}');
        }

        var formatType = format.type.replace(/Format$/, '');

        switch (formatType) {
            case 'number':
            case 'date':
            case 'time':
                var style = format.style ? ', ' + format.style : '';
                return message + ('{' + id + ', ' + formatType + style + '}');

            case 'plural':
            case 'selectOrdinal':
            case 'select':
                var offset = format.offset ? ', offset:' + format.offset : '';
                var options = format.options.reduce(function (str, option) {
                    var optionValue = printICUMessage(option.value);
                    return str + (' ' + option.selector + ' {' + optionValue + '}');
                }, '');
                return message + ('{' + id + ', ' + formatType + offset + ',' + options + '}');
        }
    }, '');
}

module.exports = exports['default'];