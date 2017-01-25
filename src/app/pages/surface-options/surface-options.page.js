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
var sales_service_1 = require("../../services/sales.service");
var router_1 = require("@angular/router");
var Json_1 = require("../../../system/utils/Json");
var AppSurfacesOptionsPage = (function () {
    function AppSurfacesOptionsPage(sales, wizard, router, route) {
        this.sales = sales;
        this.wizard = wizard;
        this.router = router;
        this.route = route;
    }
    AppSurfacesOptionsPage.prototype.cancel = function () {
        this.surface.options = this.initialOptions;
        return this.router.navigate(['wizard-surfaces']);
    };
    AppSurfacesOptionsPage.prototype.ifAnyChecked = function () {
        var s = this.surface.options;
        return s.any(function (x) { return x.isSelected; });
    };
    AppSurfacesOptionsPage.prototype.done = function () {
        if (this.surface.name !== 'not_listed') {
            this.surface.isSelected = this.ifAnyChecked();
        }
        else {
            this.surface.isSelected = this.surface.options && this.surface.options.length > 0;
        }
        return this.router.navigate(['wizard-surfaces']);
    };
    AppSurfacesOptionsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            _this.surface = _this.wizard.data.surfaces.first(function (x) { return x.name === params['surfaceName']; });
            _this.initialOptions = Json_1.Json.clone(_this.surface.options);
        });
    };
    AppSurfacesOptionsPage.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    return AppSurfacesOptionsPage;
}());
AppSurfacesOptionsPage = __decorate([
    ng.Component({
        styleUrls: ['./surface-options.page.scss'],
        templateUrl: './surface-options.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'surface-options/:surfaceName' }),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        wizard_service_1.AppWizardService, router_1.Router, router_1.ActivatedRoute])
], AppSurfacesOptionsPage);
exports.AppSurfacesOptionsPage = AppSurfacesOptionsPage;
//# sourceMappingURL=surface-options.page.js.map