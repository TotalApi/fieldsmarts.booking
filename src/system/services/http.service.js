"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require("../utils/utils");
var core_1 = require("@angular/core");
var Json_1 = require("../utils/Json");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var Reflection_1 = require("../utils/Reflection");
var ng2_translate_1 = require("ng2-translate/ng2-translate");
var UssHttp = (function (_super) {
    __extends(UssHttp, _super);
    function UssHttp(backend, defaultOptions, msg) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.msg = msg;
        return _this;
    }
    Object.defineProperty(UssHttp, "Instance", {
        get: function () { return Reflection_1.Reflection.Injector.get(http_1.Http); },
        enumerable: true,
        configurable: true
    });
    UssHttp.prototype.createAuthorizationHeader = function (url, options) {
        if (UssHttp.translate === undefined) {
            try {
                UssHttp.translate = Reflection_1.Reflection.Injector.get(ng2_translate_1.TranslateService);
            }
            catch (e) {
                UssHttp.translate = null;
            }
        }
        var uri;
        if (url instanceof http_1.Request) {
            uri = url.url;
            options = url;
        }
        else
            uri = url;
        if (uri.indexOf('://') === -1 || (UssHttp.baseAddress && uri.StartsWith(UssHttp.baseAddress + '/', true))) {
            options = options || {};
            options.headers = options.headers || new http_1.Headers();
            if (this.AuthorizationManager && this.AuthorizationManager.IsLoggedIn) {
                options.headers.append('Authorization', "Bearer " + this.AuthorizationManager.AccessToken);
            }
            if (UssHttp.translate && UssHttp.translate.currentLang) {
                options.headers.append('X-Language', UssHttp.translate.currentLang);
            }
        }
        return options;
    };
    UssHttp.updateUrl = function (uri) {
        var url = uri;
        if (uri instanceof http_1.Request) {
            url = uri.url;
        }
        if (url && UssHttp.baseAddress && url.indexOf('/') !== 0 && url.indexOf('://') === -1) {
            url = UssHttp.baseAddress + "/" + url;
        }
        if (uri instanceof http_1.Request) {
            uri.url = url;
        }
        else {
            uri = url;
        }
        return uri;
    };
    /**
     * Выделяет ошибку из ответа серевера, возникшую при вызове методов сервиса.
     */
    UssHttp.ExctractError = function (err) {
        var _this = this;
        if (err instanceof http_1.Response) {
            try {
                err = this.ExctractError(err.json()) || err;
            }
            catch (e) {
                //return err.toString();
                return "";
            }
        }
        var error = (err || "Fatal error").toString();
        if (!err)
            return error;
        if (utils.isArray(err.data)) {
            error = (err.data).select(function (x) { return _this.ExctractError(x); }).aggregate("", function (prev, current) { return prev ? prev + "\r\n" + current : current; });
        }
        else if (typeof err.data === "object") {
            if (err.data.ModelState && typeof err.data.ModelState === "object")
                error = Enumerable.from(err.data.ModelState).select(function (kv) { return kv.value; }).toArray().join("<br/>");
            else
                error = (err.data.ExceptionMessage == undefined) ? err.data.Message : err.data.ExceptionMessage;
            if (!error && err.data.result) {
                if (typeof err.data.result === "string")
                    error = err.data.result;
                else if (typeof err.data.result === "object")
                    error = (err.data.result.ExceptionMessage == undefined) ? err.data.result.Message : err.data.result.ExceptionMessage;
            }
        }
        else if (err.ExceptionMessage !== undefined)
            error = err.ExceptionMessage.toString();
        else if (err.statusText !== undefined)
            error = err.statusText.toString();
        else if (err.data !== undefined)
            error = err.data.toString().substr(0, 100);
        else if (err.Message !== undefined)
            error = err.Message.toString();
        else if (err.error_description !== undefined || err.error !== undefined)
            error = (err.error_description || err.error).toString();
        else if (err.message) {
            error = err.message;
            if (Json_1.Json.IsJsonLike(error)) {
                err = Json_1.Json.fromJson(error);
                if (err.errorCode) {
                    error = UssHttp.translate.instant(err.errorCode);
                    if (err.developerMessage && core_1.isDevMode) {
                        error = error + "<hr/>" + err.developerMessage;
                    }
                }
                else {
                    error = this.ExctractError(err) || err;
                }
            }
        }
        error = (error || '').replace(/(?:\r\n|\r|\n)/g, '<br/>');
        if (error === '[object ProgressEvent]')
            error = 'Connection to API is lost.';
        return error;
    };
    /**
     * Обрабатывает ошибку, возникшую при вызове методов сервиса.
     */
    UssHttp.prototype.ProcessError = function (err) {
        var error = UssHttp.ExctractError(err);
        if (error) {
            if (this.msg)
                this.msg.runtimeError(error);
            else
                console.error(error);
        }
        return error;
    };
    /**
     * Обрабатывает ошибку, возникшую при вызове методов сервиса.
     */
    UssHttp.prototype.HandleError = function (error) {
        return Observable_1.Observable.throw(this.ProcessError(error));
    };
    UssHttp.TransformServiceResponse = function (data, headers, isArray) {
        if (isArray === void 0) { isArray = false; }
        // Copied from Angular default transform method
        if (utils.isString(data)) {
            // Strip json vulnerability protection prefix and trim whitespace
            var tempData = data.replace(Json_1.Json.JSON_PROTECTION_PREFIX, '').trim();
            if (tempData) {
                var contentType = headers && headers.get('Content-Type');
                if ((contentType && (contentType.indexOf(Json_1.Json.APPLICATION_JSON) === 0)) || Json_1.Json.IsJsonLike(tempData)) {
                    data = Json_1.Json.ResolveReferences(Json_1.Json.fromJson(tempData));
                    if (isArray && !utils.isArray(data))
                        data = [data];
                }
            }
        }
        /*
                if (!angular.isJsObject(data))
                    data = { result: data };
        */
        return data;
    };
    UssHttp.HandleResponse = function (response) {
        var _this = this;
        return response.map(function (value) { return _this.TransformServiceResponse(value.text(), value.headers); });
    };
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    UssHttp.prototype.request = function (url, options) {
        var _this = this;
        return _super.prototype.request.call(this, UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(function (e) { return _this.HandleError(e); });
    };
    return UssHttp;
}(http_1.Http));
UssHttp.baseAddress = BACKEND_ADDRESS;
exports.UssHttp = UssHttp;
//# sourceMappingURL=http.service.js.map