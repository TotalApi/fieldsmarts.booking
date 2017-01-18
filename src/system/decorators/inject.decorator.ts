import { Type, SimpleChanges, SimpleChange, EventEmitter } from "@angular/core";
import {Reflection} from '../utils/Reflection';


/**
 * Возможность инектировать DI в поля класса.
 * Работает так же, как и соответствующий декоратор Angular2 в конструкторе.
 * Поддерживается наследование.
 */
export var Inject = (token: Type<any>) => (target: any, propertyKey: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || <PropertyDescriptor>{ configurable: true, enumerable: true };
    // Подменяем или объявляем get и set
    const originalGet = descriptor.get || function () { return this.__nc_values ? this.__nc_values[<string>propertyKey] : undefined };
    const originalSet = descriptor.set || function (v) {
        this.__nc_values = this.__nc_values || {};
        this.__nc_values[<string>propertyKey] = v;
    };
    descriptor.get = function() {
        let result = originalGet.call(this);
        if (result === undefined) {
            result = Reflection.get(token);
            originalSet.call(this, result);
        }
        return result;
    }
    // Объявляем новое свойство, либо обновляем дескриптор
    Object.defineProperty(target, propertyKey, descriptor);
};
