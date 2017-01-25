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
var api_service_1 = require("./api.service");
var api_method_decorator_1 = require("../decorators/api-method.decorator");
var api_service_decorator_1 = require("../decorators/api-service.decorator");
// ReSharper disable InconsistentNaming
var BearerLoginResponse = (function () {
    function BearerLoginResponse() {
    }
    return BearerLoginResponse;
}());
exports.BearerLoginResponse = BearerLoginResponse;
// ReSharper restore InconsistentNaming
var UssAccountService = (function (_super) {
    __extends(UssAccountService, _super);
    function UssAccountService() {
        return _super.apply(this, arguments) || this;
    }
    /*
        @ApiMethod({ method: "GET", route: "{login}" })
        public Load(login: string): Promise<App.User> {
            return this.request<App.User>({ login }).toPromise();
        }
    */
    UssAccountService.prototype.CurrentUserInfo = function () {
        return this.request().toPromise();
    };
    UssAccountService.prototype.Login = function (login, password) {
        return this.request("grant_type=password&username=" + login + "&password=" + password).toPromise();
    };
    return UssAccountService;
}(api_service_1.UssApiService));
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "MyUserInfo" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UssAccountService.prototype, "CurrentUserInfo", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "POST", route: "/token" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UssAccountService.prototype, "Login", null);
UssAccountService = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService("api/Account"),
    __metadata("design:paramtypes", [])
], UssAccountService);
exports.UssAccountService = UssAccountService;
//# sourceMappingURL=account.service.js.map