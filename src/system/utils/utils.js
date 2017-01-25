"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var st = require('stacktrace-js');
__export(require("./js.net.extensions"));
function callerName(level, getLastPartOfName) {
    if (level === void 0) { level = 0; }
    if (getLastPartOfName === void 0) { getLastPartOfName = true; }
    var res;
    var stackTrace = st.getSync({ offline: true });
    // В режиме минификации в стек добавляется ещё два вызова, начиная с метода getSync - это нужно учесть
    var self = stackTrace.firstOrDefault(function (x) { return x.functionName && (x.functionName === "getSync" /* IE */ || x.functionName.EndsWith(".getSync") /* Others */); });
    if (self) {
        var index = stackTrace.indexOf(self) + 1;
        level += index;
    }
    res = stackTrace[level + 1].functionName;
    if (getLastPartOfName) {
        var arr = res.split('.');
        res = arr[arr.length - 1];
    }
    return res;
}
exports.callerName = callerName;
function getFnBody(fn) {
    // Get content between first { and last }
    var m = fn.toString().match(/\{([\s\S]*)\}/m)[1];
    // Strip comments
    return m.replace(/^\s*\/\/.*$/mg, '');
}
exports.getFnBody = getFnBody;
function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
exports.escapeRegexp = escapeRegexp;
function isFnEmpty(fn) {
    return (getFnBody(fn) || '').trim() === '';
}
exports.isFnEmpty = isFnEmpty;
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function isBlank(obj) {
    return obj === undefined || obj === null;
}
exports.isBlank = isBlank;
function isBoolean(obj) {
    return typeof obj === 'boolean';
}
exports.isBoolean = isBoolean;
function isNumber(obj) {
    return typeof obj === 'number';
}
exports.isNumber = isNumber;
function isString(obj) {
    return typeof obj === 'string';
}
exports.isString = isString;
function isFunction(obj) {
    return typeof obj === 'function';
}
exports.isFunction = isFunction;
function isType(obj) {
    return isFunction(obj);
}
exports.isType = isType;
function isStringMap(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isStringMap = isStringMap;
var STRING_MAP_PROTO = Object.getPrototypeOf({});
function isStrictStringMap(obj) {
    return isStringMap(obj) && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
exports.isStrictStringMap = isStrictStringMap;
function isPromise(obj) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return isPresent(obj) && isFunction(obj.then);
}
exports.isPromise = isPromise;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function toArray(obj) {
    return Array.isArray(obj) ? obj : (!!obj ? [obj] : []);
}
exports.toArray = toArray;
function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}
exports.isDate = isDate;
/**
 * Возвращает true, если context равен null или undefined.
 */
function isEmpty(context) {
    return context === undefined || context === null;
}
exports.isEmpty = isEmpty;
/**
 * Возвращает значение value, если context равен null или undefined или context в ином случае.
 */
function ifEmpty(context, value) {
    return isEmpty(context) ? value : context;
}
exports.ifEmpty = ifEmpty;
/**
 * Возвращает значение value, если context равен null или undefined или context в ином случае.
 */
function coalesce(context, value) {
    return ifEmpty(context, value);
}
exports.coalesce = coalesce;
function isJsObject(o) {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}
exports.isJsObject = isJsObject;
function isPrimitive(obj) {
    return !isJsObject(obj);
}
exports.isPrimitive = isPrimitive;
function hasConstructor(value, type) {
    return value.constructor === type;
}
exports.hasConstructor = hasConstructor;
function escape(s) {
    return encodeURI(s);
}
exports.escape = escape;
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
exports.escapeRegExp = escapeRegExp;
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomArbitrary = getRandomArbitrary;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;
function getRandomString(digitsNum) {
    if (digitsNum === void 0) { digitsNum = 12; }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < digitsNum; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
exports.getRandomString = getRandomString;
/**
 * Транслитерация кириллицы в URL
 */
function urlRusLat(str) {
    str = str.toLowerCase(); // все в нижний регистр
    var cyr2LatChars = new Array(['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'], ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'], ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'], ['ш', 'sh'], ['щ', 'shch'], ['ъ', ''], ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'yu'], ['я', 'ya'], ['А', 'A'], ['Б', 'B'], ['В', 'V'], ['Г', 'G'], ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'], ['Ж', 'ZH'], ['З', 'Z'], ['И', 'I'], ['Й', 'Y'], ['К', 'K'], ['Л', 'L'], ['М', 'M'], ['Н', 'N'], ['О', 'O'], ['П', 'P'], ['Р', 'R'], ['С', 'S'], ['Т', 'T'], ['У', 'U'], ['Ф', 'F'], ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'], ['Ъ', ''], ['Ы', 'Y'], ['Ь', ''], ['Э', 'E'], ['Ю', 'YU'], ['Я', 'YA'], ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'], ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'], ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'], ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'], ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'], ['z', 'z'], ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E'], ['F', 'F'], ['G', 'G'], ['H', 'H'], ['I', 'I'], ['J', 'J'], ['K', 'K'], ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'], ['P', 'P'], ['Q', 'Q'], ['R', 'R'], ['S', 'S'], ['T', 'T'], ['U', 'U'], ['V', 'V'], ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'], [' ', '_'], ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['-', '-'], ['/', '/']);
    var newStr = new String();
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        var newCh = '';
        for (var j = 0; j < cyr2LatChars.length; j++) {
            if (ch === cyr2LatChars[j][0]) {
                newCh = cyr2LatChars[j][1];
            }
        }
        // Если найдено совпадение, то добавляется соответствие, если нет - пустая строка
        newStr += newCh;
    }
    // Удаляем повторяющие знаки - Именно на них заменяются пробелы.
    // Так же удаляем символы перевода строки, но это наверное уже лишнее
    return newStr.replace(/[_]{2,}/gim, '_').replace(/\n/gim, '');
}
exports.urlRusLat = urlRusLat;
/**
 * Проверяет, можно ли привести переданное значение в целое число.
 */
function isIntNumber(val) {
    var isInt = !isNaN(val) && val.toString().indexOf('.') < 0 && Number(val) === Math.ceil(val);
    var result;
    if (val === '-' || isInt) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
}
exports.isIntNumber = isIntNumber;
/**
 * Проверяет, можно ли привести переданное значение в число с плавающей точкой.
 */
function isFloatNumber(val) {
    var result;
    if (val === '-' || !isNaN(Number(val))) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
}
exports.isFloatNumber = isFloatNumber;
/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
*/
function getCaretPosition(input) {
    // Initialize
    var iCaretPos = 0;
    // IE Support
    if (document['selection']) {
        // Set focus on the element
        input.focus();
        // To get cursor position, get empty selection range
        var oSel = document['selection'].createRange();
        // Move selection start to 0 position
        oSel.moveStart('character', -input.value.length);
        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }
    else if (input.selectionStart || input.selectionStart === 0)
        iCaretPos = input.selectionStart;
    // Return results
    return iCaretPos;
}
exports.getCaretPosition = getCaretPosition;
/**
 * Возвращает текущий десятичный разделитель
 */
function getDecimalSeparator() {
    return (1.1).toLocaleString().substring(1, 2);
}
exports.getDecimalSeparator = getDecimalSeparator;
var debounceHandlers = [];
function debounce(fn, debounceTime, context) {
    if (!isFunction(fn))
        clearDebounce(context);
    if (isEmpty(context) && fn) {
        context = getFnBody(fn).ToMd5();
    }
    var currentHandler = debounceHandlers.firstOrDefault(function (v) { return v.context === context; });
    if (isJsObject(currentHandler)) {
        clearTimeout(currentHandler.timeoutHandler);
    }
    else {
        currentHandler = { context: context };
        debounceHandlers.push(currentHandler);
    }
    currentHandler.timeoutHandler = setTimeout(function () {
        fn();
        debounceHandlers.Remove(currentHandler);
    }, debounceTime);
    return currentHandler.timeoutHandler;
}
exports.debounce = debounce;
function clearDebounce(context) {
    if (!isEmpty(context)) {
        var currentHandler = debounceHandlers.firstOrDefault(function (v) { return v.context === context; });
        if (isJsObject(currentHandler)) {
            clearTimeout(currentHandler.timeoutHandler);
            debounceHandlers.Remove(currentHandler);
        }
    }
}
exports.clearDebounce = clearDebounce;
(function ($) {
    if ($.fn.style) {
        return;
    }
    // Escape regex chars with \
    var escape = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    // For those who need them (< IE 9), add support for CSS functions
    var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
        CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
            return this.getAttribute(a);
        };
        CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
            this.setAttribute(styleName, value);
            var priority = typeof priority != 'undefined' ? priority : '';
            if (priority != '') {
                // Add priority manually
                var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                    '(\\s*;)?', 'gmi');
                this.cssText =
                    this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
            }
        };
        CSSStyleDeclaration.prototype.removeProperty = function (a) {
            return this.removeAttribute(a);
        };
        CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
            var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
            return rule.test(this.cssText) ? 'important' : '';
        };
    }
    // The style function
    $.fn.style = function (styleName, value, priority) {
        // DOM node
        var node = this.get(0);
        // Ensure we have a DOM node
        if (typeof node == 'undefined') {
            return this;
        }
        // CSSStyleDeclaration
        var style = this.get(0).style;
        // Getter/Setter
        if (typeof styleName != 'undefined') {
            if (typeof value != 'undefined') {
                // Set style property
                priority = typeof priority != 'undefined' ? priority : '';
                style.setProperty(styleName, value, priority);
                return this;
            }
            else {
                // Get style property
                return style.getPropertyValue(styleName);
            }
        }
        else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
})(jQuery);
//# sourceMappingURL=utils.js.map