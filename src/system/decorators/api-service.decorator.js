"use strict";
var Reflection_1 = require("../utils/Reflection");
var system_service_decorator_1 = require("./system-service.decorator");
var ApiServiceMetadata /*implements IApiServiceMetadata*/ = (function () {
    function ApiServiceMetadata(url, metadata) {
        this.Url = url;
        this.Metadata = metadata;
    }
    return ApiServiceMetadata;
}());
exports.ApiServiceMetadata = ApiServiceMetadata;
exports.ApiService = function (url, metadata) { return function (target) {
    Reflection_1.Reflection.makeDecorator(new ApiServiceMetadata(url, metadata), target);
    system_service_decorator_1.systemServices.push(target);
}; };
//# sourceMappingURL=api-service.decorator.js.map