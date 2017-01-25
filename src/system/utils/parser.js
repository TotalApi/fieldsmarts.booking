"use strict";
// ReSharper disable once InconsistentNaming
var Parser = require('js-expression').Parser;
exports.parser = new Parser();
exports.parser.consts = {};
exports.parser.addFunction('iif', function (cond, a, b) { return (cond ? a : b); });
exports.parser.addFunction('not', function (cond) { return !cond; });
exports.parser.addOperator('!', 0, function (cond) { return !cond; });
exports.parser['__eval'] = exports.parser.evaluate;
exports.parser.evaluate = function (expression, context, defaultValue) {
    var val = defaultValue || '';
    if (context) {
        if (!expression) {
            val = context.toString();
        }
        else {
            val = exports.parser['__eval'](expression, context);
        }
    }
    return val;
};
//# sourceMappingURL=parser.js.map