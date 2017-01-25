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
var AccountService = (function (_super) {
    __extends(AccountService, _super);
    function AccountService(http) {
        return _super.call(this, http) || this;
    }
    AccountService.prototype.getUserInfo = function (userName) {
        return this.request({ p1: userName }).toPromise();
    };
    return AccountService;
}(api_service_1.UssApiService));
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "userInfo?userName={p1}", useBody: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "getUserInfo", null);
AccountService = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService("api/account"),
    __metadata("design:paramtypes", [http_1.Http])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map