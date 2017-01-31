import { Type } from "@angular/core";
import {appComponents} from './app-component.decorator';


/**
 * Adds service to systemViewComponents array.
 * These services automatically will be included into UssSystemModule or UssComponentsModule.
 */
export var SystemComponent = (addToComponentModule?: boolean) => target => {
    if (!systemComponents.contains(target) && !componentModuleComponents.contains(target) && !appComponents.contains(target))
        addToComponentModule ? componentModuleComponents.push(target) : systemComponents.push(target);
}


/**
 * List of all components marked by @SystemComponent() decorator.
 */
export var systemComponents: Type<any>[] = [];

/**
 * List of all components marked by @SystemComponent(true) decorator.
 */
export var componentModuleComponents: Type<any>[] = [];
