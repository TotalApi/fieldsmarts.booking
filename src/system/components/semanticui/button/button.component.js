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
var Observable_1 = require("rxjs/Observable");
var system_component_decorator_1 = require("../../../decorators/system-component.decorator");
var UssButtonComponent = (function () {
    function UssButtonComponent() {
        this.inputLoading = false;
        this.loading = 0;
        this.inputDisabled = false;
        this.disabled = 0;
    }
    UssButtonComponent.prototype.ngOnChanges = function (changes) {
        this.updateLayout();
    };
    UssButtonComponent.prototype.updateLayout = function () {
        this.defaultContent = '';
        var res = (this.inputClass || '') + ' uss-button';
        switch (this.type) {
            case 'ok':
                res += ' primary uss-system-button';
                this.defaultContent = 'OK';
                break;
            case 'cancel':
                res += ' normal uss-system-button';
                this.defaultContent = 'CANCEL';
                break;
            case 'yes':
                res += ' positive uss-system-button';
                this.defaultContent = 'YES';
                break;
            case 'save':
                res += ' positive uss-system-button';
                this.defaultContent = 'SAVE_CHANGES';
                break;
            case 'no':
                res += ' negative uss-system-button';
                this.defaultContent = 'NO';
                break;
            case 'close':
                res += ' normal uss-system-button';
                this.defaultContent = 'CLOSE';
                break;
            case 'empty':
                res += ' basic';
                break;
            default:
                res += ' normal';
                break;
        }
        res += this.size ? " " + this.size : '';
        if (this.inputLoading || this.loading)
            res += ' loading';
        this.ngClass = {};
        for (var _i = 0, _a = res.split(' '); _i < _a.length; _i++) {
            var cls = _a[_i];
            if (cls)
                this.ngClass[cls] = true;
        }
        this.class = res;
    };
    UssButtonComponent.prototype.setLoading = function (loading) {
        var _this = this;
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        else if (!loading) {
            this.loading--;
        }
        if (loading)
            this.disabled++;
        else
            this.disabled--;
        if (this.disabled) {
            this.loadingTimeout = setTimeout(function () {
                _this.loadingTimeout = null;
                if (_this.disabled) {
                    _this.loading++;
                    _this.updateLayout();
                }
            }, 50);
        }
        this.updateLayout();
    };
    UssButtonComponent.prototype.onClick = function ($event) {
        if (this.disabled || this.inputDisabled || this.loading || this.inputLoading) {
            $event.stopPropagation();
            $event.preventDefault();
            return false;
        }
        return true;
    };
    /**
     * Вызывает указанный метод.
     * Если метод возвращает <i>Promise</i> или <i>Observable</i>,
     * кнопка будет заблокирована и будет выведена анимация загрузки, до окончания выполнения асинхронной операции.
     * @param fn - вызываемый метод.
     */
    UssButtonComponent.prototype.execute = function (fn, context) {
        var _this = this;
        if (this.disabled || this.inputDisabled || this.loading || this.inputLoading)
            return function () { };
        var args = [];
        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        fn = fn.bind.apply(fn, [context || this].concat(args));
        var res = fn();
        if (res instanceof Observable_1.Observable || res instanceof Promise) {
            this.setLoading(true);
            if (res instanceof Observable_1.Observable) {
                res.subscribe(function () { return _this.setLoading(false); }, function () { return _this.setLoading(false); });
            }
            else if (res instanceof Promise) {
                res.then(function () { return _this.setLoading(false); }, function () { return _this.setLoading(false); });
            }
        }
        return res;
    };
    return UssButtonComponent;
}());
__decorate([
    ng.Input("class"),
    __metadata("design:type", String)
], UssButtonComponent.prototype, "inputClass", void 0);
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssButtonComponent.prototype, "type", void 0);
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssButtonComponent.prototype, "size", void 0);
__decorate([
    ng.Input(),
    __metadata("design:type", String)
], UssButtonComponent.prototype, "icon", void 0);
__decorate([
    ng.Input("loading"),
    __metadata("design:type", Boolean)
], UssButtonComponent.prototype, "inputLoading", void 0);
__decorate([
    ng.Input("disabled"),
    __metadata("design:type", Boolean)
], UssButtonComponent.prototype, "inputDisabled", void 0);
__decorate([
    ng.ViewChild("content"),
    __metadata("design:type", Object)
], UssButtonComponent.prototype, "content", void 0);
__decorate([
    ng.HostListener("click", ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UssButtonComponent.prototype, "onClick", null);
UssButtonComponent = __decorate([
    ng.Component({
        selector: 'uss-button',
        templateUrl: './button.component.html',
        styleUrls: ['./button.component.scss'],
        encapsulation: ng.ViewEncapsulation.None
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [])
], UssButtonComponent);
exports.UssButtonComponent = UssButtonComponent;
//# sourceMappingURL=button.component.js.map