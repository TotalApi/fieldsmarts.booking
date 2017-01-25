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
var router_1 = require("@angular/router");
var sales_service_1 = require("../../services/sales.service");
var surfaces_service_1 = require("../../services/surfaces.service");
var AppWizardSurfacesPage = (function () {
    function AppWizardSurfacesPage(sales, wizard, router, surfacesService) {
        this.sales = sales;
        this.wizard = wizard;
        this.router = router;
        this.surfacesService = surfacesService;
        this.surfaces = [];
        wizard.data.surfaces = wizard.data.surfaces || surfacesService.getSurfaces();
        this.surfaces = wizard.data.surfaces;
    }
    AppWizardSurfacesPage.prototype.showOptions = function (surface) {
        return this.router.navigate(['surface-options', surface.name]);
    };
    AppWizardSurfacesPage.prototype.select = function (surface) {
        surface.isSelected = !surface.isSelected;
        var ifAnySelected = function () { return surface.options.any(function (x) { return x.isSelected; }); };
        if (surface.name === 'not_listed' || !ifAnySelected()) {
            this.router.navigate(['surface-options', surface.name]);
        }
    };
    return AppWizardSurfacesPage;
}());
AppWizardSurfacesPage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-surfaces.page.scss'],
        templateUrl: './wizard-surfaces.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-surfaces' }),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        wizard_service_1.AppWizardService,
        router_1.Router,
        surfaces_service_1.SurfacesService])
], AppWizardSurfacesPage);
exports.AppWizardSurfacesPage = AppWizardSurfacesPage;
//# sourceMappingURL=wizard-surfaces.page.js.map