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
var ng = require("@angular/core");
var system_component_decorator_1 = require("../../../decorators/system-component.decorator");
var utils_1 = require("../../../utils/utils");
var UssDataSourceComponent_1 = require("../../common/UssDataSourceComponent");
/**
 * Implementation of Input element
 *
 * @link http://semantic-ui.com/elements/input.html
 *
 * @example
 * <uss-input icon="dollar" type="number" [dataSource]="object" fieldName="value" class="right fluid" placeholder="Enter a sum..."></uss-input>
 */
var UssInputComponent = (function (_super) {
    __extends(UssInputComponent, _super);
    function UssInputComponent(vc, cd) {
        var _this = _super.call(this, vc, cd) || this;
        _this.type = "text";
        return _this;
    }
    Object.defineProperty(UssInputComponent.prototype, "isFluid", {
        get: function () {
            return this.isInsideForm || (" " + this.class + " ").Contains(' fluid ');
        },
        enumerable: true,
        configurable: true
    });
    return UssInputComponent;
}(UssDataSourceComponent_1.UssDataSourceComponent));
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssInputComponent.prototype, "icon", void 0);
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssInputComponent.prototype, "type", void 0);
UssInputComponent = __decorate([
    ng.Component({
        selector: "uss-input",
        template: "\n<div class=\"field uss-input uss-component\" [ngClass]=\"{ error: (markAsInvalid && isFluid), disabled: disabled }\">\n    <label *ngIf=\"label && isFluid\">{{label}}</label>\n    <div class=\"ui input {{class}}\" [ngClass]=\"{ icon: icon, error: (markAsInvalid && !isFluid), fluid: isFluid }\">\n        <label *ngIf=\"label && !isFluid\" class=\"ui label\">{{label}}</label>\n        <input [type]=\"type\" [placeholder]=\"placeholder\">\n        <i *ngIf=\"icon\" class=\"{{icon}} icon\"></i>\n    </div>\n</div>",
        inputs: UssDataSourceComponent_1.UssDataSourceComponent.Inputs,
        outputs: UssDataSourceComponent_1.UssDataSourceComponent.Outputs
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [ng.ViewContainerRef, ng.ChangeDetectorRef])
], UssInputComponent);
exports.UssInputComponent = UssInputComponent;
/**
 * Implementation of Textarea element
 *
 * @link http://semantic-ui.com/collections/form.html#text-area
 */
var UssTextAreaComponent = (function (_super) {
    __extends(UssTextAreaComponent, _super);
    function UssTextAreaComponent(vc, cd) {
        return _super.call(this, vc, cd) || this;
    }
    return UssTextAreaComponent;
}(UssDataSourceComponent_1.UssDataSourceComponent));
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssTextAreaComponent.prototype, "rows", void 0);
UssTextAreaComponent = __decorate([
    ng.Component({
        selector: "uss-textarea",
        template: "\n<div class=\"field uss-textarea uss-component\" [ngClass]=\"{ error: (markAsInvalid && isInsideForm), disabled: disabled }\">\n    <label *ngIf=\"label\">{{label}}</label>\n    <div class=\"ui input fluid {{class}}\" [ngClass]=\"{ error: (markAsInvalid && !isInsideForm) }\">\n        <textarea rows=\"{{rows}}\" [placeholder]=\"placeholder\"></textarea>\n    </div>\n</div>",
        inputs: UssDataSourceComponent_1.UssDataSourceComponent.Inputs,
        outputs: UssDataSourceComponent_1.UssDataSourceComponent.Outputs
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [ng.ViewContainerRef, ng.ChangeDetectorRef])
], UssTextAreaComponent);
exports.UssTextAreaComponent = UssTextAreaComponent;
/**
 * Implementation of Checkbox element
 *
 * @link http://semantic-ui.com/modules/checkbox.html
 */
var UssCheckboxComponent = (function (_super) {
    __extends(UssCheckboxComponent, _super);
    function UssCheckboxComponent(vc, cd) {
        var _this = _super.call(this, vc, cd) || this;
        _this.inputType = "checkbox";
        _this.classType = "checkbox";
        _this.id = utils_1.guid();
        return _this;
    }
    Object.defineProperty(UssCheckboxComponent.prototype, "type", {
        set: function (data) {
            if (data && data !== "checkbox") {
                this.classType = data;
                if (data === "radio") {
                    this.inputType = data;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    UssCheckboxComponent.prototype.ngOnChanges = function (changes) {
        if (changes.attrValue) {
            this.checkbox.nativeElement.checked = this.attrValue;
        }
    };
    UssCheckboxComponent.prototype.getInputElementValue = function () {
        var res = _super.prototype.getInputElementValue.call(this);
        switch (this.inputElement.type) {
            case 'checkbox':
                if (isNaN(res))
                    res = this.inputElement.checked;
                else {
                    if (this.inputElement.checked)
                        res = this.value | parseInt(res);
                    else
                        res = this.value & ~parseInt(res);
                }
                break;
            case 'radio':
                if (this.inputElement.checked)
                    res = parseInt(res);
                break;
        }
        return res;
    };
    UssCheckboxComponent.prototype.setInputElementValue = function (value) {
        switch (this.inputElement.type) {
            case 'checkbox':
                if (isNaN(this.inputElement.value)) {
                    // Если значения value не установлено - этот checkbox просто переключает значения true/false
                    this.inputElement.checked = !!value;
                }
                else {
                    // Если значения value установлено - этот checkbox устанавливает/сбрасывает указанные в этом значении биты
                    this.inputElement.checked = (parseInt(this.inputElement.value) & value) !== 0;
                }
                break;
            case 'radio':
                this.inputElement.checked = parseInt(this.inputElement.value) === value;
                break;
            default:
                value = value === undefined ? '' : value;
                if (this.inputElement.value !== value) {
                    this.inputElement.value = value;
                }
                break;
        }
    };
    return UssCheckboxComponent;
}(UssDataSourceComponent_1.UssDataSourceComponent));
__decorate([
    ng.Input('value'),
    __metadata("design:type", Object)
], UssCheckboxComponent.prototype, "attrValue", void 0);
__decorate([
    ng.Input('name'),
    __metadata("design:type", String)
], UssCheckboxComponent.prototype, "name", void 0);
__decorate([
    ng.ViewChild('checkbox'),
    __metadata("design:type", ng.ElementRef)
], UssCheckboxComponent.prototype, "checkbox", void 0);
__decorate([
    ng.Input("type"),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], UssCheckboxComponent.prototype, "type", null);
UssCheckboxComponent = __decorate([
    ng.Component({
        selector: "uss-checkbox",
        template: "\n<div class=\"field\">\n    <div class=\"ui {{classType}} checkbox\">\n        <input #checkbox type=\"checkbox\" [attr.id]='id'\n        [attr.value]=\"attrValue\"\n        [attr.type]=\"inputType\" tabindex=\"0\" [attr.name]=\"name\" [attr.disabled]=\"disabled\" />\n        <label [attr.for]='id'>\n            {{label}}\n            <ng-content></ng-content>\n        </label>\n    </div>\n</div>",
        inputs: UssDataSourceComponent_1.UssDataSourceComponent.Inputs,
        outputs: UssDataSourceComponent_1.UssDataSourceComponent.Outputs
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [ng.ViewContainerRef, ng.ChangeDetectorRef])
], UssCheckboxComponent);
exports.UssCheckboxComponent = UssCheckboxComponent;
//# sourceMappingURL=inputs.component.js.map