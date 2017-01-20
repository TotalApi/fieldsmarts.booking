import * as ojs from 'observe-js';
import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import { UssDirectiveBase } from '../../directives/directive.base';
import { SystemComponent } from '../../decorators/system-component.decorator';
import { UssFormGroup } from '../common/UssFormGroup';
import {isJsObject, debounce } from '../../utils/utils';
var Enumerable: linqjs.Enumerable = require('linq');

export class UssSimpleValueComponent {

    private constructor() { }

    /**
     * Создание простой имплементации интерфейса IUssValueComponent
     * @param getValueFn метод получения значения
     * @param setValueFn метод установки значения
     * @param toTextFn метод преобразования значения в текст
     * @param toValueFn метод преобразования текста в значение
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

    public get value(): any { return this.getValueFn() }
    public set value(v: any) { this.setValueFn(v) }

    /**
     * Преобразование значения компонента в текстовое представление.
     */
    public toText(v: any): string {
        return this.toTextFn
            ? this.toTextFn(v)
            : (v === undefined || v === null || isNaN(v)) ? '' : v.toString();
    }

    /**
     * Преобразование переданного значения (в том числе и текстового представления) в значение компонента корректного типа.
     */
    public toValue(v: any): any {
        let res = v;
        if (this.toValueFn) {
            res = this.toValueFn(v);
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
     * Источник данных (объект) с полем которого связывается компонент
     */
    @ng.Input('ussDataSource') dataSource: Object;

    /**
     * Название поля источника данных с которым связывается компонент
     */
    @ng.Input('fieldName') fieldName: string;

    /**
     * Если равно true - содержимое инпута будет автоматически выделено после попадания в него фокуса ввода
     */
    @ng.Input('autoSelect') autoSelectOnFocus: boolean = false;

    /**
     * Ссылка на форму, внутри которой лежит компонент
     */
    protected form: UssFormGroup;

    /**
     * Это интерфейс для работы с компонентом (установка/получение форматированного значения).
     * Если его реализует компонент, к которому привязана директива - используется он, иначе
     * создаём простейшую реализацию этого интерфейса для унификации работы
     */
    protected ussHostComponent: UssSimpleValueComponent;


    private _value: any;
    /**
     * Текущее значение компонента.
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
     * Ссылка на нативный элемент ввода
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
     * Обновление значения компонента в источнике данных.
     */
    protected updateValue(value?: any) {
        if (this.dataSource && this.fieldName && this.wasInit) {
            this.dataSource[this.fieldName] = value === undefined ? this.value : value;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.hostElementRef.nativeElement['_ussDataSource'] = this;
        // если хост-компонент имплементирует UssValueComponent - будем использовать этот интерфейс 
        // для получения/установки значения компонента, если нет - создадим имплементацию по умолчанию,
        // для простоты работы директивы:
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
        return res;
    }

    /**
     * Получение текущего значения компонента на основании значения в HTML-элементе
     */
    protected getComponentValue(): any {
        return this.nativeElement ? this.nativeElement.value : null;
    }

    /**
     * Установка значения в HTML-элементе, соответствующая текущему значению компонента.
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
            if (this.dataSource && this.ussHostComponent) {
                let fieldName = this.fieldName;
                const control = <ngForms.FormControl>this.form.controls[fieldName];
                if (control) {
                    control['_ussComponents'] = control['_ussComponents'] || [];
                    control['_ussComponents'].push(this.ussHostComponent);
                    this.ussHostComponent.control = control;
                }
                setTimeout(() => {
                    this.ussHostComponent.value = this.dataSource[fieldName];
                });
            }
        }
        // Установить значение в контроле равным значению в источнике данных
        setTimeout(() => {
            this.updateElementValue(this.value);
        });
        this.observeChanges();
    }

    /**
     * Установка значения в FormControl-е, соответствующая текущему значению компонента.
     */
    private updateFormValue(value?: any) {
        if (this.form) {
            const control = this.form.controls[this.fieldName];
            if (control && this.nativeElement) {
                if (value === undefined) value = this.nativeElement.value;
                value = this.ussHostComponent.toValue(value);
                // Нужно вызывать setValue для FormControl'а только если оно изменилось,
                // чтобы не вызывались ненужные события, информирующие об изменении состояния
                let v1 = this.form.controls[this.fieldName].value;
                let v2 = value;
                if (isJsObject(value)) {
                    // Однако объектные значения просто так сравнивать нельзя (например дату),
                    // поэтому превратим их в текст для сравнения
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
     * Обновляет значение компонента на основании данных контрола
     * @param value
     */
    protected updateComponentValue(value?: any) {
        this.value = value === undefined ? this.ussHostComponent.value : value;
        this.updateFormValue(this.value);
    }

    /**
     * Обновляет значение в контроле соответствующего текущему значению компонента
     * @param value
     */
    protected updateElementValue(value: any) {
        if (!this.ussHostComponent.isValuesEqual(this.ussHostComponent.value, value)) {
            this.ussHostComponent.value = value;
            this.updateFormValue(this.ussHostComponent.value);
        }
    }
}
