import * as utils from "./utils";
import { DateTime } from "./DateTime";
import _ = require('lodash');

export namespace Json {

        // Copied from angular-scenario.js
        // ReSharper disable InconsistentNaming
        export var APPLICATION_JSON = 'application/json';
        export var CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': APPLICATION_JSON + ';charset=utf-8' };
        export var JSON_START = /^\[|^\{(?!\{)/;
        export var JSON_ENDS = {
            '[': /]$/,
            '{': /}$/
        };
        export var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
        // ReSharper restore InconsistentNaming


        /**
         * Json.Net может возвращать объекты или массывы объектов с перекрёстными или повторяющимися ссылками в
         * сокращённом варианте при котором повторяющищиеся объекты и ссылки на них передаются в виде идентификаторов.
         * Данный метод восстанавливает полных граф этих объектов.
         */
        export function ResolveReferences(source: any): any {
            let res;
            if (utils.isString(source)) {
                res = DateTime.ToDate(source);
            } else {
                var byid = {}, // all objects by id
                    refs = []; // references to objects that could not be resolved

                res = (function recurse(obj, prop?: string | number, parent?: Object) {
                    if (typeof obj !== 'object' || !obj) // a primitive value
                        return obj;

                    if (obj && Object.prototype.toString.call(obj) === '[object Array]') {
                        for (var i = 0; i < obj.length; i++)
                            // check also if the array element is not a primitive value
                            if (typeof obj[i] !== 'object' || !obj[i]) // a primitive value
                                continue;
                            else if ("$ref" in obj[i])
                                obj[i] = recurse(obj[i], i, obj);
                            else
                                obj[i] = recurse(obj[i], prop, obj);
                        return obj;
                    }
                    if (obj && "$ref" in obj) { // a reference
                        const ref = obj.$ref;
                        if (ref in byid)
                            return byid[ref];
                        // else we have to make it lazy:
                        refs.push([parent, prop, ref]);
                        return undefined;
                    } else if (obj) {
                        const id = obj.$id;
                        if (id) {
                            delete obj.$id;
                            byid[id] = obj;
                        }

                        if ('$values' in obj) // an array
                            obj = obj.$values.map(recurse);
                        else { // a plain object
                            for (let p in obj) {
                                if (obj.hasOwnProperty(p))
                                    obj[p] = recurse(obj[p], p, obj);
                            }
                        }
                    }
                    return obj;
                })(source); // run it!

                for (let i = 0; i < refs.length; i++) { // resolve previously unknown references
                    const ref = refs[i];
                    ref[0][ref[1]] = byid[refs[2]];
                    // Notice that this throws if you put in a reference at top-level
                }
            }
            return res;
        }


        /**
         * Проверяет, является ли строка корректной Json-строкой
         */
        export function IsJsonLike(str: string): boolean {
            const jsonStart = str.match(JSON_START);
            return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
        }

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
        export function fromJson(json): any {
            return utils.isString(json)
                ? JSON.parse(json)
                : json;
        }

        export function toJson(obj: any, format?: boolean, sort?: boolean, indent?: string): string {
            if (obj && typeof obj === 'object' && (sort || format)) {
                let res = '';
                let propSeparator = '';
                let propStart = '';
                let propEnd = '';
                if (format) {
                    propSeparator = ' ';
                    indent = indent || '';
                    propEnd = '\r\n' + indent;
                    indent += '    ';
                    propStart = '\r\n' + indent;
                }
                const keys = Object.keys(obj);
                if (sort) keys.sort();
                for (let i = 0; i < keys.length; i++) {
                    const propName = keys[i];
                    let propValue = obj[propName];
                    propValue = toJson(propValue, format, sort, indent);
                    res += `${propStart}"${propName}":${propSeparator}${propValue}${i === keys.length - 1  ? '' : ','}`;
                }
                res = `{${res}${propEnd}}`;
                return res;
            } else {
                return JSON.stringify(obj);    
            }
        }

        export function clone<T>(obj: T): T {
            if (!obj) return obj;
            return fromJson(toJson(obj));
        }

        export function assign<T, TSource>(target: T, source: TSource): T & TSource {
            if (source === null || source === undefined || typeof source !== "object") {
                return <any>target;
            } else {
                return _.assign(target, source);    
            }
            
        }

}
