import { Type } from "@angular/core";


/**
 * Adds service to systemServices array.
 * These services automatically will be included into UssSystemModule or UssComponentsModule.
 */
export var SystemService = (addToComponentModule?: boolean) => target => {
    addToComponentModule ? componentModuleServices.push(target) : systemServices.push(target);
}


/**
 * List of all components marked by @SystemComponent() decorator.
 */
export var systemServices: Type<any>[] = [];

/**
 * List of all components marked by @SystemComponent(true) decorator.
 */
export var componentModuleServices: Type<any>[] = [];
