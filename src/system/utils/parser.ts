// ReSharper disable once InconsistentNaming
const Parser = require('js-expression').Parser;

declare module JsExpression {
    abstract class Token {
        index_: number;
        number_: number;
        prio_: number;
        type_: number;
    }

    abstract class Expression {
        evaluate: (context: Object) => any;
        functions: { [fnName: string]: Function }[];
        js_expr_str: string;

        tokens: Token[];
    }

    abstract class Parser {
        consts: Object;
        evaluate: (expression: string, context: Object, defaultValue?: string) => any;
        addOperator: (name: string, priority: number, handler: Function) => never;
        addFunction: (name: string, handler: Function, canSimplify?: boolean) => never;
        overload: (operator: string, cls: Function, handler: Function) => never;
        parse: (expression: string) => Expression;
    }
}

export var parser: JsExpression.Parser = new Parser();
parser.consts = {};
parser.addFunction('iif', (cond, a, b) => (cond ? a : b));
parser.addFunction('not', cond => !cond);
parser.addOperator('!', 0, cond => !cond);

parser['__eval'] = parser.evaluate;
parser.evaluate = (expression: string, context: Object, defaultValue?: string) => {
    let val = defaultValue || '';
    if (context) {
        if (!expression) {
            val = context.toString();
        } else {
            val = parser['__eval'](expression, context);
        }
    }

    return val;
}