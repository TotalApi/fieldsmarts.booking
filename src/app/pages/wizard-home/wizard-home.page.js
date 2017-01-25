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
var ng = require("@angular/core");
var router_1 = require("@angular/router");
var app_routes_1 = require("src/app/app.routes");
var wizard_service_1 = require("../../services/wizard.service");
var ng2Translate = require("ng2-translate");
var AppWizardHomePage = (function () {
    function AppWizardHomePage(wizard, translate, route) {
        this.wizard = wizard;
        this.route = route;
        translate.use(translate.getBrowserLang());
        this.route.params.subscribe(function (p) {
            if (p.lang) {
                wizard.data.language = p.lang;
                translate.use(wizard.data.language);
            }
        });
    }
    AppWizardHomePage.prototype.callMe = function () {
        this.wizard.data.callMe = true;
        this.wizard.go('wizard-name');
        return false;
    };
    AppWizardHomePage.prototype.bookOnline = function () {
        this.wizard.data.callMe = false;
        this.wizard.go('wizard-name');
        return false;
    };
    AppWizardHomePage.prototype.call = function () {
        window.location.href = 'tel:+1800229933';
        return false;
    };
    AppWizardHomePage.prototype.isCurrentTimeOff = function () {
        return true;
        /*
                const today = moment();
                const res = (today.day() === 0 || today.day() === 6) // check weekend
                    || (today.hour() < 8 || today.hour() > 18) // check working hours
                    // check holidays
                    || (today.date() === 25 && today.month() === 12) // check XMas
                    ;
                return res;
        */
    };
    return AppWizardHomePage;
}());
AppWizardHomePage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-home.page.scss'],
        templateUrl: './wizard-home.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'home/:lang' }),
    app_routes_1.AppRoute({ path: 'home' }),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService, ng2Translate.TranslateService, router_1.ActivatedRoute])
], AppWizardHomePage);
exports.AppWizardHomePage = AppWizardHomePage;
//# sourceMappingURL=wizard-home.page.js.map