"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var api_service_1 = require("../../system/services/api.service");
var api_method_decorator_1 = require("../../system/decorators/api-method.decorator");
var api_service_decorator_1 = require("../../system/decorators/api-service.decorator");
var http_1 = require("@angular/http");
var GeocodeService = GeocodeService_1 = (function (_super) {
    __extends(GeocodeService, _super);
    function GeocodeService(http) {
        return _super.call(this, http) || this;
    }
    GeocodeService.prototype.getSuggestedAddess = function (address) {
        return this.request({ p1: address, p2: GeocodeService_1.GOOGLEAPIKEY }).toPromise();
    };
    return GeocodeService;
}(api_service_1.UssApiService));
GeocodeService.GOOGLEAPIKEY = "AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA";
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "json?address={p1}&key={p2}", useBody: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeocodeService.prototype, "getSuggestedAddess", null);
GeocodeService = GeocodeService_1 = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService("https://maps.googleapis.com/maps/api/geocode"),
    __metadata("design:paramtypes", [http_1.Http])
], GeocodeService);
exports.GeocodeService = GeocodeService;
var GeocodeService_1;
//# sourceMappingURL=geocode.service.js.map