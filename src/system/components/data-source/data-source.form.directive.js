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
var ng = require("@angular/core");
var ngForms = require("@angular/forms");
var system_component_decorator_1 = require("../../decorators/system-component.decorator");
var directive_base_1 = require("../../directives/directive.base");
var UssFormGroup_1 = require("../common/UssFormGroup");
var Enumerable = require('linq');
var UssDataSourceFormDirective = (function (_super) {
    __extends(UssDataSourceFormDirective, _super);
    function UssDataSourceFormDirective(hostElementRef, viewContainer, hostComponent) {
        return _super.call(this, hostComponent, hostElementRef, viewContainer) || this;
    }
    UssDataSourceFormDirective.prototype.ngOnChanges = function (changes) {
        if (this.wasInit && (changes.dataSource || changes.metadata)) {
            this.initForm();
        }
    };
    UssDataSourceFormDirective.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.dataSource && !this.metadata) {
            this.metadata = {
                Properties: Enumerable.from(this.dataSource).select(function (kv) { return ({ Name: kv.key }); }).toArray()
            };
        }
        this.ngForm = Enumerable.from(this.hostViewContainer.injector['_view']).select(function (kv) { return kv.value; }).firstOrDefault(function (x) { return x instanceof ngForms.NgForm; });
        this.initForm();
    };
    UssDataSourceFormDirective.prototype.initForm = function () {
        if (this.ngForm) {
            this.ngForm.form = UssFormGroup_1.UssFormGroup.create(this.metadata, this.dataSource);
            this.hostElementRef.nativeElement['_ussDataSource'] = this;
        }
    };
    return UssDataSourceFormDirective;
}(directive_base_1.UssDirectiveBase));
__decorate([
    ng.Input('ussDataSource'),
    __metadata("design:type", Object)
], UssDataSourceFormDirective.prototype, "dataSource", void 0);
__decorate([
    ng.Input('metadata'),
    __metadata("design:type", Object)
], UssDataSourceFormDirective.prototype, "metadata", void 0);
UssDataSourceFormDirective = __decorate([
    ng.Directive({
        selector: 'form[ussDataSource]'
    }),
    system_component_decorator_1.SystemComponent(true),
    __param(2, ng.Host()),
    __metadata("design:paramtypes", [ng.ElementRef, ng.ViewContainerRef, ngForms.NgForm])
], UssDataSourceFormDirective);
exports.UssDataSourceFormDirective = UssDataSourceFormDirective;
//# sourceMappingURL=data-source.form.directive.js.map