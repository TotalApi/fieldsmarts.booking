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
var system_component_decorator_1 = require("../../../decorators/system-component.decorator");
var SuiSelectOption = (function () {
    function SuiSelectOption() {
        this.itemClass = true;
        this.selected = new core_1.EventEmitter();
        this.useTemplate = false;
        this.readValue = function (value) { return ""; };
    }
    SuiSelectOption.prototype.click = function (event) {
        event.stopPropagation();
        this.selected.emit(this.value);
        return false;
    };
    return SuiSelectOption;
}());
__decorate([
    core_1.HostBinding('class.item'),
    __metadata("design:type", Object)
], SuiSelectOption.prototype, "itemClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], SuiSelectOption.prototype, "value", void 0);
__decorate([
    core_1.ViewChild('optionRenderTarget', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], SuiSelectOption.prototype, "viewContainerRef", void 0);
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", Boolean)
], SuiSelectOption.prototype, "click", null);
SuiSelectOption = __decorate([
    core_1.Component({
        selector: 'sui-select-option',
        template: "\n<span #optionRenderTarget></span>\n<span *ngIf=\"!useTemplate\">{{ readValue(value) }}</span>\n"
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [])
], SuiSelectOption);
exports.SuiSelectOption = SuiSelectOption;
//# sourceMappingURL=select-option.js.map