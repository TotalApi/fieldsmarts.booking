"use strict";
var moment = require("moment");
var ODataFilterCreator = (function () {
    function ODataFilterCreator(propName, parent) {
        this.propName = propName;
        this.parent = parent;
        if (this.propName)
            this.propName = this.propName.trim().replace(/\./g, '/');
        if (parent)
            parent.child = this;
    }
    ODataFilterCreator.create = function (propName) {
        return new ODataFilterCreator(propName);
    };
    ODataFilterCreator.prototype._ = function (value) {
        if (value === undefined)
            return undefined;
        if (Array.isArray(value)) {
            var res = [];
            for (var _i = 0, _a = value; _i < _a.length; _i++) {
                var arg = _a[_i];
                res.push(this._(arg));
            }
            return res;
        }
        else {
            if (value === null)
                return "null";
            var res = value.toString();
            if (typeof value === "string") {
                res = res.replace(/'/g, "''");
                res = "'" + res + "'";
            }
            else if (typeof value === "object" && (value instanceof Date || value['_isAMomentObject'])) {
                res = moment(value).format('YYYY-MM-DD[T]HH:mm:ss');
                return "DateTime'" + res + "'";
            }
            // ToDo: somehow support enum values
            return res;
        }
    };
    Object.defineProperty(ODataFilterCreator.prototype, "lastChild", {
        get: function () {
            var res = this;
            while (res.child) {
                res = res.child;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    ODataFilterCreator.prototype.getPropName = function () {
        var res = this;
        while (res && !res.propName) {
            res = res.parent;
        }
        return res ? res.propName : undefined;
    };
    ODataFilterCreator.prototype.getQuery = function () {
        var res = undefined;
        var propName = this.propName;
        if (this.parent) {
            if (this.parent.opName !== "and" && this.parent.opName !== "or" && this.parent.opName !== "or(") {
                propName = "" + this.parent.getQuery() || propName;
            }
        }
        if (this.isNot)
            propName = "not " + propName;
        if (propName) {
            if ((!this.parent || this.parent.opName !== "or(") && this.opName && this.args) {
                if (this.isFn) {
                    var args = (this.args).join(',');
                    if (this.opName === "contains")
                        res = "substringof(" + args + "," + propName + ")";
                    else
                        res = args ? this.opName + "(" + propName + "," + args + ")" : this.opName + "(" + propName + ")";
                }
                else {
                    if (propName.indexOf("[any]") > -1) {
                        propName = propName.replace("[any]", "/any(_:_");
                        res = propName + " " + this.opName + " " + this.args + ")";
                    }
                    else if (propName.indexOf("[all]") > -1) {
                        propName = propName.replace("[all]", "/all(_:_");
                        res = propName + " " + this.opName + " " + this.args + ")";
                    }
                    else {
                        res = propName + " " + this.opName + " " + this.args;
                    }
                }
            }
            else {
                res = propName;
            }
        }
        if (this.parent) {
            if (this.parent.opName === "and" || this.parent.opName === "or")
                res = this.parent.getQuery() + " " + this.parent.opName + " " + res;
            else if (this.parent.opName === "or(")
                res = this.propName + " or (" + this.parent.args.toString() + ")";
        }
        return res;
    };
    Object.defineProperty(ODataFilterCreator.prototype, "query", {
        get: function () {
            return this.lastChild.getQuery();
        },
        enumerable: true,
        configurable: true
    });
    ODataFilterCreator.prototype.toString = function () {
        return this.query;
    };
    /**
        * Creates an arithmetic operation
        * @param op operation name
        * @param value operand value
        */
    ODataFilterCreator.prototype.aop = function (op, value) {
        if (value === undefined)
            return this;
        this.args = this._(value);
        this.opName = op;
        return new ODataFilterCreator(undefined, this);
    };
    /**
        * Creates an logical operation
        * @param op operation name
        * @param value operand value
        */
    ODataFilterCreator.prototype.lop = function (op, value, isEnum) {
        if (value === undefined)
            return this;
        this.args = this._(isEnum ? ((value === undefined || value === null) ? "null" : value.toString()) : value);
        this.opName = op;
        return new ODataFilterCreator(undefined, this);
    };
    /**
        * Creates the function expression
        * @param fn function name
        * @param args function arguments
        */
    ODataFilterCreator.prototype.fn = function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.args = this._(args);
        this.opName = fn;
        this.isFn = true;
        return new ODataFilterCreator(undefined, this);
    };
    //#region - Arithmetic Operators -
    ODataFilterCreator.prototype.add = function (value) { return this.aop("add", value); };
    ODataFilterCreator.prototype.sub = function (value) { return this.aop("sub", value); };
    ODataFilterCreator.prototype.mul = function (value) { return this.aop("mul", value); };
    ODataFilterCreator.prototype.div = function (value) { return this.aop("div", value); };
    ODataFilterCreator.prototype.mod = function (value) { return this.aop("mod", value); };
    //#endregion
    //#region - String Functions -
    ODataFilterCreator.prototype.contains = function (value) { return this.fn("contains", value).eq(true); };
    ODataFilterCreator.prototype.substringof = function (value) { return this.fn("substringof", value).eq(true); };
    ODataFilterCreator.prototype.startswith = function (value) { return this.fn("startswith", value).eq(true); };
    ODataFilterCreator.prototype.endswith = function (value) { return this.fn("endswith", value).eq(true); };
    ODataFilterCreator.prototype.length = function () { return this.fn("length"); };
    ODataFilterCreator.prototype.indexof = function (value) { return this.fn("indexof", value); };
    ODataFilterCreator.prototype.replace = function (find, replace) { return this.fn("replace", find, replace); };
    ODataFilterCreator.prototype.substring = function (pos, length) { return this.fn("substring", pos, length); };
    ODataFilterCreator.prototype.tolower = function () { return this.fn("tolower"); };
    ODataFilterCreator.prototype.toupper = function () { return this.fn("toupper"); };
    ODataFilterCreator.prototype.trim = function () { return this.fn("trim"); };
    ODataFilterCreator.prototype.concat = function (value) { return this.fn("concat", value); };
    //#endregion
    //#region - Date Functions -
    ODataFilterCreator.prototype.year = function () { return this.fn("year"); };
    ODataFilterCreator.prototype.month = function () { return this.fn("month"); };
    ODataFilterCreator.prototype.day = function () { return this.fn("day"); };
    ODataFilterCreator.prototype.hour = function () { return this.fn("hour"); };
    ODataFilterCreator.prototype.minute = function () { return this.fn("minute"); };
    ODataFilterCreator.prototype.second = function () { return this.fn("second"); };
    ODataFilterCreator.prototype.fractionalseconds = function () { return this.fn("fractionalseconds"); };
    ODataFilterCreator.prototype.date = function () { return this.fn("date"); };
    ODataFilterCreator.prototype.time = function () { return this.fn("time"); };
    ODataFilterCreator.prototype.totaloffsetminutes = function () { return this.fn("totaloffsetminutes"); };
    ODataFilterCreator.prototype.totalseconds = function () { return this.fn("totalseconds"); };
    //#endregion
    //#region - Math Functions -
    ODataFilterCreator.prototype.round = function () { return this.fn("round"); };
    ODataFilterCreator.prototype.floor = function () { return this.fn("floor"); };
    ODataFilterCreator.prototype.ceiling = function () { return this.fn("ceiling"); };
    //#endregion
    //#region - Logical Functions -
    ODataFilterCreator.prototype.eq = function (value, isEnum) { return this.lop("eq", value, isEnum); };
    ODataFilterCreator.prototype.ne = function (value, isEnum) { return this.lop("ne", value, isEnum); };
    ODataFilterCreator.prototype.gt = function (value, isEnum) { return this.lop("gt", value, isEnum); };
    ODataFilterCreator.prototype.ge = function (value, isEnum) { return this.lop("ge", value, isEnum); };
    ODataFilterCreator.prototype.lt = function (value, isEnum) { return this.lop("lt", value, isEnum); };
    ODataFilterCreator.prototype.le = function (value, isEnum) { return this.lop("le", value, isEnum); };
    //#endregion
    //#region - Logical Operators -
    ODataFilterCreator.prototype.not = function () { this.isNot = true; return this; };
    ODataFilterCreator.prototype.and = function (propName) {
        this.opName = "and";
        propName = propName || this.getPropName();
        return new ODataFilterCreator(propName, this);
    };
    ODataFilterCreator.prototype.or = function (p) {
        var propName = p;
        if (propName instanceof ODataFilterCreator) {
            var res = new ODataFilterCreator(this.query, this);
            this.opName = "or(";
            this.args = propName;
            return res;
        }
        else {
            this.opName = "or";
            propName = propName || this.getPropName();
            return new ODataFilterCreator(propName, this);
        }
    };
    return ODataFilterCreator;
}());
exports.ODataFilterCreator = ODataFilterCreator;
//# sourceMappingURL=ODataFilterCreator.js.map