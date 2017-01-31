import * as ojs from 'observe-js';
import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import { UssDirectiveBase } from '../../directives/directive.base';
import { SystemComponent } from '../../decorators/system-component.decorator';
import { UssFormGroup } from '../common/UssFormGroup';
import {isJsObject, debounce } from '../../utils/utils';
import { EntityMetadata, PropertyMetadata } from '../common/UssDataSourceComponent';
var Enumerable: linqjs.Enumerable = require('linq');

export class UssSimpleValueComponent {

    private constructor() { }

    /**
     * Simple IUssValueComponent implementation
     * @param getValueFn method for getting value
     * @param setValueFn method for setting value
     * @param toTextFn method for converting value into text
     * @param toValueFn method for converting text into value
     */
    public static create(
        getValueFn: () => any,
        setValueFn: (v: any) => void,
        toTextFn?: (v: any) => string,
        toValueFn?: (v: any) => any
    ): UssSimpleValueComponent {
        const res = new UssSimpleValueComponent();
        res.getValueFn = getValueFn;
        res.setValueFn = setValueFn;
        res.toTextFn = toTextFn;
        res.toValueFn = toValueFn;
        return res;
    }

    private getValueFn: () => any;
    private setValueFn: (v: any) => void;
    private toTextFn: (v: any) => string;
    private toValueFn: (v: any) => any;

    public control: ngForms.FormControl;

    public metadata: PropertyMetadata | (() => PropertyMetadata);
    public get propertyMetadata(): PropertyMetadata {
        if (typeof this.metadata === "function")
            return (<() => PropertyMetadata>this.metadata)();
        else
            return this.metadata;
    }

    public get value(): any { return this.getValueFn() }
    public set value(v: any) { this.setValueFn(v) }

    /**
     * Converts value to text.
     */
    public toText(v: any): string {
        return this.toTextFn
            ? this.toTextFn(v)
            : (v === undefined || v === null || isNaN(v)) ? '' : v.toString();
    }

    /**
     * Convert argument into components value.
     */
    public toValue(v: any): any {
        let res = v;
        if (this.toValueFn) {
            res = this.toValueFn(v);
        }
        else if (this.propertyMetadata && v !== undefined && v !== null) {
            if (this.propertyMetadata.TypeName === 'integer')
                res = parseInt(res);
            else if (this.propertyMetadata.TypeName === 'float')
                res = parseFloat(res);
        }
        return res;
    }
    public isValuesEqual(value1: any, value2: any) {
        value1 = this.toValue(value1);
        value2 = this.toValue(value2);
        if (value1 === undefined && value2 === undefined || value1 === null && value2 === null) return true;
        if (value1 === undefined || value1 === null || value2 === undefined || value2 === null) return false;
        if (isJsObject(value1) || isJsObject(value2))
            return this.toText(value1) === this.toText(value2);
        else
            return value1 === value2;
    }

}

export abstract class UssDataSourceBaseDirective<TNativeElement extends HTMLInputElement | HTMLTextAreaElement> extends UssDirectiveBase<any> implements ng.OnInit, ng.OnChanges {

    public static Inputs = ['dataSource: ussDataSource', 'fieldName', 'autoSelectOnFocus: autoSelect', 'metadata'];
    public static Outputs = ['valueChange'];
    public static Host = {
        '(change)': 'onChanged($event)',
        '(modelChange)': 'onChanged($event)',
        '(keydown)': 'onKeyDown($event)',
        '(keyup)': 'onKeyUp($event)',
        '(focusin)': 'onFocused($event)'
    }

    constructor(hostElementRef: ng.ElementRef, viewContainer: ng.ViewContainerRef, hostComponent: TNativeElement) {
        super(hostComponent, hostElementRef, viewContainer);
    }

    /**
     * Data source
     */
    @ng.Input('ussDataSource') dataSource: Object;

    /**
     * Field name
     */
    @ng.Input('fieldName') fieldName: string;

    /**
     * If true - input value will be automatically selected after focus in
     */
    @ng.Input('autoSelect') autoSelectOnFocus: boolean = false;

    @ng.Input('metadata') metadata: EntityMetadata | PropertyMetadata | any;

    /**
     * Form reference which wraps the component
     */
    protected form: UssFormGroup;

    protected get propertyMetadata(): PropertyMetadata {
        let res = null;
        if (this.metadata) {
            if (this.metadata.Properties) {
                res = Enumerable.from<PropertyMetadata>(this.metadata.Properties).firstOrDefault(x => x.Name === this.fieldName);
            } else {
                res = this.metadata;
            }
        }
        return res;
    }


    /**
     *  Component which hosts the directive
     */
    protected ussHostComponent: UssSimpleValueComponent;


    private _value: any;
    /**
     * Current components value
     */
    public get value(): any { return (this.dataSource && this.fieldName) ? this.dataSource[this.fieldName] : this._value; }
    public set value(value: any) {
        if (this._value !== value) {
            this._value = value;
            this.updateValue(value);
            this.updateElementValue(this.value);
            this.valueChange.emit(this.value);
        }
    }
    @ng.Output('valueChange') public valueChange = new ng.EventEmitter<string | number>();

    protected _nativeElement: TNativeElement;
    /**
     * Reference to native element
     */
    protected abstract nativeElement: TNativeElement;

    protected inOnChanged: boolean;

    @ng.HostListener('change', ['$event'])
    @ng.HostListener('modelChange', ['$event'])
    public onChanged($event: any) {
        this.updateComponentValue($event instanceof Event ? undefined : $event);
        this.inOnChanged = true;
    }

    @ng.HostListener('keydown', ['$event'])
    public onKeyDown($event: KeyboardEvent) {
        this.inOnChanged = false;
    }

    @ng.HostListener('keyup', ['$event'])
    public onKeyUp($event: KeyboardEvent) {
        this.updateFormValue();
    }

    @ng.HostListener('focusin', ['$event'])
    public onFocused($event: Event) {
        if (this.autoSelectOnFocus)
            (<any>$event.srcElement).select();
    }

    ngOnChanges(changes) {
        if (changes.dataSource || changes.fieldName || changes.metadata) {
            this.updateValue();
            this.observeChanges();
        }
    }


    protected observeChanges() {
        this.disposeValueObserver();
        if (typeof this.dataSource === "object" && this.fieldName) {
            (this.valueObserver = new ojs.PathObserver(this.dataSource, this.fieldName))
                .open(newValue => {
                    this.value = newValue;
                });
        }
    }

    /**
     * Updates value of component in datasource.
     */
    protected updateValue(value?: any) {
        this.fieldName = this.fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : undefined);
        if (this.dataSource && this.fieldName && this.wasInit) {
            this.dataSource[this.fieldName] = value === undefined ? this.value : value;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.hostElementRef.nativeElement['_ussDataSource'] = this;
        const hostComponent = this.hostComponent || {};
        this.ussHostComponent = this.createUssHostComponent(hostComponent);
        this.initControl();
    }

    protected createUssHostComponent(hostComponent: any): UssSimpleValueComponent {
        const res = UssSimpleValueComponent.create(
            () => this.getComponentValue(),
            v => this.setElementValue(v),
            hostComponent.toText,
            hostComponent.toValue
        );
        res.metadata = this.propertyMetadata;
        return res;
    }

    /**
     * Get current component value based on value of HTML element
     */
    protected getComponentValue(): any {
        return this.nativeElement ? this.nativeElement.value : null;
    }

    /**
     * Sets value of HTML element from components value.
     */
    protected setElementValue(value: any) {
        if (this.nativeElement) {
            value = value === undefined ? '' : value;
            if (this.nativeElement.value !== value) {
                this.nativeElement.value = value;
            }
        }
    }

    protected initControl() {
        this.fieldName = this.fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : undefined);
        const formDirective = Enumerable.from(this.hostViewContainer.injector['_view'])
            .select(kv => kv.value)
            .firstOrDefault(x => x instanceof ngForms.FormGroupDirective);
        if (formDirective) {
            this.form = formDirective.form;
        } else {
            this.form = Enumerable.from(this.hostViewContainer.injector['_view'])
                .select(kv => kv.value)
                .where(x => x instanceof ngForms.NgForm)
                .select(f => f.form)
                .firstOrDefault();
        }

        if (this.form) {
            this.dataSource = this.dataSource || this.form.datasource;
            this.metadata = this.metadata || this.form.metadata;
            if (this.dataSource && this.ussHostComponent) {
                let fieldName = this.fieldName;
                if (!fieldName && this.propertyMetadata) {
                    fieldName = this.propertyMetadata.Name;
                }
                const control = <ngForms.FormControl>this.form.controls[fieldName];
                if (control) {
                    control['_ussComponents'] = control['_ussComponents'] || [];
                    control['_ussComponents'].push(this.ussHostComponent);
                    this.ussHostComponent.control = control;
                }
                this.ussHostComponent.metadata = this.propertyMetadata;
                setTimeout(() => {
                    this.ussHostComponent.value = this.dataSource[fieldName];
                });
            }
        }
        // set control value as datasource value
        setTimeout(() => {
            this.updateElementValue(this.value);
        });
        this.observeChanges();
    }

    /**
     * Sets value in FormControl from components value.
     */
    private updateFormValue(value?: any) {
        if (this.form) {
            const control = this.form.controls[this.fieldName];
            if (control && this.nativeElement) {
                if (value === undefined) value = this.nativeElement.value;
                value = this.ussHostComponent.toValue(value);
                let v1 = this.form.controls[this.fieldName].value;
                let v2 = value;
                if (isJsObject(value)) {
                    v1 = this.ussHostComponent.toText(v1);
                    v2 = this.ussHostComponent.toText(v2);
                }
                if (v1 !== v2) {
                    this.form.controls[this.fieldName].setValue(value);
                }
            }
        }
    }

    /**
     * Updates value of component from control value
     * @param value
     */
    protected updateComponentValue(value?: any) {
        this.value = value === undefined ? this.ussHostComponent.value : value;
        this.updateFormValue(this.value);
    }

    /**
     * Updates value of control from component value
     * @param value
     */
    protected updateElementValue(value: any) {
        if (!this.ussHostComponent.isValuesEqual(this.ussHostComponent.value, value)) {
            this.ussHostComponent.value = value;
            this.updateFormValue(this.ussHostComponent.value);
        }
    }
}
