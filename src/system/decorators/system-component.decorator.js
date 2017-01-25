"use strict";
var app_component_decorator_1 = require("./app-component.decorator");
/**
 * Список помеченных данным декоратором компонентов добавляется в массив systemViewComponents.
 * Эти компоненты автоматически войдут в состав системных модулей UssSystemModule или UssComponentsModule.
 */
exports.SystemComponent = function (addToComponentModule) { return function (target) {
    if (!exports.systemComponents.contains(target) && !exports.componentModuleComponents.contains(target) && !app_component_decorator_1.appComponents.contains(target))
        addToComponentModule ? exports.componentModuleComponents.push(target) : exports.systemComponents.push(target);
}; };
/**
 * Список всех компонентов, помеченных декоратором @SystemComponent().
 */
exports.systemComponents = [];
/**
 * Список всех компонентов, помеченных декоратором @SystemComponent(true).
 */
exports.componentModuleComponents = [];
//# sourceMappingURL=system-component.decorator.js.map