"use strict";
var ApiMethodMetadata = (function () {
    function ApiMethodMetadata(metadata) {
        if (metadata) {
            this.method = metadata.method;
            this.route = metadata.route;
            this.useBody = metadata.useBody;
        }
    }
    return ApiMethodMetadata;
}());
exports.ApiMethodMetadata = ApiMethodMetadata;
exports.ApiMethod = function (metadata) { return function (target, propertyKey, descriptor) {
    var oldFn = descriptor.value;
    descriptor.value = function () {
        metadata.caller = propertyKey;
        this['__apiMethod'] = metadata;
        return oldFn.apply(this, arguments);
    };
}; };
//# sourceMappingURL=api-method.decorator.js.map