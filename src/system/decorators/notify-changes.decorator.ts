import { Type, SimpleChanges, SimpleChange, EventEmitter } from "@angular/core";
import * as Utils from '../utils/utils';


// ReSharper disable once Class
/**
 * Field changes, which name is passed as parameter, will automatically fire ngOnChanges method if it exists.
 * And also sends notification by eventEmitter.
 * For saving values creates and uses field with name __nc_values.
 * If propertyKey not set - all fields will be marked.
 */
export function extendForPropertyChanges(target: any, propertyKey?: string | string[], eventEmitter?: EventEmitter<SimpleChanges>) {
    if (!target) return undefined;
    const isClassPrototype = !(target instanceof target.constructor);
    if (!isClassPrototype) {
        // Adding eventEmitter is not permitted for class prototypes
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
        // Replacing get and set
        const originalGet = prevDescriptor.get || function () { return this.__nc_values ? this.__nc_values[<string>propertyKey] : currentValue };
        const originalSet = prevDescriptor.set || function (v) {
            this.__nc_values = this.__nc_values || {};
            this.__nc_values[<string>propertyKey] = v;
        };
        descriptor.get = originalGet;

        descriptor.set = function (v: any) {
            // Warning, if set id defined by function, 
            // then this - current class instance,
            // if by lambda then this - Window!!!
            const oldValue = this[<string>propertyKey];
            if (v !== oldValue) {
                originalSet.call(this, v);

                const changes = { };
//                changes[<string>propertyKey] = new SimpleChange(oldValue, v, false);  // for angular 4.0.0
                changes[<string>propertyKey] = new SimpleChange(oldValue, v);
                if (this.__nc_values['$notifyChanges.emmiter'] instanceof EventEmitter) {
                    setTimeout(() => this.__nc_values['$notifyChanges.emmiter'].emit(changes));
                }
                if (typeof target.ngOnChanges === 'function') {
                    this.ngOnChanges(changes);
                }
            }
        };
        // Updating new property or updating descriptor
        Object.defineProperty(target, propertyKey, descriptor);
    }
    return eventEmitter;
}

/**
 * Changing fields marked by this decorator will be automatically fire ngOnChanges, if it exists.
* And also sends notification by eventEmitter.
 * For saving values creates and uses field with name __nc_values.
 * If propertyKey not set - all fields will be marked.
 */
export var NotifyChanges = () => (target, propertyKey) => { extendForPropertyChanges(target, propertyKey); };


