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
/*
    Angular
*/
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var core_2 = require("angular2-google-maps/core");
/*
    3rd party
*/
var ng2Translate = require("ng2-translate");
//import * as primeng from 'primeng/primeng';
/*
    App
*/
var system = require("src/system");
require("./pages");
require("./components");
require("./services");
var app_1 = require("./app");
var app_routes_1 = require("src/app/app.routes");
var translate_service_1 = require("./services/translate.service");
var AppModule = (function () {
    function AppModule(translate, auth) {
        this.translate = translate;
        this.auth = auth;
        translate.init();
        auth.Login('lionsoft@ukr.net', 'P@ssw0rd');
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_1.AppComponent,
            system.appComponents,
            app_routes_1.AppRoutes.components
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            forms_1.ReactiveFormsModule,
            router_1.RouterModule.forRoot(app_routes_1.AppRoutes.config),
            ng2Translate.TranslateModule.forRoot(),
            system.UssSystemModule,
            system.UssComponentsModule,
            core_2.AgmCoreModule.forRoot({
                libraries: ["places"],
                apiKey: 'AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA'
            })
        ],
        providers: [
            system.appServices,
            { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
            {
                provide: ng2Translate.TranslateLoader,
                useFactory: function (http) { return new translate_service_1.AppTranslateLoader(http, 'http://192.168.3.202:7202/locales', '.json'); },
                deps: [http_1.Http]
            },
            {
                provide: ng2Translate.MissingTranslationHandler,
                useFactory: function (http) { return new translate_service_1.AppMissingTranslationHandler(http); },
                deps: [http_1.Http]
            }
        ],
        schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
        bootstrap: [app_1.AppComponent],
    }),
    __metadata("design:paramtypes", [translate_service_1.AppTranslateService, system.UssAuthService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map