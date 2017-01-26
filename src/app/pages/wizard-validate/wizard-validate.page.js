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
var Sales_1 = require("../../models/Sales");
var sales_service_1 = require("../../services/sales.service");
var AppWizardValidatePage = (function () {
    function AppWizardValidatePage(wizard, sales) {
        this.wizard = wizard;
        this.sales = sales;
        this.selectedSurfaces = wizard.data.surfaces.where(function (x) { return x.isSelected; }).toArray();
    }
    AppWizardValidatePage.prototype.editBookingTime = function () {
        this.wizard.go('wizard-calendar');
    };
    AppWizardValidatePage.prototype.editSurfaces = function () {
        this.wizard.go('wizard-surfaces');
    };
    AppWizardValidatePage.prototype.saveBookTime = function () {
        var b = new Sales_1.PostBooking();
        b.franchisee = this.wizard.data.franchise;
        b.salesNumber = this.wizard.data.salesNumber;
        b.timeSlot = new Date(this.wizard.data.bookTime);
        return this.sales.book(b);
    };
    AppWizardValidatePage.prototype.check = function () {
        return this.saveBookTime();
    };
    return AppWizardValidatePage;
}());
AppWizardValidatePage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-validate.page.scss'],
        templateUrl: './wizard-validate.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-validate' }),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService, sales_service_1.SalesService])
], AppWizardValidatePage);
exports.AppWizardValidatePage = AppWizardValidatePage;
//# sourceMappingURL=wizard-validate.page.js.map