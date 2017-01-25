"use strict";
var system_component_decorator_1 = require("./system-component.decorator");
/**
 * Список помеченных данным декоратором компонентов добавляется в массив appComponents.
 * В последствии все такие компоненты можно добавить в bootstrap, указав в разделе declarations.
 */
exports.AppComponent = function () { return function (target) {
    if (!system_component_decorator_1.systemComponents.contains(target) && !system_component_decorator_1.componentModuleComponents.contains(target) && !exports.appComponents.contains(target))
        exports.appComponents.push(target);
}; };
/**
 * Список всех компонентов, помеченных декоратором @AppComponent.
 */
exports.appComponents = [];
//# sourceMappingURL=app-component.decorator.js.map