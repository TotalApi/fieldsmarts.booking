declare var Platform: any;
var Enumerable: linqjs.Enumerable = require('linq');
import * as ojs from 'observe-js';
import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import * as rx from 'rxjs';
import { CustomValidators } from '../common/CustomValidators';
import { Json } from '../../utils/Json';
import { isEmpty, isJsObject, debounce, isArray } from '../../utils/utils';
import {Reflection} from '../../utils/Reflection';
import {UssFormGroup} from './UssFormGroup';
import {debug} from '../../services/messages.service';
import {Inject} from '../../decorators/inject.decorator';

export interface EnumerableItemMetadata {
    Name: string;
    Description: string;
    Value: number;
}

/*
export interface ObjectRefMetadata {
    Name: string;
    KeyPropertyName: string;
    ObjectPropertyName: string;
}
*/

export interface PropertyMetadata {
    Name: string;
    TypeName: string;
    MaxLength?: number;
    MinValue?: number;
    MaxValue?: number;
    Required?: boolean;
    EnumerableMetadata: EnumerableItemMetadata[];
//    ObjectRefMetadata: ObjectRefMetadata;
/*
    Description: string;
    Format: string;
    ColumnName: string;
    Note: string;
    Position: number;
    Hidden?: boolean;
    DefaultInvisible?: boolean;
*/
}

export interface EntityMetadata {
    RepresentExpression: string;
    KeyAttrs: string[];
    Properties: PropertyMetadata[];
/*
    TableName: string;
    Url: string;
    Name: string;
    Description: string;
    Group: string;
    Menu: App.EntityMenu;
    DateProperty: string;
    NumberProperty: string;
    Position: number;
*/
}


/**
 * К компонента, реализующего этот интерфейс будет автоматически вызван метод onValidate для валидации.
 */
export interface IUssValidateComponent {
    onValidate(control: ngForms.AbstractControl): { [key: string]: boolean }
}


/**
 * Для корректной работы директивы uss-data-source наследуйте все компоненты, работающие с ней,
 * от этого класса и корректно реализуйте методы интерфейса IUssValidateComponent.
 */
export class UssDataSourceComponent<TValue, TElement extends HTMLElement> implements ng.OnInit, ng.AfterViewInit, ng.OnChanges, IUssValidateComponent {

    public static Inputs = ['value: model', 'required', 'control', 'placeholder', 'metadata', 'disabled', 'ussDataSource', '_fieldName: fieldName', 'class', 'label', 'defaultValue'];
    public static Outputs = ['modelChange'];

    constructor(protected viewContainer: ng.ViewContainerRef, protected changeDetector: ng.ChangeDetectorRef) {
        if (!viewContainer) {
            throw new Error(`${this.constructor.name} pass viewContainer: ng.ViewContainerRef to constructor.`);
        }
        if (!changeDetector) {
            throw new Error(`${this.constructor.name} pass changeDetector: ng.ChangeDetectorRef to constructor.`);
        }
    }

    @ng.Input('label') label: string;

    @ng.Input('class') class: string;

    @ng.Input('ussDataSource') ussDataSource: Object | ng.ElementRef | any;
    public get dataSource() {
        let res = this.ussDataSource;
        if (!res && this.ussFormGroup instanceof UssFormGroup) {
            res = this.ussFormGroup.datasource;
        }
        return res;
    }

    @ng.Input('fieldName') _fieldName: string;
    get fieldName(): string { return this._fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : "") }

    @ng.Input('defaultValue') defaultValue: any;

    /**
     * Ссылка на метаинформацию свойства или класса, связанного с данным компонентом.
     */
    @ng.Input('metadata') metadata: PropertyMetadata | (() => PropertyMetadata) | EntityMetadata | (() => EntityMetadata);

    public clearValue() {
        this.value = null;
        this.dataSource && this.dataSource[this.fieldName] && (delete this.dataSource[this.fieldName]);
        this.setValue(null);
        this.emitChanges(null);
    }

    public get propertyMetadata(): PropertyMetadata {
        let res = undefined;
        if (typeof this.metadata === "function") {
            res = (<() => PropertyMetadata>this.metadata)();
        } else {
            res = this.metadata;
        }
        if (res && 'Properties' in res) {
            res = (<EntityMetadata>res).Properties.firstOrDefault(pi => pi.Name === this._fieldName);
        }
        if (!res && this.ussFormGroup) {
            const m = this.ussFormGroup.metadata;
            if (m && m.Properties) {
                res = m.Properties.firstOrDefault(pi => pi.Name === this._fieldName);
            }
        }
        return res;
    }

    /**
     * Название реального поля, содержащего значение
     */
    public get dataFieldName(): string {
        return this.fieldName;
    }

    public getEntityMetadata(): EntityMetadata {
        let res = undefined;
        if (typeof this.metadata === "function") {
            res = (<() => EntityMetadata>this.metadata)();
        } else {
            res = this.metadata;
        }
        return res;
    }

    /**
     * Ссылка на FormControl, связанный с данным компонентом. Если явно не указан - создаётся автоматически с валидаторами по умолчанию.
     */
    @ng.Input('control') control: ngForms.FormControl;

    public ussFormGroup: UssFormGroup;
    public formGroup: ngForms.FormGroup;

    protected get isInsideForm(): boolean {
        return !!this.formGroup;
    };

    /**
     * Признак обязательного значения у контрола.
     */
    @ng.Input('required') required: boolean | string;
    public isRequired() {
        let res = this.required === '' || this.required;
        if (this.propertyMetadata && this.propertyMetadata.Required) {
            // если кто-то явно не отменил признак required
            res = this.required !== false && this.required !== 'false';
        }
        return res;
    }

    /*
    * Признак запрета редактирования компонента
    */
    @ng.Input('disabled') disabled: boolean;


    /**
     * Водяной знак компонента
     */ 
    @ng.Input("placeholder") placeholder: string = '';

    @Inject(ng.NgZone) zone: ng.NgZone;

    /**
     * Признак того, что компонент прошёл инициализацию.
     * Устанавливается в событии ngAfterViewInit.
     */
    protected wasInit: boolean;


    protected inputElement: TElement;

    // ReSharper disable once InconsistentNaming
    protected _value: TValue;

    public getValue(): TValue {
        return this.toValue(this._value);
    }

    public setValue(v: TValue) {
        const value = this.toValue(v);
        this._value = value;
        if (this.wasInit) {
            const controlValueChanged = this.control && !this.isValuesEqual(this.control.value, value);
            if (controlValueChanged) {
                this.control.setValue(value);
            }
            this.setDataSourceValue(value);
            this.updateInputElement(value);
            debounce(() => this.changeDetector && this.changeDetector.detectChanges(), 0, this.changeDetector);
        }
    }

    @ng.Input('model')
    public get value(): TValue { return this.getValue() }
    public set value(value: TValue) {
        this.setValue(value);
        this.emitChanges(this.value);
    }
    @ng.Output('modelChange') public modelChange = new ng.EventEmitter<TValue>();


    protected getDataSourceValue(): TValue {
        const fieldName = this.dataFieldName;
        return this.toValue((this.dataSource && fieldName) ? this.dataSource[fieldName] : this.value);
    }

    protected setDataSourceValue(v: TValue) {
        const fieldName = this.dataFieldName;
        if (this.dataSource && fieldName) {
            this.dataSource[fieldName] = this.toValue(v);
        }
    }

    private searchForm(parent: any): ngForms.FormGroup {
        return Enumerable
            .from(parent)
            .select(kv => {
                if (kv.value && typeof kv.value === 'object') {
                    if ((kv.value instanceof ngForms.NgForm || kv.value instanceof ngForms.FormGroupDirective))
                        return kv.value;
                    if (kv.key.startsWith('_') && kv.value.context) {
                        return this.searchForm(kv.value.context);
                    }
                }
                return null;
            })
            .where(x => !!x)
            .select(x => x instanceof ngForms.FormGroup ? x : (<any>x).form)
            .firstOrDefault();
    }

    protected initForm() {
        if (this.ussDataSource) {
            this.ussFormGroup = null;
        } else {
            this.formGroup = this.searchForm(this.viewContainer.parentInjector['_view']);
            if (this.formGroup) {
                if (this.formGroup instanceof UssFormGroup) {
                    this.ussFormGroup = this.formGroup;
                }
            }
        }
        this.initControl();
    }

    /**
     * Вызывается при установке сво-ва value компонента или нажатии клавиши Escape
     */
    protected updateInputElement(value: TValue): void {
        this.setInputElementValue(value);
    }

    /**
     * Вызывается при потере фокуса или нажатии клавиши Enter в поле ввода.
     */
    protected updateValue(textValue: string): void {
        if (this.wasInit) {
            this.value = this.validateControlValue(textValue);
        }
    }

    /**
     * Вызывается в методе updateValue.
     * Служит для проверки и исправления значения на основании данных валидации валидаторами.
     * @param value проверяемое значение, которое должно быть установлено.
     * @returns {} исправленное корректное значение.
     */
    protected validateControlValue(value: any): TValue | any {
        let res = this.toValue(value);
        if (this.control) {
            this.control.setValue(res);
            if (this.control.invalid) {
                const errors: any = this.control.errors;

                if (errors.minValue) {
                    res = errors.minValue.validValue;
                } else if (errors.maxValue) {
                    res = errors.maxValue.validValue;
                } else if (errors.required) {
                    res = this.toValue('');
                }
            }
        }
        return res;
    }

    public get markAsInvalid(): boolean {
        return this.control && !this.control.valid   
            && !this.control.disabled // не считаем невалидными запрещённые контролы - всё-равно пользователь ничего сделать не может
//            && this.control.dirty   // подсвечиваем только контролы которые "трогали"
            // подсвечиваем, если значение контрола равно значению компонента или текущий компонент находится в фокусе
            && (this.isValuesEqual(this.control.value, this.value) || document.activeElement === this.inputElement);
    }

    protected initControl() {
        if (this.ussFormGroup) {
            this.control = <any>(this.ussFormGroup.controls[this.fieldName]);
            if (!this.control) {
                debug(`${this.constructor.name}: Form has not got the control with name '${this.fieldName}'.`);
            } else {
                this.control['_ussComponents'] = this.control['_ussComponents'] || [];
                this.control['_ussComponents'].push(this);
            }
        }
        this.control = this.control || new ngForms.FormControl(this.value, CustomValidators.ussDataSourceComponentValidator(this));
        if (this.disabled)
            this.control.disable();
        else
            this.control.enable();

        this.updateInputElement(this.value);
    }


    private _observes: rx.Subscription[] = [];
    protected observeEvent(eventName: string, fn: (e) => void) {
        if (this.inputElement) {
            this._observes.push(rx.Observable.fromEvent(this.inputElement, eventName).subscribe(fn));
        }
    }

    protected assignInputElement(element?: HTMLInputElement) {
        this.inputElement = element 
            || this.inputElement
            || this.viewContainer.element.nativeElement.querySelector('input')
            || this.viewContainer.element.nativeElement.querySelector('textarea')
            || this.viewContainer.element.nativeElement.querySelector('select')
            ;
        if (this.inputElement && 'value' in this.inputElement) {
            this.observeEvent('change', ($event: Event) => this.onInputElementChange($event));
            this.observeEvent('keyup', ($event: KeyboardEvent) => this.onInputElementKeyUp($event));
            this.observeEvent('keydown', ($event: KeyboardEvent) => this.onInputElementKeyDown($event));
            this.observeEvent('keypress', ($event: KeyboardEvent) => this.onInputElementKeyPress($event));
            this.observeEvent('input', ($event: Event) => this.onInputElementInput($event));
        }
    }

    protected getInputElementValue(): string  {
        return (this.inputElement && 'value' in this.inputElement) ? this.inputElement['value'] : null;
    }
    protected setInputElementValue(value: TValue) {
        const text = this.toText(value);
        this.setInputValueDirect(text);
    }
    protected setInputValueDirect(value: string) {
        this.inputElement
        && ('value' in this.inputElement)
        && (this.inputElement['value'] = value);
    }
    protected onInputElementChange($event: Event) {
        this.updateValue(this.getInputElementValue());
    }

    protected onInputElementKeyUp($event: KeyboardEvent) {
    }

    protected onInputElementInput($event: Event) {
        this.control.markAsDirty();
        this.control.setValue(this.toValue(this.getInputElementValue()));
    }

    protected onInputElementKeyDown($event: KeyboardEvent) {
        const el: HTMLInputElement | HTMLTextAreaElement = <any>this.inputElement;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {

            if (!this.isValuesEqual(el.value, this.value)) {
                switch ($event.keyCode) {
                    case 27: // "Escape"
                        this.updateInputElement(this.value);
                        // тут НЕ нужен break !!!!
                    case 13: // "Enter"
                        if (!(el instanceof HTMLTextAreaElement)) {
                            this.updateValue(el.value);
                            setTimeout(() => {
                                if (!el.disabled)
                                    el.select();
                            });
                            $event.preventDefault();
                            $event.stopPropagation();
                        }
                        break;
                }
            }
        }
    }

    protected onInputElementKeyPress($event: KeyboardEvent) {
    }

    ngOnInit() {
        this.assignInputElement();
        this.initForm();
        setTimeout(() => this.initForm(), 0);
    }
    ngAfterViewInit() {
        this.wasInit = true;
        this.value = this.getDataSourceValue();
        this.observeChanges();
    }

    ngOnChanges(ch) {
        if (!this.wasInit) return;
        if (ch.disabled) {
            this.initControl();
        }
        if ((ch.dataSource || ch._fieldName || ch.metadata)) {
            this.initForm();
        }
    }

    ngOnDestroy() {
        this.changeDetector = null;
        this.disposeValueObserver();
        for (let o of this._observes) {
            o.unsubscribe();
        }
        this._observes = [];
    }


    private _valueObserverZoneSubscription;
    private _valueObserver;
    protected get valueObserver() { return this._valueObserver; };
    protected set valueObserver(value) {
        this.disposeValueObserver();
        this._valueObserver = value;
        if (this._valueObserver) {
            this._valueObserverZoneSubscription = this.zone.onStable.subscribe(() => {
                Platform.performMicrotaskCheckpoint();
            });
        }
    };

    protected disposeValueObserver() {
        if (this._valueObserver) {
            this._valueObserver.close();
            this._valueObserver = undefined;
            this._valueObserverZoneSubscription.unsubscribe();
        }
    }

    protected observeChanges() {
        this.disposeValueObserver();
        if (isJsObject(this.dataSource) && this.dataFieldName) {
            (this.valueObserver = new ojs.PathObserver(this.dataSource, this.dataFieldName))
                .open(newValue => {
                    this.value = newValue;
                });
        }
    }

    public isValuesEqual(value1: TValue | any, value2: TValue | any) {
        value1 = this.toValue(value1);
        value2 = this.toValue(value2);
        if (value1 === undefined && value2 === undefined || value1 === null && value2 === null) return true;
        if (value1 === undefined || value1 === null || value2 === undefined || value2 === null) return false;
        if (isJsObject(value1) || isJsObject(value2))
            return this.toText(value1) === this.toText(value2);
        else
            return value1 === value2;
    }


    /**
     * Преобразование значения компонента в текстовое представление.
     */
    public toText(v: TValue): string {
        v = this.toValue(v);
        let res = (v === undefined || v === null) ? '' : v.toString();
        if (this.propertyMetadata && res !== '') {
            if (this.propertyMetadata.TypeName === 'integer' || this.propertyMetadata.TypeName === 'float')
                res = isNaN(<any>v) ? '' : res;
            else if (this.propertyMetadata.EnumerableMetadata)
                res = this.propertyMetadata.EnumerableMetadata.where(x => x.Value === <any>v)
                    .select(x => x.Description || x.Name)
                    .firstOrDefault() || res;
        }
        return res;
    }

    /**
     * Преобразование переданного значения (в том числе и текстового представления) в значение компонента корректного типа.
     */
    public toValue(v: any): TValue {
        let res = v;
        if (this.propertyMetadata && res !== undefined && res !== null) {
            if (this.propertyMetadata.TypeName === 'integer' || this.propertyMetadata.EnumerableMetadata) {
                res = parseInt(res);
                if (isNaN(res)) {
                    res = null;
                }
            }
            else if (this.propertyMetadata.TypeName === 'float') {
                res = parseFloat(res);
                if (isNaN(res)) {
                    res = null;
                }
            }
        }
        return res;
    }


    /**
     * Инициирует отсылку сообщений об изменении значения в компоненте.
     * @param value значение, которое будет послано для уведомления. Если не указано - используется текущее значение.
     */
    public emitChanges(value?: TValue) {
        if (value === undefined) value = this.value;
        this.modelChange.emit(value);
    }

    /**
     * Имплементация валидатора контрола компонента.
     * Будет автоматически вызвана, если контрол содержит CustomValidators.ussDataSourceComponentValidator или CustomValidators.ussFormValidator.
     * Необходимо вернуть null в случае, если валидация прошла успешно или объект с ошибкой валидации.
     * Пустой объект в качестве успеха валидации возвращать нельзя - форма считает себя невалидной.
     * @param control ссылка на FormControl, для которого проводится валидация.
     */
    onValidate(control: ngForms.AbstractControl): { [key: string]: boolean } {
        let res = null;
        if (control) {
            res = Json.assign(null, CustomValidators.ussPropertyMetadataValidator(this.propertyMetadata)(control));
            if (this.isRequired()) {
                res = Json.assign(res, ngForms.Validators.required(control));
            }
            else if (res) {
                delete res.required;
            }
        }
        return res;
    }
}



