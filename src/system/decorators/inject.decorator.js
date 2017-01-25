"use strict";
var Reflection_1 = require("../utils/Reflection");
/**
 * Возможность инектировать DI в поля класса.
 * Работает так же, как и соответствующий декоратор Angular2 в конструкторе.
 * Поддерживается наследование.
 */
exports.Inject = function (token) { return function (target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || { configurable: true, enumerable: true };
    // Подменяем или объявляем get и set
    var originalGet = descriptor.get || function () { return this.__nc_values ? this.__nc_values[propertyKey] : undefined; };
    var originalSet = descriptor.set || function (v) {
        this.__nc_values = this.__nc_values || {};
        this.__nc_values[propertyKey] = v;
    };
    descriptor.get = function () {
        var result = originalGet.call(this);
        if (result === undefined) {
            result = Reflection_1.Reflection.get(token);
            originalSet.call(this, result);
        }
        return result;
    };
    // Объявляем новое свойство, либо обновляем дескриптор
    Object.defineProperty(target, propertyKey, descriptor);
}; };
//# sourceMappingURL=inject.decorator.js.map