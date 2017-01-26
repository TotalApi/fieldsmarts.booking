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
var platform_browser_1 = require("@angular/platform-browser");
var wizard_service_1 = require("../../services/wizard.service");
var AddToCalendar_1 = require("../../common/AddToCalendar");
var settings_service_1 = require("../../services/settings.service");
var AddToCalendar_2 = require("../../common/AddToCalendar");
var AppWizardDonePage = (function () {
    function AppWizardDonePage(wizard, settings, sanitizer) {
        this.wizard = wizard;
        this.settings = settings;
        this.sanitizer = sanitizer;
    }
    AppWizardDonePage.prototype.ngOnInit = function () {
        this.fbLikeIframeSrc();
        this.generateEvent();
    };
    AppWizardDonePage.prototype.sanitize = function (url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    AppWizardDonePage.prototype.fbLikeIframeSrc = function () {
        var likeBtn = document.getElementById('fb-like-btn');
        if (likeBtn) {
            likeBtn.setAttribute('data-href', this.settings.siteToLike);
            this.initFbSdk();
        }
    };
    AppWizardDonePage.prototype.initFbSdk = function () {
        var id = 'facebook-jssdk';
        var fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id))
            return;
        var js = document.createElement('script');
        js.id = id;
        js.src = "//connect.facebook.net/" + (this.wizard.translate.currentLang === 'fr' ? "fr_FR" : "en_US") + "/sdk.js#xfbml=1&version=v2.8&appId=" + this.settings.facebookAppId;
        fjs.parentNode.insertBefore(js, fjs);
    };
    AppWizardDonePage.prototype.generateEvent = function () {
        var event = new AddToCalendar_1.CalendarEvent();
        event.title = "Spray Net Consultation";
        event.address = this.wizard.data.address;
        event.description = "Spray Net Consultation";
        event.start = new Date(this.wizard.data.bookTime);
        event.end = moment(this.wizard.data.bookTime).add(30, 'minutes').toDate();
        this.googleCal = AddToCalendar_2.AddToCalendar.google(event);
        this.iCal = AddToCalendar_2.AddToCalendar.ical(event);
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
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService, settings_service_1.AppSettings, platform_browser_1.DomSanitizer])
], AppWizardDonePage);
exports.AppWizardDonePage = AppWizardDonePage;
//# sourceMappingURL=wizard-done.page.js.map