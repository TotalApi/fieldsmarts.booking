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
var FranchiseService = (function (_super) {
    __extends(FranchiseService, _super);
    function FranchiseService() {
        return _super.apply(this, arguments) || this;
    }
    //constructor(http: Http) { super(http); }
    FranchiseService.prototype.load = function () {
        return this.request().toPromise();
    };
    FranchiseService.prototype.get = function (franchisee, region) {
        if (!region) {
            return this.load().then(function (r) { return r.firstOrDefault(function (f) { return f.name === franchisee; }); });
        }
        else {
            return this.request({ franchisee: franchisee, region: region }).toPromise();
        }
    };
    return FranchiseService;
}(api_service_1.UssApiService));
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FranchiseService.prototype, "load", null);
__decorate([
    api_method_decorator_1.ApiMethod({ method: "GET", route: "?franchisee={franchisee}&region={region}", useBody: false }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FranchiseService.prototype, "get", null);
FranchiseService = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService("api/franchise"),
    __metadata("design:paramtypes", [])
], FranchiseService);
exports.FranchiseService = FranchiseService;
//# sourceMappingURL=franchise.service.js.map