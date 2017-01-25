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
var transition_1 = require("../transition");
var system_component_decorator_1 = require("../../../decorators/system-component.decorator");
var SuiDropdownMenu = (function () {
    function SuiDropdownMenu(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this._transition = new transition_1.SuiTransition(el, renderer);
        this._transition.isVisible = false;
    }
    Object.defineProperty(SuiDropdownMenu.prototype, "service", {
        set: function (service) {
            this._service = service;
            this._service.menuElement = this.el;
            this._service.transition = this._transition;
            if (service.isOpen) {
                this._transition.isVisible = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    return SuiDropdownMenu;
}());
SuiDropdownMenu = __decorate([
    core_1.Directive({
        selector: '[suiDropdownMenu]'
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], SuiDropdownMenu);
exports.SuiDropdownMenu = SuiDropdownMenu;
//# sourceMappingURL=dropdown-menu.js.map