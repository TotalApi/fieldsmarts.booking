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
var ng2_translate_1 = require("ng2-translate");
var system_component_decorator_1 = require("../decorators/system-component.decorator");
var i18nDirective = (function () {
    function i18nDirective(el, renderer, translateService, sanitizer, cdRef) {
        this.el = el;
        this.renderer = renderer;
        this.translateService = translateService;
        this.sanitizer = sanitizer;
        this.cdRef = cdRef;
    }
    i18nDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        // if there is a subscription to onLangChange, clean it
        this.dispose();
        this.translateElements = this.el.nativeElement.querySelectorAll("[i18n]");
        if (!this.translateElements || this.translateElements.length === 0) {
            this.translateElements = [this.el.nativeElement];
        }
        if (this.translate()) {
            // subscribe to onTranslationChange event, in case the translations change
            if (!this.onTranslationChange) {
                this.onTranslationChange = this.translateService.onTranslationChange.subscribe(function (event) {
                    if (event.lang === _this.translateService.currentLang) {
                        setTimeout(function () { return _this.translate(); });
                    }
                });
            }
            // subscribe to onLangChange event, in case the language changes
            if (!this.onLangChange) {
                this.onLangChange = this.translateService.onLangChange.subscribe(function (event) {
                    if (event.lang !== _this.currentLang) {
                        setTimeout(function () { return _this.translate(); });
                    }
                });
            }
        }
    };
    i18nDirective.prototype.ngOnDestroy = function () {
        this.dispose();
    };
    i18nDirective.prototype.dispose = function () {
        if (this.onTranslationChange) {
            this.onTranslationChange.unsubscribe();
            this.onTranslationChange = undefined;
        }
        if (this.onLangChange) {
            this.onLangChange.unsubscribe();
            this.onLangChange = undefined;
        }
    };
    i18nDirective.prototype.translate = function () {
        this.currentLang = this.translateService.currentLang;
        var res = false;
        for (var i = 0; i < this.translateElements.length; i++) {
            res = this.translateElement(this.translateElements[i]) || res;
        }
        return res;
    };
    i18nDirective.prototype.translateElement = function (el) {
        var _this = this;
        var key = el['__i18n__key__'] || this.key || (el['__i18n__key__'] = el.innerHTML);
        if (key) {
            this.translateService.get(key)
                .subscribe(function (res) {
                if (res) {
                    el.innerHTML = _this.sanitizer.sanitize(core_1.SecurityContext.HTML, res);
                    _this.cdRef.markForCheck();
                }
            });
        }
        return !!key;
    };
    i18nDirective.prototype.onClick = function () {
        // just for sample
    };
    return i18nDirective;
}());
__decorate([
    core_1.Input('i18n'),
    __metadata("design:type", String)
], i18nDirective.prototype, "key", void 0);
i18nDirective = __decorate([
    core_1.Directive({
        selector: '[i18n]',
        host: {
            '(click)': 'onClick()'
        }
    }),
    system_component_decorator_1.SystemComponent(),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer, ng2_translate_1.TranslateService, core_1.Sanitizer, core_1.ChangeDetectorRef])
], i18nDirective);
exports.i18nDirective = i18nDirective;
//# sourceMappingURL=i18n.directive.js.map