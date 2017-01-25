"use strict";
var utils = require("./utils");
var DateTime_1 = require("./DateTime");
var _ = require("lodash");
var Json;
(function (Json) {
    // Copied from angular-scenario.js
    // ReSharper disable InconsistentNaming
    Json.APPLICATION_JSON = 'application/json';
    Json.CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': Json.APPLICATION_JSON + ';charset=utf-8' };
    Json.JSON_START = /^\[|^\{(?!\{)/;
    Json.JSON_ENDS = {
        '[': /]$/,
        '{': /}$/
    };
    Json.JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
    // ReSharper restore InconsistentNaming
    /**
     * Json.Net может возвращать объекты или массывы объектов с перекрёстными или повторяющимися ссылками в
     * сокращённом варианте при котором повторяющищиеся объекты и ссылки на них передаются в виде идентификаторов.
     * Данный метод восстанавливает полных граф этих объектов.
     */
    function ResolveReferences(source) {
        var res;
        if (utils.isString(source)) {
            res = DateTime_1.DateTime.ToDate(source);
        }
        else {
            var byid = {}, // all objects by id
            refs = []; // references to objects that could not be resolved
            res = (function recurse(obj, prop, parent) {
                if (typeof obj !== 'object' || !obj)
                    return obj;
                if (obj && Object.prototype.toString.call(obj) === '[object Array]') {
                    for (var i = 0; i < obj.length; i++)
                        // check also if the array element is not a primitive value
                        if (typeof obj[i] !== 'object' || !obj[i])
                            continue;
                        else if ("$ref" in obj[i])
                            obj[i] = recurse(obj[i], i, obj);
                        else
                            obj[i] = recurse(obj[i], prop, obj);
                    return obj;
                }
                if (obj && "$ref" in obj) {
                    var ref = obj.$ref;
                    if (ref in byid)
                        return byid[ref];
                    // else we have to make it lazy:
                    refs.push([parent, prop, ref]);
                    return undefined;
                }
                else if (obj) {
                    var id = obj.$id;
                    if (id) {
                        delete obj.$id;
                        byid[id] = obj;
                    }
                    if ('$values' in obj)
                        obj = obj.$values.map(recurse);
                    else {
                        for (var p in obj) {
                            if (obj.hasOwnProperty(p))
                                obj[p] = recurse(obj[p], p, obj);
                        }
                    }
                }
                return obj;
            })(source); // run it!
            for (var i = 0; i < refs.length; i++) {
                var ref = refs[i];
                ref[0][ref[1]] = byid[refs[2]];
            }
        }
        return res;
    }
    Json.ResolveReferences = ResolveReferences;
    /**
     * Проверяет, является ли строка корректной Json-строкой
     */
    function IsJsonLike(str) {
        var jsonStart = str.match(Json.JSON_START);
        return jsonStart && Json.JSON_ENDS[jsonStart[0]].test(str);
    }
    Json.IsJsonLike = IsJsonLike;
    /**
     * @ngdoc function
     * @name angular.fromJson
     * @module ng
     * @kind function
     *
     * @description
     * Deserializes a JSON string.
     *
     * @param {string} json JSON string to deserialize.
     * @returns {Object|Array|string|number} Deserialized JSON string.
     */
    function fromJson(json) {
        return utils.isString(json)
            ? JSON.parse(json)
            : json;
    }
    Json.fromJson = fromJson;
    function toJson(obj) {
        return JSON.stringify(obj);
    }
    Json.toJson = toJson;
    function clone(obj) {
        if (!obj)
            return obj;
        return fromJson(toJson(obj));
    }
    Json.clone = clone;
    function assign(target, source) {
        if (source === null || source === undefined || typeof source !== "object") {
            return target;
        }
        else {
            return _.assign(target, source);
        }
    }
    Json.assign = assign;
})(Json = exports.Json || (exports.Json = {}));
//# sourceMappingURL=Json.js.map