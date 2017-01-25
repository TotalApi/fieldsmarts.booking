"use strict";
/**
 * Список помеченных данным декоратором сервисов добавляется в массив systemServices.
 * Эти сервисы автоматически войдут в состав системных модулей UssSystemModule или UssComponentsModule.
 */
exports.SystemService = function (addToComponentModule) { return function (target) {
    addToComponentModule ? exports.componentModuleServices.push(target) : exports.systemServices.push(target);
}; };
/**
 * Список всех компонентов, помеченных декоратором @SystemComponent().
 */
exports.systemServices = [];
/**
 * Список всех компонентов, помеченных декоратором @SystemComponent(true).
 */
exports.componentModuleServices = [];
//# sourceMappingURL=system-service.decorator.js.map