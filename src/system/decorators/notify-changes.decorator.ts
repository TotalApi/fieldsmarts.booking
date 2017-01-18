import { Type, SimpleChanges, SimpleChange, EventEmitter } from "@angular/core";
import * as Utils from '../utils/utils';


// ReSharper disable once Class
/**
 * Изменения поля, название которого переданно в качестве параметра, будут автоматически вызывать метод объекта ngOnChanges, если он есть.
 * А также посылать уведомление через eventEmitter.
 * Для хранения значения создаётся и используется поле с именем __nc_values.
 * Если propertyKey не указан - помечаются все поля.
 */
export function extendForPropertyChanges(target: any, propertyKey?: string | string[], eventEmitter?: EventEmitter<SimpleChanges>) {
    if (!target) return undefined;
    const isClassPrototype = !(target instanceof target.constructor);
    if (!isClassPrototype) {
        // Добавлять eventEmitter нельзя для прототипов классов
        target.__nc_values = target.__nc_values || {};
        if (!eventEmitter) {
            if (!(target.__nc_values['$notifyChanges.emmiter'] instanceof EventEmitter)) {
                target.__nc_values['$notifyChanges.emmiter'] = new EventEmitter<SimpleChanges>();
            }
            eventEmitter = target.__nc_values['$notifyChanges.emmiter'];
        } else {
            target.__nc_values['$notifyChanges.emmiter'] = eventEmitter;
        }
    }
    if (!propertyKey) {
        propertyKey = [];
        for (let propName in target) {
            if (!target.hasOwnProperty(propName)) continue;
            (<string[]>propertyKey).push(propName);
        }
    }
    if (Utils.isArray(propertyKey)) {
        for (let propName of propertyKey) {
            extendForPropertyChanges(target, propName, eventEmitter);
        }
        if (eventEmitter) {
            setTimeout(() => eventEmitter.emit({}));
        }
    } else if (typeof propertyKey === "string") {
        const prevDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || <PropertyDescriptor>{};
        const descriptor = <PropertyDescriptor>{ configurable: true, enumerable: true };
        const currentValue = prevDescriptor.value;
        if (target.__nc_values && prevDescriptor.value !== undefined) {
            target.__nc_values[<string>propertyKey] = currentValue;
        }
        // Подменяем или объявляем get и set
        const originalGet = prevDescriptor.get || function () { return this.__nc_values ? this.__nc_values[<string>propertyKey] : currentValue };
        const originalSet = prevDescriptor.set || function (v) {
            this.__nc_values = this.__nc_values || {};
            this.__nc_values[<string>propertyKey] = v;
        };
        descriptor.get = originalGet;

        descriptor.set = function (v: any) {
            // Внимание, если определяем set через function, 
            // то this - текущий экземпляр класса,
            // если через лямбду, то this - Window!!!
            const oldValue = this[<string>propertyKey];
            if (v !== oldValue) {
                originalSet.call(this, v);

                const changes = { };
                changes[<string>propertyKey] = new SimpleChange(oldValue, v);
                if (this.__nc_values['$notifyChanges.emmiter'] instanceof EventEmitter) {
                    setTimeout(() => this.__nc_values['$notifyChanges.emmiter'].emit(changes));
                }
                if (typeof target.ngOnChanges === 'function') {
                    this.ngOnChanges(changes);
                }
            }
        };
        // Объявляем новое свойство, либо обновляем дескриптор
        Object.defineProperty(target, propertyKey, descriptor);
    }
    return eventEmitter;
}

/**
 * Изменения полей, помеченных этим декоратором будут автоматически вызывать метод объекта ngOnChanges, если он есть.
 * А также посылать уведомление через EventEmitter, помеченный декоратором @NotifyChangesEmitter.
 * Для хранения значения создаётся и используется поле с именем __nc_values.
 * Если propertyKey не указан - помечаются все поля.
 */
export var NotifyChanges = () => (target, propertyKey) => { extendForPropertyChanges(target, propertyKey); };


