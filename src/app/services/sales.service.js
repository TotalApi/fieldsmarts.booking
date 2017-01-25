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
var Sales_1 = require("../models/Sales");
var Sales_2 = require("../models/Sales");
var SalesService = (function (_super) {
    __extends(SalesService, _super);
    function SalesService(http) {
        return _super.call(this, http) || this;
    }
    SalesService.prototype.getAvailableTimeSlots = function (franchisee, salesNumber, startingDate) {
        return this.request({ p1: franchisee, p2: salesNumber, p3: startingDate.toISOString() }).toPromise();
    };
    SalesService.prototype.getSalesConsultant = function (postalCode) {
        return this.request({ p1: postalCode }).toPromise();
    };
    SalesService.prototype.save = function (sales) {
        return this.request(sales).toPromise();
    };
    SalesService.prototype.book = function (bookingModel) {
        return this.request(bookingModel).toPromise();
    };
    SalesService.prototype.getPostCodeAssignmentForSale = function (postcode, isCommercial) {
        return this.request({ p1: postcode, p2: isCommercial }).toPromise();
    };
    return SalesService;
}(api_service_1.UssApiService));
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "{p1}/{p2}/availabletimeslots?startingDate={p3}", useBody: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date]),
    __metadata("design:returntype", Promise)
], SalesService.prototype, "getAvailableTimeSlots", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "salesconsultant?postCode={p1}", useBody: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalesService.prototype, "getSalesConsultant", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "POST", useBody: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Sales_1.Sales]),
    __metadata("design:returntype", Promise)
], SalesService.prototype, "save", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "POST", route: "book", useBody: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Sales_2.PostBooking]),
    __metadata("design:returntype", Promise)
], SalesService.prototype, "book", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "postcodeassignment/{p1}/{p2}", useBody: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SalesService.prototype, "getPostCodeAssignmentForSale", null);
SalesService = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService("api/sales"),
    __metadata("design:paramtypes", [http_1.Http])
], SalesService);
exports.SalesService = SalesService;
//# sourceMappingURL=sales.service.js.map