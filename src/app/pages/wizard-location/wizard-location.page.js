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
var geocode_service_1 = require("../../services/geocode.service");
var core_1 = require("angular2-google-maps/core");
var inputs_component_1 = require("../../../system/components/semanticui/input/inputs.component");
var AppWizardLocationPage = (function () {
    function AppWizardLocationPage(wizard, geocode, mapsApiLoader, ngZone) {
        this.wizard = wizard;
        this.geocode = geocode;
        this.mapsApiLoader = mapsApiLoader;
        this.ngZone = ngZone;
    }
    /*private checkAddress() {
        this.geocode.getSuggestedAddess(this.wizard.data.address).then((addr) => {

        }).catch(e => {
            
        });
    }*/
    AppWizardLocationPage.prototype.ngOnInit = function () {
        var _this = this;
        this.mapsApiLoader.load().then(function () {
            var autocomplete = new google.maps.places.Autocomplete(_this.searchElement.inputElement);
            autocomplete.addListener('place_changed', function () {
                _this.ngZone.run(function () {
                    var place = autocomplete.getPlace();
                    _this.wizard.data.address = place.formatted_address;
                    var postCode = place.address_components.firstOrDefault(function (x) { return x.types.contains('postal_code'); });
                    if (postCode) {
                        _this.wizard.data.postalCode = postCode.long_name;
                    }
                    else {
                        _this.wizard.data.postalCode = null;
                    }
                });
            });
        });
    };
    return AppWizardLocationPage;
}());
__decorate([
    ng.ViewChild("search"),
    __metadata("design:type", inputs_component_1.UssInputComponent)
], AppWizardLocationPage.prototype, "searchElement", void 0);
AppWizardLocationPage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-location.page.scss'],
        templateUrl: './wizard-location.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-location' }),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService, geocode_service_1.GeocodeService, core_1.MapsAPILoader, ng.NgZone])
], AppWizardLocationPage);
exports.AppWizardLocationPage = AppWizardLocationPage;
//# sourceMappingURL=wizard-location.page.js.map