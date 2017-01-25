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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular = require("@angular/core");
var messages_service_1 = require("./messages.service");
var ErrorHandler = (function (_super) {
    __extends(ErrorHandler, _super);
    function ErrorHandler(rethrowError) {
        return _super.call(this, rethrowError) || this;
    }
    ErrorHandler.prototype.handleError = function (error) {
        if (error.rejection)
            this.handleError(error.rejection);
        else {
            if (angular.isDevMode()) {
                setTimeout(function () { return messages_service_1.msg.runtimeError(error); });
            }
            _super.prototype.handleError.call(this, error);
        }
    };
    return ErrorHandler;
}(angular.ErrorHandler));
ErrorHandler = __decorate([
    angular.Injectable(),
    __param(0, angular.Optional()),
    __metadata("design:paramtypes", [Boolean])
], ErrorHandler);
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map