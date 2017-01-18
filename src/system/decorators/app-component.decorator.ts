import { Type } from "@angular/core";
import {systemComponents, componentModuleComponents } from './system-component.decorator';


/**
 * Список помеченных данным декоратором компонентов добавляется в массив appComponents.
 * В последствии все такие компоненты можно добавить в bootstrap, указав в разделе declarations.
 */
export var AppComponent = () => target => {
    if (!systemComponents.contains(target) && !componentModuleComponents.contains(target) && !appComponents.contains(target))
        appComponents.push(target);
}

/**
 * Список всех компонентов, помеченных декоратором @AppComponent.
 */
export var appComponents: Type<any>[] = [];
