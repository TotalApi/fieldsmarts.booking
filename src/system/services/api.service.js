"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var Json_1 = require("../utils/Json");
var OData_1 = require("../utils/OData");
var http_1 = require("@angular/http");
var utils = require("../utils/utils");
var Reflection_1 = require("../utils/Reflection");
var api_service_decorator_1 = require("../decorators/api-service.decorator");
var api_method_decorator_1 = require("../decorators/api-method.decorator");
var http_service_1 = require("./http.service");
/**
 * Описание нашего базового интерфейса API-контроллера ресурсов
 */
var UssApiService = (function () {
    function UssApiService(http) {
        this.http = http;
        this.http = http || Reflection_1.Reflection.get(http_1.Http);
        this.serviceDescription = Reflection_1.Reflection.classMetadata(this, api_service_decorator_1.ApiServiceMetadata);
        this.url = this.serviceDescription ? this.serviceDescription.Url : undefined;
    }
    UssApiService.updateMethod = function (method, fnName) {
        fnName = (fnName || '').toUpperCase();
        if (!method) {
            if (fnName.StartsWith('GET') || fnName.StartsWith('LOAD'))
                method = "GET";
            else if (fnName.StartsWith('DELETE') || fnName.StartsWith('REMOVE'))
                method = "DELETE";
            else
                method = "POST";
        }
        return method.toUpperCase();
    };
    UssApiService.objectToStringParams = function (params, url, methodDescriptor) {
        var res = url || "";
        if (methodDescriptor.route && methodDescriptor.route.StartsWith("/")) {
            res = methodDescriptor.route.substr(1);
        }
        else if (methodDescriptor.route && methodDescriptor.route !== "/") {
            if (!methodDescriptor.route.StartsWith('/') && !res.EndsWith('/'))
                res = res + "/";
            res = res + methodDescriptor.route;
        }
        if (methodDescriptor.useBody === undefined) {
            methodDescriptor.useBody = methodDescriptor.method === "POST"
                || methodDescriptor.method === "PUT"
                || methodDescriptor.method === "PATCH";
        }
        else if (methodDescriptor.method === "GET" || methodDescriptor.method === "DELETE" || methodDescriptor.method === "HEAD" || methodDescriptor.method === "OPTIONS") {
            methodDescriptor.useBody = false;
        }
        var prefix = res.indexOf("?") === -1 ? "?" : "&";
        if (!utils.isString(params)) {
            for (var param in params) {
                if (params.hasOwnProperty(param)) {
                    if (param === "$query") {
                        res = "" + res + prefix + param;
                        prefix = "&";
                        delete params[param];
                    }
                    else if (res.indexOf("{" + param + "}") !== -1) {
                        res = res.replace("{" + param + "}", encodeURIComponent(params[param]));
                        delete params[param];
                    }
                }
            }
            if (!methodDescriptor.useBody) {
                for (var param in params) {
                    if (params.hasOwnProperty(param)) {
                        res = "" + res + prefix + param + "=" + encodeURIComponent(params[param]);
                        prefix = "&";
                        delete params[param];
                    }
                }
            }
        }
        else if (!methodDescriptor.useBody) {
            res = res + prefix + params;
        }
        return http_service_1.UssHttp.updateUrl(res);
    };
    UssApiService.prototype.request = function (params, methodDescriptor, options) {
        params = params || {};
        var paramsObject = params instanceof OData_1.OData ? params.query : Json_1.Json.clone(params);
        var caller = '';
        methodDescriptor = methodDescriptor || this['__apiMethod'];
        if (!methodDescriptor) {
            caller = utils.callerName(1);
            methodDescriptor = (Reflection_1.Reflection.memberMetadata(this, caller, api_method_decorator_1.ApiMethodMetadata) || {});
        }
        caller = methodDescriptor.caller || caller;
        methodDescriptor.method = UssApiService.updateMethod(methodDescriptor.method, caller);
        switch (methodDescriptor.method) {
            case "GET": return http_service_1.UssHttp.HandleResponse(this.http.get(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "POST": return http_service_1.UssHttp.HandleResponse(this.http.post(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "PUT": return http_service_1.UssHttp.HandleResponse(this.http.put(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "DELETE": return http_service_1.UssHttp.HandleResponse(this.http.delete(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "PATCH": return http_service_1.UssHttp.HandleResponse(this.http.patch(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "HEAD": return http_service_1.UssHttp.HandleResponse(this.http.head(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "OPTIONS": return http_service_1.UssHttp.HandleResponse(this.http.options(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            default:
                options = options || { method: methodDescriptor.method, body: paramsObject };
                options.method = options.method || methodDescriptor.method;
                options.body = options.body || paramsObject;
                return http_service_1.UssHttp.HandleResponse(this.http.request(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
        }
    };
    UssApiService.prototype.create = function (object) {
        return this.update(object, true);
    };
    UssApiService.prototype.update = function (object, isNew) {
        var method = { method: isNew ? 'POST' : 'PUT', route: '', useBody: true };
        return this.request(object, method);
    };
    return UssApiService;
}());
UssApiService = __decorate([
    __param(0, core_1.Optional()),
    __metadata("design:paramtypes", [http_1.Http])
], UssApiService);
exports.UssApiService = UssApiService;
//# sourceMappingURL=api.service.js.map