"use strict";
var core_1 = require("@angular/core");
var Utils = require("../utils/utils");
// ReSharper disable once Class
/**
 * Изменения поля, название которого переданно в качестве параметра, будут автоматически вызывать метод объекта ngOnChanges, если он есть.
 * А также посылать уведомление через eventEmitter.
 * Для хранения значения создаётся и используется поле с именем __nc_values.
 * Если propertyKey не указан - помечаются все поля.
 */
function extendForPropertyChanges(target, propertyKey, eventEmitter) {
    if (!target)
        return undefined;
    var isClassPrototype = !(target instanceof target.constructor);
    if (!isClassPrototype) {
        // Добавлять eventEmitter нельзя для прототипов классов
        target.__nc_values = target.__nc_values || {};
        if (!eventEmitter) {
            if (!(target.__nc_values['$notifyChanges.emmiter'] instanceof core_1.EventEmitter)) {
                target.__nc_values['$notifyChanges.emmiter'] = new core_1.EventEmitter();
            }
            eventEmitter = target.__nc_values['$notifyChanges.emmiter'];
        }
        else {
            target.__nc_values['$notifyChanges.emmiter'] = eventEmitter;
        }
    }
    if (!propertyKey) {
        propertyKey = [];
        for (var propName in target) {
            if (!target.hasOwnProperty(propName))
                continue;
            propertyKey.push(propName);
        }
    }
    if (Utils.isArray(propertyKey)) {
        for (var _i = 0, propertyKey_1 = propertyKey; _i < propertyKey_1.length; _i++) {
            var propName = propertyKey_1[_i];
            extendForPropertyChanges(target, propName, eventEmitter);
        }
        if (eventEmitter) {
            setTimeout(function () { return eventEmitter.emit({}); });
        }
    }
    else if (typeof propertyKey === "string") {
        var prevDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
        var descriptor = { configurable: true, enumerable: true };
        var currentValue_1 = prevDescriptor.value;
        if (target.__nc_values && prevDescriptor.value !== undefined) {
            target.__nc_values[propertyKey] = currentValue_1;
        }
        // Подменяем или объявляем get и set
        var originalGet = prevDescriptor.get || function () { return this.__nc_values ? this.__nc_values[propertyKey] : currentValue_1; };
        var originalSet_1 = prevDescriptor.set || function (v) {
            this.__nc_values = this.__nc_values || {};
            this.__nc_values[propertyKey] = v;
        };
        descriptor.get = originalGet;
        descriptor.set = function (v) {
            var _this = this;
            // Внимание, если определяем set через function, 
            // то this - текущий экземпляр класса,
            // если через лямбду, то this - Window!!!
            var oldValue = this[propertyKey];
            if (v !== oldValue) {
                originalSet_1.call(this, v);
                var changes_1 = {};
                changes_1[propertyKey] = new core_1.SimpleChange(oldValue, v);
                if (this.__nc_values['$notifyChanges.emmiter'] instanceof core_1.EventEmitter) {
                    setTimeout(function () { return _this.__nc_values['$notifyChanges.emmiter'].emit(changes_1); });
                }
                if (typeof target.ngOnChanges === 'function') {
                    this.ngOnChanges(changes_1);
                }
            }
        };
        // Объявляем новое свойство, либо обновляем дескриптор
        Object.defineProperty(target, propertyKey, descriptor);
    }
    return eventEmitter;
}
exports.extendForPropertyChanges = extendForPropertyChanges;
/**
 * Изменения полей, помеченных этим декоратором будут автоматически вызывать метод объекта ngOnChanges, если он есть.
 * А также посылать уведомление через EventEmitter, помеченный декоратором @NotifyChangesEmitter.
 * Для хранения значения создаётся и используется поле с именем __nc_values.
 * Если propertyKey не указан - помечаются все поля.
 */
exports.NotifyChanges = function () { return function (target, propertyKey) { extendForPropertyChanges(target, propertyKey); }; };
//# sourceMappingURL=notify-changes.decorator.js.map