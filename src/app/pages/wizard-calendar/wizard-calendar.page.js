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
var AppWizardCalendarPage = (function () {
    function AppWizardCalendarPage(wizard) {
        this.wizard = wizard;
        this.selectedDayTime = 'morning';
        this.model = wizard.data;
    }
    AppWizardCalendarPage.prototype.setDayTime = function (dayTime) {
        this.selectedDayTime = dayTime;
    };
    return AppWizardCalendarPage;
}());
__decorate([
    ng.ViewChild("timeBooking"),
    __metadata("design:type", ng.ComponentRef)
], AppWizardCalendarPage.prototype, "timeBooking", void 0);
AppWizardCalendarPage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-calendar.page.scss'],
        templateUrl: './wizard-calendar.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-calendar' }),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService])
], AppWizardCalendarPage);
exports.AppWizardCalendarPage = AppWizardCalendarPage;
//# sourceMappingURL=wizard-calendar.page.js.map