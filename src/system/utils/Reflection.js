"use strict";
function setInjector(injector) {
    exports.AppInjector = injector;
}
exports.setInjector = setInjector;
var Reflection = (function () {
    function Reflection() {
    }
    Reflection.get = function (token, notFoundValue) {
        if (Reflection.Injector)
            return Reflection.Injector.get(token, notFoundValue);
        else
            return undefined;
    };
    Reflection.makeDecorator = function (annotationInstance, target) {
        var annotations = Reflect.getOwnMetadata('annotations', target) || [];
        annotations.push(annotationInstance);
        Reflect.defineMetadata('annotations', annotations, target);
    };
    Reflection.makePropDecorator = function (decoratorInstance, target, propertyKey, descriptor) {
        var meta = Reflect.getOwnMetadata('propMetadata', target.constructor) || {};
        meta[propertyKey] = meta[propertyKey] || [];
        meta[propertyKey].unshift(decoratorInstance);
        Reflect.defineMetadata('propMetadata', meta, target.constructor);
    };
    Reflection.makeParamDecorator = function (decoratorInstance, target, index) {
        var parameters = Reflect.getMetadata('parameters', target) || [];
        // there might be gaps if some in between parameters do not have annotations.
        // we pad with nulls.
        while (parameters.length <= index) {
            parameters.push(null);
        }
        parameters[index] = parameters[index] || [];
        var annotationsForParam = parameters[index];
        annotationsForParam.push(decoratorInstance);
        Reflect.defineMetadata('parameters', parameters, target);
    };
    Reflection.getMetadata = function (name, target, own) {
        if (own === void 0) { own = false; }
        return own ? Reflect.getOwnMetadata(name, target.constructor) : Reflect.getMetadata(name, target.constructor);
    };
    Reflection.annotations = function (target, own) {
        if (own === void 0) { own = false; }
        return Reflection.getMetadata('annotations', target, own);
    };
    Reflection.propAnnotations = function (target, own) {
        if (own === void 0) { own = false; }
        return Reflection.getMetadata('propMetadata', target, own);
    };
    Reflection.classMetadata = function (target, metadataType, own) {
        if (own === void 0) { own = false; }
        return (this.annotations(target) || []).firstOrDefault(function (x) { return x instanceof metadataType; });
    };
    Reflection.memberMetadata = function (target, memberName, metadataType, own) {
        if (own === void 0) { own = false; }
        return ((this.propAnnotations(target) || {})[memberName] || []).firstOrDefault(function (x) { return x instanceof metadataType; });
    };
    return Reflection;
}());
exports.Reflection = Reflection;
//# sourceMappingURL=Reflection.js.map