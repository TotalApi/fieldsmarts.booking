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
var api_service_decorator_1 = require("../../system/decorators/api-service.decorator");
var http_1 = require("@angular/http");
var SurfacesService = (function (_super) {
    __extends(SurfacesService, _super);
    function SurfacesService(http) {
        return _super.call(this, http) || this;
    }
    SurfacesService.prototype.getSurfaces = function () {
        return [
            { name: 'brick', description: 'Brick', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            { name: 'windows', description: 'Windows', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            { name: 'soffits', description: 'Soffits', options: [] },
            { name: 'stucco', description: 'Stucco', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            { name: 'not_listed', description: 'My exterior not listed' }
        ];
    };
    return SurfacesService;
}(api_service_1.UssApiService));
SurfacesService = __decorate([
    core_1.Injectable(),
    api_service_decorator_1.ApiService(""),
    __metadata("design:paramtypes", [http_1.Http])
], SurfacesService);
exports.SurfacesService = SurfacesService;
//# sourceMappingURL=surfaces.service.js.map