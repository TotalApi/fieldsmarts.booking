﻿declare var Platform: any;
import * as ojs from 'observe-js';
import * as ng from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { SystemComponent } from '../decorators/system-component.decorator';
import { UssEnumDescriptionPipe } from '../pipes/enum.pipe';
import {isString, isArray} from "../utils";
import { Reflection } from '../utils/Reflection';


/**
 * Замена неработающему angular-декоратору.
 * После того как будет исправлено, можно будет убрать.
 */
export var HostBinding = (propertyName?: string) => (target, propertyKey) => {
    propertyName = propertyName || propertyKey;
    Object.defineProperty(target, propertyKey,
        {
            get: function() {
                return this['hostComponent'] ? this['hostComponent'][propertyName] : undefined;
            },
            set: function(v) {
                if (this['hostComponent'])
                    this['hostComponent'][propertyName] = v;
            },
            enumerable: true,
            configurable: true,
        });
};

export abstract class UssDirectiveBase<T> implements ng.OnInit, ng.OnDestroy {

    constructor(protected hostComponent: T, protected hostElementRef: ng.ElementRef, protected viewContainer: ng.ViewContainerRef, protected compiler?: ng.Compiler) {
        this.hostNativeElement = hostElementRef.nativeElement;
        this.compiler = compiler || Reflection.get(ng.Compiler);
        this.hostViewContainer = viewContainer;
    }

    /**
     * Признак, что компонент прошёл этап инициализации.
     * Устанавливается в обработчике ngOnInit() - не забывайте вызывать обработчик родителя в дочерних классах.
     */
    protected wasInit: boolean;

    private _valueObserverZoneSubscription;
    private _valueObserver;
    protected get valueObserver() { return this._valueObserver; };
    protected set valueObserver(value) {
        this.disposeValueObserver();
        this._valueObserver = value;
        if (this._valueObserver) {
            this._valueObserverZoneSubscription = Reflection.get(ng.NgZone).onStable.subscribe(() => {
                Platform.performMicrotaskCheckpoint();
            });
        }
    };

/*
    private _hostComponent: T;
    protected get hostComponent(): T {
        if (!this._hostComponent) {
            // попробуем получить ссылку на хост-компонент полулегальным способом
            if (this.viewContainer['_element'])
                this._hostComponent = this.viewContainer['_element'].component;
            // если это не получилось и если компонент передаёт ссылку на самого себя в nativeElement получим оттуда
            this._hostComponent = this._hostComponent || this.hostElementRef.nativeElement['__controller'];
        }
        return this._hostComponent;
    }
*/

    protected hostNativeElement: HTMLElement;
    protected hostViewContainer: ng.ViewContainerRef;

    protected disposeValueObserver() {
        if (this._valueObserver) {
            this._valueObserver.close();
            this._valueObserver = undefined;
            this._valueObserverZoneSubscription.unsubscribe();
        }
    }

    protected createComponentRef(template: string): ng.ComponentRef<any> {
        const DynaClass = class DynamicComponent { };
        ng.ViewChild('template')(new DynaClass(), 'template');
        ng.Component({ template })(DynaClass);
        const dynaModule = class DynamicModule { };
        ng.NgModule({
            declarations: [DynaClass],
            imports: [BrowserModule],
            schemas: [ng.CUSTOM_ELEMENTS_SCHEMA]
        })(dynaModule);
        const factories = this.compiler.compileModuleAndAllComponentsSync(dynaModule);
        const factory = factories.componentFactories[0];
        const component = this.viewContainer.createComponent(factory);
        component.instance.self = this;
        return component;
    }
    private templateCache: { [HTMLTemplateElement: string]: ng.TemplateRef<any> } = {};
    protected createTemplate(template: string, params?: { [key: string]: string; }): ng.TemplateRef<any> {
        let prms = '';
        if (params) {
            prms = linq.from(params).select(kv => `let-${kv.key}="${kv.value}"`).toArray().join(' ');
        }
        template = `<template #template let-col let-$item="rowData" let-rowData="rowData" ${prms}>${template}</template>`;
        let res = this.templateCache[template];
        if (!res) {
            const component = this.createComponentRef(template);
            res = component.instance.template;
            this.templateCache[template] = res;
        }
        return res;
    }


    ngOnInit() {
        this.wasInit = true;
    }
    

    ngOnDestroy() {
        this.disposeValueObserver();
    }
}

