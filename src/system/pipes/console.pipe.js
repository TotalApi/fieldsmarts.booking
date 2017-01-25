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
var system_component_decorator_1 = require("../decorators/system-component.decorator");
var utils_1 = require("../utils/utils");
var UssConsolePipe = (function () {
    function UssConsolePipe() {
    }
    UssConsolePipe.prototype.transform = function (value, groupName) {
        if (ng.isDevMode) {
            if (groupName) {
                console.group(groupName);
            }
            if (utils_1.isArray(value)) {
                console.table(value);
            }
            else {
                console.log(value);
            }
            if (groupName) {
                console.groupEnd();
            }
        }
        return value;
    };
    return UssConsolePipe;
}());
UssConsolePipe = __decorate([
    ng.Pipe({
        name: 'console',
        pure: true
    }),
    system_component_decorator_1.SystemComponent(),
    __metadata("design:paramtypes", [])
], UssConsolePipe);
exports.UssConsolePipe = UssConsolePipe;
//# sourceMappingURL=console.pipe.js.map