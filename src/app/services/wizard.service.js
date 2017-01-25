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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var system_1 = require("src/system");
var ng2Translate = require("ng2-translate");
var AppWizardService = (function () {
    function AppWizardService(router, translate) {
        this.router = router;
        this.translate = translate;
        this.data = {
            language: '',
            franchise: '',
            salesNumber: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            postalCode: '',
            address: '',
            wantSpam: false,
            callMe: undefined,
            bookTime: undefined,
            surfaces: undefined
        };
        this.state = {
            currentStep: 0,
            totalSteps: 1,
        };
        try {
            var data = (sessionStorage.getItem("@wizard.service.data") || '').FromJson();
            if (data) {
                _.defaults(data, this.data);
                this.data = data;
            }
        }
        catch (e) {
        }
    }
    Object.defineProperty(AppWizardService.prototype, "current", {
        get: function () {
            var res = this.router.url;
            if (res && res.startsWith('/'))
                res = res.substr(1);
            return res.split('/')[0];
        },
        enumerable: true,
        configurable: true
    });
    AppWizardService.prototype.go = function (url) {
        var _this = this;
        return this.router.navigate([url]).then(function (res) {
            _this.updateState();
            return res;
        });
    };
    AppWizardService.prototype.next = function (current) {
        return this.go(this.getNext(current));
    };
    AppWizardService.prototype.back = function (current) {
        return this.go(this.getBack(current));
    };
    AppWizardService.prototype.updateState = function () {
        this.translate.use(this.data.language || this.translate.getBrowserLang());
        if (this.data.callMe === undefined && this.current !== 'home') {
            this.go('home');
            return;
        }
        this.state.totalSteps = this.data.callMe ? 4 : 6;
        switch (this.current) {
            case 'home':
                this.state.currentStep = 0;
                break;
            case 'wizard-name':
                this.state.currentStep = 1;
                break;
            case 'wizard-phone':
                this.state.currentStep = 2;
                break;
            case 'wizard-email':
                this.state.currentStep = 3;
                break;
            case 'wizard-location':
                this.state.currentStep = 4;
                break;
            case 'wizard-postcode':
                this.state.currentStep = this.data.callMe ? 4 : 5;
                break;
            case 'wizard-calendar':
                this.state.currentStep = 6;
                break;
        }
        sessionStorage.setItem("@wizard.service.data", system_1.Json.toJson(this.data));
    };
    AppWizardService.prototype.getNext = function (current) {
        current = current || this.current;
        switch (current) {
            case 'home': return 'wizard-name';
            case 'wizard-name': return 'wizard-phone';
            case 'wizard-phone': return 'wizard-email';
            case 'wizard-email': return this.data.callMe ? 'wizard-postcode' : 'wizard-location';
            case 'wizard-location': return 'wizard-postcode';
            case 'wizard-postcode': return 'wizard-calendar';
            default: return current;
        }
    };
    AppWizardService.prototype.getBack = function (current) {
        current = current || this.current;
        switch (current) {
            case 'wizard-name': return 'home';
            case 'wizard-phone': return 'wizard-name';
            case 'wizard-email': return 'wizard-phone';
            case 'wizard-location': return 'wizard-email';
            case 'wizard-postcode': return this.data.callMe ? 'wizard-email' : 'wizard-location';
            case 'wizard-calendar': return 'wizard-postcode';
            default: return current;
        }
    };
    return AppWizardService;
}());
AppWizardService = __decorate([
    core_1.Injectable(),
    system_1.AppService(),
    __metadata("design:paramtypes", [router_1.Router, ng2Translate.TranslateService])
], AppWizardService);
exports.AppWizardService = AppWizardService;
//# sourceMappingURL=wizard.service.js.map