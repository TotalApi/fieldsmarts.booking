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
var app_routes_1 = require("src/app/app.routes");
var wizard_service_1 = require("../../services/wizard.service");
var AppWizardDonePage = (function () {
    function AppWizardDonePage(wizard) {
        this.wizard = wizard;
        //    url = 'http://aelitsoft.com';
        this.url = 'http://spray-net.com';
    }
    AppWizardDonePage.prototype.ngOnInit = function () {
        this.fbLikeIframeSrc();
    };
    AppWizardDonePage.prototype.fbLikeIframeSrc = function () {
        var likeBtn = document.getElementById('fb-like-btn');
        if (likeBtn) {
            likeBtn.setAttribute('data-href', this.url);
            this.initFbSdk();
        }
    };
    AppWizardDonePage.prototype.initFbSdk = function () {
        var d = document;
        var s = 'script';
        var id = 'facebook-jssdk';
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id))
            return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/" + (this.wizard.translate.currentLang === 'fr' ? "fr_FR" : "en_US") + "/sdk.js#xfbml=1&version=v2.8&appId=773528466036157";
        fjs.parentNode.insertBefore(js, fjs);
    };
    return AppWizardDonePage;
}());
AppWizardDonePage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-done.page.scss'],
        templateUrl: './wizard-done.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-done' }),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService])
], AppWizardDonePage);
exports.AppWizardDonePage = AppWizardDonePage;
//# sourceMappingURL=wizard-done.page.js.map