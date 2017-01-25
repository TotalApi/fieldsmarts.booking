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
var system_component_decorator_1 = require("../../decorators/system-component.decorator");
/**
 * Implementation of Menu component
 *
 * @link http://semantic-ui.com/collections/menu.html
 * @link http://semantic-ui.com/elements/icon.html
 */
var SemanticMenuComponent = (function () {
    function SemanticMenuComponent() {
        this.logoClass = "logo";
    }
    SemanticMenuComponent.prototype.ngAfterViewInit = function () {
        Array.from(this.innerElement.nativeElement.childNodes)
            .filter(function (element) { return element.nodeName === "SM-MENU"; })
            .map(function (element) { return element.firstElementChild.classList.remove("ui"); });
    };
    return SemanticMenuComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticMenuComponent.prototype, "logo", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticMenuComponent.prototype, "class", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticMenuComponent.prototype, "logoClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticMenuComponent.prototype, "title", void 0);
__decorate([
    core_1.ViewChild("innerElement"),
    __metadata("design:type", core_1.ElementRef)
], SemanticMenuComponent.prototype, "innerElement", void 0);
SemanticMenuComponent = __decorate([
    core_1.Component({
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        selector: "sm-menu",
        template: "<div class=\"ui menu {{class}}\" #innerElement>\n<a href=\"#/\" *ngIf=\"logo\" class=\"header item\">\n    <img class=\"{{logoClass}}\" alt=\"{{title}}\" src=\"{{logo}}\">\n</a>\n<a href=\"#/\" *ngIf=\"title && !logo\" class=\"header item\">\n    {{title}}\n</a>\n<ng-content></ng-content>\n</div>\n"
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [])
], SemanticMenuComponent);
exports.SemanticMenuComponent = SemanticMenuComponent;
/**
 * Implementation of Item view
 *
 * @link http://semantic-ui.com/views/item.html
 */
var SemanticItemComponent = (function () {
    function SemanticItemComponent() {
    }
    SemanticItemComponent.prototype.ngAfterViewInit = function () {
        this.innerItemElement.nativeElement.parentElement.classList.add("item");
    };
    return SemanticItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticItemComponent.prototype, "icon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticItemComponent.prototype, "header", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SemanticItemComponent.prototype, "image", void 0);
__decorate([
    core_1.ViewChild("innerItemElement"),
    __metadata("design:type", core_1.ElementRef)
], SemanticItemComponent.prototype, "innerItemElement", void 0);
SemanticItemComponent = __decorate([
    core_1.Component({
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        selector: "a[sm-item], sm-item",
        template: "<i *ngIf=\"icon\" class=\"{{icon}} icon\"></i>\n<img *ngIf=\"image\" class=\"ui avatar image\" src=\"{{image}}\">\n<div class=\"content\" #innerItemElement>\n  <div *ngIf=\"header\" class=\"header\">\n    {{header}}\n  </div>\n  <ng-content></ng-content>\n</div>"
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [])
], SemanticItemComponent);
exports.SemanticItemComponent = SemanticItemComponent;
/**
 * Implementation of Loader element
 *
 * @link http://semantic-ui.com/elements/loader.html
 */
var SemanticLoaderComponent = (function () {
    function SemanticLoaderComponent() {
        this.complete = false;
    }
    return SemanticLoaderComponent;
}());
__decorate([
    core_1.Input("class"),
    __metadata("design:type", String)
], SemanticLoaderComponent.prototype, "class", void 0);
__decorate([
    core_1.Input("text"),
    __metadata("design:type", String)
], SemanticLoaderComponent.prototype, "text", void 0);
__decorate([
    core_1.Input("complete"),
    __metadata("design:type", Boolean)
], SemanticLoaderComponent.prototype, "complete", void 0);
SemanticLoaderComponent = __decorate([
    core_1.Component({
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        selector: "sm-loader",
        template: "<div *ngIf=\"!complete\" class=\"ui active dimmer {{class}}\">\n    <div [ngClass]=\"{text: text}\" class=\"ui loader\">{{text}}</div>\n  </div>"
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [])
], SemanticLoaderComponent);
exports.SemanticLoaderComponent = SemanticLoaderComponent;
//# sourceMappingURL=semantic.js.map