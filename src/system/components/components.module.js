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
require("./");
var system_module_1 = require("../system.module");
/*
    Angular
*/
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
/*
    3rd party
*/
//import * as ng2Translate from 'ng2-translate/ng2-translate';
//import * as primeng from 'primeng/primeng';
/*
    App
*/
var system_component_decorator_1 = require("../decorators/system-component.decorator");
var system_service_decorator_1 = require("../decorators/system-service.decorator");
var UssComponentsModule = (function () {
    function UssComponentsModule() {
    }
    return UssComponentsModule;
}());
UssComponentsModule = __decorate([
    core_1.NgModule({
        declarations: [system_component_decorator_1.componentModuleComponents],
        exports: [system_component_decorator_1.componentModuleComponents],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            router_1.RouterModule,
            //        ng2Translate.TranslateModule.forRoot(),
            //        primeng.ButtonModule, primeng.DataTableModule, primeng.InputTextModule, 
            system_module_1.UssSystemModule
        ],
        providers: [
            system_service_decorator_1.componentModuleServices
        ],
        schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
    }),
    __metadata("design:paramtypes", [])
], UssComponentsModule);
exports.UssComponentsModule = UssComponentsModule;
//# sourceMappingURL=components.module.js.map