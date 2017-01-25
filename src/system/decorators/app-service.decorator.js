"use strict";
/**
 * Список помеченных данным декоратором сервисов добавляется в массив appServices.
 * В последствии все такие сервисы можно добавить в bootstrap, указав в разделе providers.
 */
exports.AppService = function () { return function (target) { exports.appServices.push(target); }; };
/**
 * Список всех компонентов, помеченных декоратором @AppService.
 */
exports.appServices = [];
//# sourceMappingURL=app-service.decorator.js.map