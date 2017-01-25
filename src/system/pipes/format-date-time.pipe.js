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
var moment = require("moment");
var system_component_decorator_1 = require("../decorators/system-component.decorator");
var UssFormatDateTimePipe = (function () {
    function UssFormatDateTimePipe() {
    }
    UssFormatDateTimePipe.prototype.transform = function (date, format) {
        return date ? moment(date).format(format) : '';
    };
    return UssFormatDateTimePipe;
}());
UssFormatDateTimePipe = __decorate([
    core_1.Pipe({
        name: 'ussFormatDateTime',
        pure: false
    }),
    system_component_decorator_1.SystemComponent(),
    __metadata("design:paramtypes", [])
], UssFormatDateTimePipe);
exports.UssFormatDateTimePipe = UssFormatDateTimePipe;
//# sourceMappingURL=format-date-time.pipe.js.map