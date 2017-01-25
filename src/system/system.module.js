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
require("./services");
require("./decorators");
require("./pipes");
require("./directives");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ng2_toastr_1 = require("ng2-toastr");
var error_handler_1 = require("./services/error-handler");
var Reflection_1 = require("./utils/Reflection");
var system_component_decorator_1 = require("./decorators/system-component.decorator");
var system_service_decorator_1 = require("./decorators/system-service.decorator");
var http_service_1 = require("./services/http.service");
var messages_service_1 = require("./services/messages.service");
var UssSystemModule = UssSystemModule_1 = (function () {
    function UssSystemModule(injector) {
        this.injector = injector;
        Reflection_1.Reflection.Injector = injector;
        UssSystemModule_1.Injector = injector;
        window.alert = function (msg) { return messages_service_1.UssMessagesService.Instance.info(msg); };
    }
    return UssSystemModule;
}());
UssSystemModule = UssSystemModule_1 = __decorate([
    core_1.NgModule({
        declarations: [system_component_decorator_1.systemComponents],
        exports: [system_component_decorator_1.systemComponents],
        imports: [
            http_1.HttpModule,
            ng2_toastr_1.ToastModule.forRoot(new ng2_toastr_1.ToastOptions({
                animate: "flyRight",
                maxShown: 10,
                positionClass: "toast-bottom-right",
            }))
        ],
        providers: [
            { provide: core_1.ErrorHandler, useClass: error_handler_1.ErrorHandler },
            system_service_decorator_1.systemServices,
            {
                provide: http_1.Http,
                useFactory: function (backend, defaultOptions, msg) {
                    var res = new http_service_1.UssHttp(backend, defaultOptions, msg);
                    return res;
                },
                deps: [http_1.XHRBackend, http_1.RequestOptions, messages_service_1.UssMessagesService]
            }
        ],
        schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
    }),
    __metadata("design:paramtypes", [core_1.Injector])
], UssSystemModule);
exports.UssSystemModule = UssSystemModule;
var UssSystemModule_1;
//# sourceMappingURL=system.module.js.map