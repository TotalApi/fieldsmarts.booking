import { Type } from "@angular/core";
import {appComponents} from './app-component.decorator';


/**
 * Список помеченных данным декоратором компонентов добавляется в массив systemViewComponents.
 * Эти компоненты автоматически войдут в состав системных модулей UssSystemModule или UssComponentsModule.
 */
export var SystemComponent = (addToComponentModule?: boolean) => target => {
    if (!systemComponents.contains(target) && !componentModuleComponents.contains(target) && !appComponents.contains(target))
        addToComponentModule ? componentModuleComponents.push(target) : systemComponents.push(target);
}


/**
 * Список всех компонентов, помеченных декоратором @SystemComponent().
 */
export var systemComponents: Type<any>[] = [];

/**
 * Список всех компонентов, помеченных декоратором @SystemComponent(true).
 */
export var componentModuleComponents: Type<any>[] = [];
