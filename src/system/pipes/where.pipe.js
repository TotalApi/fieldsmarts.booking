"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var system_component_decorator_1 = require("../decorators/system-component.decorator");
var utils_1 = require("../utils/utils");
/**
* Sample 1:
* "person in people | ussWhere: { '!name': $select.search, age: $select.search}"
* performs a AND between 'person.name !== $select.search' and 'person.age == $select.search'.
*
* Sample 2:
* "person in people | ussWhere: 'selected'"
* performs '!!person.selected'.
*
* Sample 3:
* "person in people | ussWhere: '!selected'"
* performs '!person.selected'.
*/
var UssWherePipe = (function () {
    function UssWherePipe() {
    }
    UssWherePipe.prototype.transform = function (items, condition) {
        var res = items;
        if (condition && utils_1.isArray(items)) {
            if (typeof condition === "object") {
                return items.where(function (item) {
                    var itemMatches = false;
                    var keys = Object.keys(condition);
                    for (var i = 0; i < keys.length; i++) {
                        var not = false;
                        var prop = keys[i];
                        if (prop.startsWith('!')) {
                            prop = prop.substring(1);
                            not = true;
                        }
                        var condValue = condition[prop];
                        var propValue = item[prop];
                        // Если проверяемое значение не установлено, необходимо обеспечить правильность сравнений следующего вида
                        // null == undefined
                        // 0 == undefined
                        // false == undefined
                        // '' == undefined
                        if (propValue === undefined && condValue !== undefined) {
                            if (condValue === null)
                                propValue = null;
                            else if (condValue === 0)
                                propValue = 0;
                            else if (condValue === false)
                                propValue = false;
                            else if (condValue === '')
                                propValue = '';
                        }
                        itemMatches = propValue === condValue;
                        if (not)
                            itemMatches = !itemMatches;
                        if (!itemMatches)
                            break;
                    }
                    return itemMatches;
                }).toArray();
            }
            else {
                if (condition.startsWith('!')) {
                    condition = condition.substring(1);
                    res = items.filter(function (item) { return !item[condition]; });
                }
                else {
                    res = items.filter(function (item) { return !!item[condition]; });
                }
            }
        }
        return res;
    };
    return UssWherePipe;
}());
UssWherePipe = __decorate([
    core_1.Pipe({
        name: 'ussWhere',
        pure: false
    }),
    system_component_decorator_1.SystemComponent(),
    __metadata("design:paramtypes", [])
], UssWherePipe);
exports.UssWherePipe = UssWherePipe;
//# sourceMappingURL=where.pipe.js.map