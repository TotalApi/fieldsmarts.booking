import { Type } from "@angular/core";
import {systemComponents, componentModuleComponents } from './system-component.decorator';


/**
 * Adds service to appComponents array.
 * Then this services could be added to bootstrap inside declarations section.
 */
export var AppComponent = () => target => {
    if (!systemComponents.contains(target) && !componentModuleComponents.contains(target) && !appComponents.contains(target))
        appComponents.push(target);
}

/**
 * List of all components marked by @AppComponent decorator.
 */
export var appComponents: Type<any>[] = [];
