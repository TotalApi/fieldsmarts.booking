"use strict";
var ng = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var Reflection_1 = require("../utils/Reflection");
/**
 * Замена неработающему angular-декоратору.
 * После того как будет исправлено, можно будет убрать.
 */
exports.HostBinding = function (propertyName) { return function (target, propertyKey) {
    propertyName = propertyName || propertyKey;
    Object.defineProperty(target, propertyKey, {
        get: function () {
            return this['hostComponent'] ? this['hostComponent'][propertyName] : undefined;
        },
        set: function (v) {
            if (this['hostComponent'])
                this['hostComponent'][propertyName] = v;
        },
        enumerable: true,
        configurable: true,
    });
}; };
var UssDirectiveBase = (function () {
    function UssDirectiveBase(hostComponent, hostElementRef, viewContainer, compiler) {
        this.hostComponent = hostComponent;
        this.hostElementRef = hostElementRef;
        this.viewContainer = viewContainer;
        this.compiler = compiler;
        this.templateCache = {};
        this.hostNativeElement = hostElementRef.nativeElement;
        this.compiler = compiler || Reflection_1.Reflection.get(ng.Compiler);
        this.hostViewContainer = viewContainer;
    }
    Object.defineProperty(UssDirectiveBase.prototype, "valueObserver", {
        get: function () { return this._valueObserver; },
        set: function (value) {
            this.disposeValueObserver();
            this._valueObserver = value;
            if (this._valueObserver) {
                this._valueObserverZoneSubscription = Reflection_1.Reflection.get(ng.NgZone).onStable.subscribe(function () {
                    Platform.performMicrotaskCheckpoint();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    UssDirectiveBase.prototype.disposeValueObserver = function () {
        if (this._valueObserver) {
            this._valueObserver.close();
            this._valueObserver = undefined;
            this._valueObserverZoneSubscription.unsubscribe();
        }
    };
    UssDirectiveBase.prototype.createComponentRef = function (template) {
        var DynaClass = (function () {
            function DynamicComponent() {
            }
            return DynamicComponent;
        }());
        ng.ViewChild('template')(new DynaClass(), 'template');
        ng.Component({ template: template })(DynaClass);
        var dynaModule = (function () {
            function DynamicModule() {
            }
            return DynamicModule;
        }());
        ng.NgModule({
            declarations: [DynaClass],
            imports: [platform_browser_1.BrowserModule],
            schemas: [ng.CUSTOM_ELEMENTS_SCHEMA]
        })(dynaModule);
        var factories = this.compiler.compileModuleAndAllComponentsSync(dynaModule);
        var factory = factories.componentFactories[0];
        var component = this.viewContainer.createComponent(factory);
        component.instance.self = this;
        return component;
    };
    UssDirectiveBase.prototype.createTemplate = function (template, params) {
        var prms = '';
        if (params) {
            prms = linq.from(params).select(function (kv) { return "let-" + kv.key + "=\"" + kv.value + "\""; }).toArray().join(' ');
        }
        template = "<template #template let-col let-$item=\"rowData\" let-rowData=\"rowData\" " + prms + ">" + template + "</template>";
        var res = this.templateCache[template];
        if (!res) {
            var component = this.createComponentRef(template);
            res = component.instance.template;
            this.templateCache[template] = res;
        }
        return res;
    };
    UssDirectiveBase.prototype.ngOnInit = function () {
        this.wasInit = true;
    };
    UssDirectiveBase.prototype.ngOnDestroy = function () {
        this.disposeValueObserver();
    };
    return UssDirectiveBase;
}());
exports.UssDirectiveBase = UssDirectiveBase;
//# sourceMappingURL=directive.base.js.map