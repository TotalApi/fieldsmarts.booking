import { Type } from "@angular/core";


/**
 * Список помеченных данным декоратором сервисов добавляется в массив appServices.
 * В последствии все такие сервисы можно добавить в bootstrap, указав в разделе providers.
 */
export var AppService = () => target => { appServices.push(target); }

/**
 * Список всех компонентов, помеченных декоратором @AppService.
 */
export var appServices: Type<any>[] = [];
