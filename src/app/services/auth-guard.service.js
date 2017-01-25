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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var system = require("src/system");
var system_1 = require("src/system");
var AppAuthGuard = (function () {
    function AppAuthGuard(auth, router, messages) {
        this.auth = auth;
        this.router = router;
        this.messages = messages;
    }
    AppAuthGuard.prototype.canActivate = function (_a) {
        var routeConfig = _a.routeConfig;
        var currRouteRoles = routeConfig['settings']
            && routeConfig['settings'].access
            && routeConfig['settings'].access.forRoles
            ? routeConfig['settings'].access.forRoles
            : null;
        var result = this.auth.IsLoggedIn;
        var msg = !result ? 'You should be an authorized user' : null;
        if (currRouteRoles) {
            result = this.auth.IsLoggedIn
                && currRouteRoles.contains(this.auth.LoggedUser.role);
            msg = !result ? 'Access denied for your current role' : null;
        }
        if (!result) {
            msg && this.messages.warning(msg);
            this.router.navigate(['login']);
        }
        return result;
    };
    return AppAuthGuard;
}());
AppAuthGuard = __decorate([
    core_1.Injectable(),
    system_1.AppService(),
    __metadata("design:paramtypes", [system.UssAuthService, router_1.Router, system.UssMessagesService])
], AppAuthGuard);
exports.AppAuthGuard = AppAuthGuard;
//# sourceMappingURL=auth-guard.service.js.map