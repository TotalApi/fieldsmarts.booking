const st: any = require('stacktrace-js');

export * from './js.net.extensions';
declare var jQuery: any;

export function callerName(level: number = 0, getLastPartOfName: boolean = true) {
        let res;
        const stackTrace = st.getSync({offline: true});
        // В режиме минификации в стек добавляется ещё два вызова, начиная с метода getSync - это нужно учесть
        var self = stackTrace.firstOrDefault(x => x.functionName && (x.functionName === "getSync" /* IE */ || x.functionName.EndsWith(".getSync") /* Others */));
        if (self) {
            var index = stackTrace.indexOf(self) + 1;
            level += index;
        }
        res = stackTrace[level + 1].functionName;
        if (getLastPartOfName) {
            const arr = res.split('.');
            res = arr[arr.length - 1];
        }
    return res;
}

export function getFnBody(fn: Function): string {
    // Get content between first { and last }
    var m = fn.toString().match(/\{([\s\S]*)\}/m)[1];
    // Strip comments
    return m.replace(/^\s*\/\/.*$/mg, '');
}

export function escapeRegexp(queryToEscape: string): string {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

export function isFnEmpty(fn: Function): boolean {
    return (getFnBody(fn) || '').trim() === '';
}

export function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
export function isBlank(obj) {
    return obj === undefined || obj === null;
}
export function isBoolean(obj) {
    return typeof obj === 'boolean';
}
export function isNumber(obj) {
    return typeof obj === 'number';
}
export function isString(obj) {
    return typeof obj === 'string';
}
export function isFunction(obj) {
    return typeof obj === 'function';
}
export function isType(obj) {
    return isFunction(obj);
}
export function isStringMap(obj) {
    return typeof obj === 'object' && obj !== null;
}
var STRING_MAP_PROTO = Object.getPrototypeOf({});
export function isStrictStringMap(obj) {
    return isStringMap(obj) && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
export function isPromise(obj) {
    // allow any Promise/A+ compliant thenable.
    // It's up to the caller to ensure that obj.then conforms to the spec
    return isPresent(obj) && isFunction(obj.then);
}
export function isArray(obj) {
    return Array.isArray(obj);
}
export function toArray(obj) {
    return Array.isArray(obj) ? obj : (!!obj ? [obj] : []);
}
export function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}

/**
 * Возвращает true, если context равен null или undefined. 
 */
export function isEmpty(context: any): boolean {
    return context === undefined || context === null;
}
/**
 * Возвращает значение value, если context равен null или undefined или context в ином случае.
 */
export function ifEmpty<T>(context: T, value: T): T {
    return isEmpty(context) ? value : context;
}
/**
 * Возвращает значение value, если context равен null или undefined или context в ином случае.
 */
export function coalesce<T>(context: T, value: T): T {
    return ifEmpty(context, value);
}

export function isJsObject(o) {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}

export function isPrimitive(obj) {
    return !isJsObject(obj);
}
export function hasConstructor(value, type) {
    return value.constructor === type;
}
export function escape(s) {
    return encodeURI(s);
}
export function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export function getRandomString(digitsNum: number = 12)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < digitsNum; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Транслитерация кириллицы в URL
 */
export function urlRusLat(str: string): string {
	str = str.toLowerCase(); // все в нижний регистр
	const cyr2LatChars = new Array(
			['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
			['д', 'd'],  ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
			['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
			['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
			['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
			['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
			['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],
				
			['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
			['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
			['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
			['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
			['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
			['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
			['Ъ', ''],  ['Ы', 'Y'],
			['Ь', ''],
			['Э', 'E'],
			['Ю', 'YU'],
			['Я', 'YA'],
				
			['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'],
			['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'],
			['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'],
			['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'],
			['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'],
			['z', 'z'],
				
			['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'],['E', 'E'],
			['F', 'F'],['G', 'G'],['H', 'H'],['I', 'I'],['J', 'J'],['K', 'K'],
			['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'],['P', 'P'],
			['Q', 'Q'],['R', 'R'],['S', 'S'],['T', 'T'],['U', 'U'],['V', 'V'],
			['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],
				
			[' ', '_'],['0', '0'],['1', '1'],['2', '2'],['3', '3'],
			['4', '4'],['5', '5'],['6', '6'],['7', '7'],['8', '8'],['9', '9'],
			['-', '-'], ['/', '/']
    );

    var newStr = new String();

    for (var i = 0; i < str.length; i++) {

        let ch = str.charAt(i);
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

/**
 * Проверяет, можно ли привести переданное значение в целое число.
 */
export function isIntNumber(val: any): boolean {
    const isInt = !isNaN(val) && val.toString().indexOf('.') < 0 && Number(val) === Math.ceil(val);
    let result;
    if (val === '-' || isInt) {
        result = true;
    } else {
        result = false;
    }

    return result;
}

/**
 * Проверяет, можно ли привести переданное значение в число с плавающей точкой.
 */
export function isFloatNumber(val: any) {
    let result;

    if (val === '-' || !isNaN(Number(val))) {
        result = true;
    } else {
        result = false;
    }

    return result;
}

/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
*/
export function getCaretPosition(input: HTMLInputElement | HTMLTextAreaElement | any) {

    // Initialize
    var iCaretPos = 0;

    // IE Support
    if (document['selection']) {

        // Set focus on the element
        input.focus();

        // To get cursor position, get empty selection range
        const oSel = document['selection'].createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -input.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }

    // Firefox support
    else if (input.selectionStart || input.selectionStart === 0)
        iCaretPos = input.selectionStart;

    // Return results
    return iCaretPos;
}

/**
 * Возвращает текущий десятичный разделитель
 */
export function getDecimalSeparator(): string {
    return (1.1).toLocaleString().substring(1, 2);
}



const debounceHandlers = <{ context: string, timeoutHandler?: any }[]>[];
export function debounce(fn: Function, debounceTime?: number, context?: any): any {
    if (!isFunction(fn)) clearDebounce(context);

    if (isEmpty(context) && fn) {
        context = getFnBody(fn).ToMd5();
    }
    let currentHandler = debounceHandlers.firstOrDefault(v => v.context === context);
    if (isJsObject(currentHandler)) {
        clearTimeout(currentHandler.timeoutHandler);
    } else {
        currentHandler = { context };
        debounceHandlers.push(currentHandler);
    }
    currentHandler.timeoutHandler = setTimeout(() => {
            fn();
            debounceHandlers.Remove(currentHandler);
        },
        debounceTime);
    return currentHandler.timeoutHandler;
}

export function clearDebounce(context: any) {
    if (!isEmpty(context)) {
        const currentHandler = debounceHandlers.firstOrDefault(v => v.context === context);
        if (isJsObject(currentHandler)) {
            clearTimeout(currentHandler.timeoutHandler);
            debounceHandlers.Remove(currentHandler);
        }
    }
}


(function($) {    
  if ($.fn.style) {
    return;
  }

  // Escape regex chars with \
  var escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // For those who need them (< IE 9), add support for CSS functions
  var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
  if (!isStyleFuncSupported) {
    CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
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
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    };
    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
      var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
          'gmi');
      return rule.test(this.cssText) ? 'important' : '';
    }
  }

  // The style function
  $.fn.style = function(styleName, value, priority) {
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
      } else {
        // Get style property
        return style.getPropertyValue(styleName);
      }
    } else {
      // Get CSSStyleDeclaration
      return style;
    }
  };
})(jQuery);