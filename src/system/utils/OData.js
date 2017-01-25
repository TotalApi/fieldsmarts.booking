"use strict";
var ODataFilterCreator_1 = require("./ODataFilterCreator");
var utils = require("./utils");
var OData = (function () {
    /**
    * Создаёт объект OData
    */
    function OData(params) {
        this._expands = [];
        this._filter = "";
        this._orderBy = [];
        this._extra = [];
        this.clear();
        if (params) {
            if (params.$expand)
                this._expands = params.$expand.split(',').select(function (s) { return (s || "").trim(); }).where(function (s) { return s !== ""; }).toArray();
            this._filter = (params.$filter || "").trim();
            if (params.$orderBy)
                this._orderBy = params.$orderBy.split(',').select(function (s) { return (s || "").trim(); }).where(function (s) { return s !== ""; }).toArray();
            this._top = params.$top;
            this._skip = params.$skip;
            this._key = params.$key;
            if (params.$extra)
                this._extra = params.$extra.split('&').select(function (s) { return (s || "").trim(); }).where(function (s) { return s !== ""; }).toArray();
        }
    }
    Object.defineProperty(OData, "create", {
        /**
        * То же самое, что и конструктор - создаёт объект OData
        */
        get: function () {
            return new OData();
        },
        enumerable: true,
        configurable: true
    });
    OData.prototype.union = function (odata) {
        if (!odata)
            return;
        odata.prop(undefined);
        if (odata._expands && odata._expands.length > 0)
            this.$expand.apply(this, odata._expands);
        if (odata._filter)
            this.$filter(odata._filter);
        if (odata._extra)
            odata._extra.forEach(function (e) { return odata.$addExtra(e); });
        if (odata._orderBy && odata._orderBy.length > 0)
            this.$orderBy.apply(this, odata._orderBy);
        if (!this._top && !this._skip) {
            this._top = odata._top;
            this._skip = odata._skip;
        }
    };
    OData.prototype.toString = function () {
        return this.query;
    };
    /**
    * Очищает все заданные параметры
    */
    OData.prototype.clear = function (leaveFilters) {
        if (!leaveFilters) {
            this.prop(undefined);
            this._filter = "";
        }
        this._expands = [];
        this._orderBy = [];
        this._top = undefined;
        this._skip = undefined;
        this._key = undefined;
        this._extra = [];
        return this;
    };
    Object.defineProperty(OData.prototype, "query", {
        /**
        * Возвращает строковое значение запроса.
        */
        get: function () {
            // update filter from current filter creator
            this.prop(undefined);
            if (this.$empty)
                return "$top=0&$filter=1 eq 0";
            var resArray = [];
            if (utils.isArray(this._expands) && this._expands.length > 0)
                resArray.push("$expand=" + this._expands.distinct().select(function (x) { return x.trim().replace(/\./g, '/'); }).toJoinedString(','));
            if (this._filter)
                resArray.push("$filter=" + this._filter);
            if (utils.isArray(this._orderBy) && this._orderBy.length > 0)
                resArray.push("$orderby=" + this._orderBy.distinct().toJoinedString(','));
            if (this._top || this._top === 0)
                resArray.push("$top=" + this._top);
            if (this._skip)
                resArray.push("$skip=" + this._skip);
            if (this._key)
                resArray.push("$key=" + this._key);
            if (utils.isArray(this._extra) && this._extra.length > 0)
                resArray.push(this._extra.distinct().toJoinedString('&'));
            var res = resArray.distinct().toJoinedString('&');
            return res;
        },
        enumerable: true,
        configurable: true
    });
    /**
    * При использовании фильтров по перечислениям необходимо использовать эту функцию,
    * для того, чтобы задать значение перечисления.
    * @param enumName полное название перечисления. Если задано короткое (без точек) - к нему будет добавлен префикс Sam.DbContext.
    * @param enumValue числовое значение перечисления
    */
    OData.enum = function (enumName, enumValue) {
        return enumValue === undefined ? undefined : new ODataEnum(enumName, enumValue);
    };
    /**
    * Добавляет к запросу параметр для получения общего количества записей в запросе (без учёта $top и $skip).
    * Результатом запроса будет не массив сущностей, а один элемент IODataMetadata.
    */
    OData.prototype.$inlinecount = function () {
        this._extra.push("$inlinecount=allpages");
        this._extra.push("$format=json");
        return this;
    };
    OData.prototype.$expand = function (p1) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        var addExpand = true;
        if (p1 === undefined || typeof p1 === "boolean") {
            addExpand = !!p1;
        }
        else {
            if (p1)
                value.push(p1.toString());
        }
        if (!addExpand)
            this._expands = [];
        for (var _a = 0, value_1 = value; _a < value_1.length; _a++) {
            var item = value_1[_a];
            item = (item || "").trim();
            if (item) {
                for (var _b = 0, _c = item.split(','); _b < _c.length; _b++) {
                    var s = _c[_b];
                    s = (s || "").trim().replace(/\./g, '/');
                    if (s && !this._expands.contains(s))
                        this._expands.push(s);
                }
            }
        }
        return this;
    };
    Object.defineProperty(OData.prototype, "hasExpand", {
        /**
         * Признак того, что установлены значения $expand
         * @returns {}
         */
        get: function () { return this._expands && this._expands.length > 0; },
        enumerable: true,
        configurable: true
    });
    OData.prototype.$orderBy = function (p1) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        var addOrderFields = false;
        if (p1 === undefined || typeof p1 === "boolean") {
            addOrderFields = !!p1;
        }
        else {
            if (p1)
                value.push(p1.toString());
        }
        if (!addOrderFields)
            this._orderBy = [];
        if (value && value[0] !== undefined && value[0] !== null) {
            for (var _a = 0, value_2 = value; _a < value_2.length; _a++) {
                var item = value_2[_a];
                item = (item || "").trim();
                if (item) {
                    for (var _b = 0, _c = item.split(','); _b < _c.length; _b++) {
                        var s = _c[_b];
                        s = (s || "").trim().replace(/\./g, '/');
                        if (s && !this._orderBy.contains(s))
                            this._orderBy.push(s);
                    }
                }
            }
        }
        return this;
    };
    Object.defineProperty(OData.prototype, "hasOrderBy", {
        /**
         * Признак того, что установлены значения $orderBy
         * @returns {}
         */
        get: function () { return this._orderBy && this._orderBy.length > 0; },
        enumerable: true,
        configurable: true
    });
    /**
    * Указывает количество записей, возвращаемых с сервера.
    */
    OData.prototype.$top = function (value) {
        this._top = value;
        return this;
    };
    /**
    * Указывает количество пропускаемых записей, возвращаемых с сервера.
    */
    OData.prototype.$skip = function (value) {
        this._skip = value;
        return this;
    };
    /**
    * Указывает ключ объекта, который используется для включения соотв. объекта в выборку данных возвращаемых с сервера.
    */
    OData.prototype.$key = function (value) {
        this._key = value;
        return this;
    };
    OData.prototype.$addExtra = function (value) {
        this._extra.push(value);
        return this;
    };
    Object.defineProperty(OData.prototype, "hasExtra", {
        /**
         * Признак того, что установлены значения $addExtra
         * @returns {}
         */
        get: function () { return this._extra && this._extra.length > 0; },
        enumerable: true,
        configurable: true
    });
    /**
        * Добавляет условие отбора по ключевому полю Id.
        * @param value Значение ключевого поля
        */
    OData.prototype.$id = function (value) {
        if (value !== undefined)
            this.prop("Id").eq(value);
        return this;
    };
    /**
    * Добавляет условие отбора 'равно' по указанному полю.
    */
    OData.prototype.eq = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).eq(isEnum ? value.toString() : value);
        return this;
    };
    /**
    * Добавляет условие отбора 'не равно' по указанному полю.
    */
    OData.prototype.ne = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).ne(isEnum ? value.toString() : value);
        return this;
    };
    /**
    * Добавляет условие отбора 'больше' по указанному полю.
    */
    OData.prototype.gt = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).gt(isEnum ? value.toString() : value);
        return this;
    };
    /**
    * Добавляет условие отбора 'больше или равно' по указанному полю.
    */
    OData.prototype.ge = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).ge(isEnum ? value.toString() : value);
        return this;
    };
    /**
    * Добавляет условие отбора 'меньше' по указанному полю.
    */
    OData.prototype.lt = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).lt(isEnum ? value.toString() : value);
        return this;
    };
    /**
    * Добавляет условие отбора 'меньше или равно' по указанному полю.
    */
    OData.prototype.le = function (propName, value, isEnum) {
        if (value !== undefined && value !== null)
            this.prop(propName).le(isEnum ? value.toString() : value);
        return this;
    };
    OData.prototype.$filter = function (p1, p2) {
        var op = p1;
        var filter = p2;
        if (filter === undefined) {
            op = "and";
            filter = p1;
        }
        if (filter) {
            if (!this._filter)
                this._filter = filter;
            else if (op === "and")
                this._filter = this._filter + " " + op + " " + filter;
            else
                this._filter = this._filter + " " + op + " (" + filter + ")";
        }
        else
            this._filter = undefined;
        return this;
    };
    OData.prototype.prop = function (propName) {
        if (this._filterCreator) {
            var query = this._filterCreator.query;
            if (query)
                this.$filter('and', query);
        }
        if (propName) {
            this._filterCreator = new ODataFilterCreator_1.ODataFilterCreator(propName);
        }
        else {
            this._filterCreator = undefined;
        }
        return this._filterCreator;
    };
    /**
    * Usage:
    *
    * odata.prop('a').eq(1);
    * odata.and(odata.prop('b').eq(2).or('c).eq(3));
    *
    * This code will generate $filter=a eq 1 and (b eq 2 or c eq 3)
    *
    */
    OData.prototype.and = function (odataOperation) {
        if (odataOperation) {
            var query = odataOperation.query;
            if (query)
                this.$filter('and', "(" + query + ")");
        }
        this._filterCreator = undefined;
        return this;
    };
    /**
     * Формирует ODATA-фильтр на основании переданного списка полей и значений.
     * @param fieldNames список полей, разделённый запятыми. Имя отдельного поля может иметь следующие форматы:
     *                   [*]<fieldName>[*]   - звёздочка означает, что спереди или сзади могут быть любые значения
     *                   <fieldName>:{i|f|d|b} - значение после двоеточия указывает тип
     *       Примеры:    *Name*    - поиск по любому вхождению текстового поля Name
     *                   Emai*     - поиск по началу текстового поля Email
     *                   *Emai     - поиск по окончанию текстового поля Email
     *                   Id        - поиск по точному соответствию текстового поля Id
     *                   Age:i     - поиск по точному соответствию целочисленного поля Age
     *                   IsValid:b - поиск по точному соответствию логического поля IsValid
     *                   Date:d    - поиск по точному соответствию поля типа дата Date (не реализовано)
     *                   Любой другой тип считается строковым. Если указаны перечисленные типы - поиск всегда производится по точному соответствию.
     * @param value проверяемое значение
     * @param splitQueryStringBySpaces false (по умолчанию) - значения полей fieldNames проверяются на соответствие значению value по условию AND
     *                                 true - текстовое значение value разбивается по пробелам и проверяется соответствие по значению OR с каждым элементом полученного массива
     */
    OData.prototype.appendQuery = function (fieldNames, value, splitQueryStringBySpaces) {
        if (splitQueryStringBySpaces === void 0) { splitQueryStringBySpaces = false; }
        var values = (splitQueryStringBySpaces && (typeof value === "string")) ? value.split(' ').select(function (x) { return x.trim(); }).where(function (x) { return !!x; }).toArray() : [value];
        var fields = fieldNames.split(',');
        var ofc = undefined;
        var op = undefined;
        for (var n = 0; n < values.length; n++) {
            var val = values[n];
            if (val === undefined || val === null)
                continue;
            for (var i = 0; i < fields.length; i++) {
                var fieldArr = fields[i].split(':');
                var field = fieldArr[0];
                // strict match
                var searchType = "eq";
                if (field.StartsWith("*") && field.EndsWith("*")) {
                    // contains
                    searchType = "contains";
                    field = field.substring(1, field.length - 1);
                }
                else if (field.StartsWith("*")) {
                    // from end
                    searchType = "endswith";
                    field = field.substring(1, field.length);
                }
                else if (field.EndsWith("*")) {
                    // from beginning
                    searchType = "startswith";
                    field = field.substring(0, field.length - 1);
                }
                var typ = (fieldArr[1] || "").toLowerCase();
                if (typ === "i" || typ === "f") {
                    // number value
                    // strict search only
                    val = typ === "i" ? parseInt(val) : parseFloat(val);
                    if (!isNaN(val)) {
                        ofc = op ? op.or(field) : (ofc || this.prop(field));
                        op = ofc.eq(parseInt(val));
                    }
                }
                else if (typ === "d") {
                }
                else if (typ === "b") {
                    // boolean value
                    ofc = op ? op.or(field) : (ofc || this.prop(field));
                    val = (val === '+' || val === '1') ? true : val;
                    val = (val === '-' || val === '0') ? false : val;
                    op = ofc.eq(val ? true : false);
                }
                else {
                    // string value
                    ofc = op ? op.or(field) : (ofc || this.prop(field));
                    op = ofc[searchType](val);
                }
            }
        }
        if (op)
            this.and(op);
    };
    return OData;
}());
exports.OData = OData;
var ODataEnum = (function () {
    function ODataEnum(name, value) {
        this.name = name;
        this.value = value;
        if (this.name.indexOf('.') === -1)
            this.name = 'Sam.DbContext.' + this.name;
    }
    ODataEnum.prototype.toString = function () {
        return this.name + "'" + this.value + "'";
    };
    return ODataEnum;
}());
//# sourceMappingURL=OData.js.map