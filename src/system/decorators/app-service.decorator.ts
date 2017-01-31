import { Type } from "@angular/core";


/**
 * Adds service to appServices array.
 * Then this services could be added to bootstrap inside providers section.
 */
export var AppService = () => target => { appServices.push(target); }

/**
 * List of all components marked by @AppService decorator.
 */
export var appServices: Type<any>[] = [];
