import { Type } from "@angular/core";


/**
 * Список помеченных данным декоратором сервисов добавляется в массив systemServices.
 * Эти сервисы автоматически войдут в состав системных модулей UssSystemModule или UssComponentsModule.
 */
export var SystemService = (addToComponentModule?: boolean) => target => {
    addToComponentModule ? componentModuleServices.push(target) : systemServices.push(target);
}


/**
 * Список всех компонентов, помеченных декоратором @SystemComponent().
 */
export var systemServices: Type<any>[] = [];

/**
 * Список всех компонентов, помеченных декоратором @SystemComponent(true).
 */
export var componentModuleServices: Type<any>[] = [];
