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
var Enumerable = require('linq');
var ojs = require("observe-js");
var ng = require("@angular/core");
var ngForms = require("@angular/forms");
var rx = require("rxjs");
var CustomValidators_1 = require("../common/CustomValidators");
var Json_1 = require("../../utils/Json");
var utils_1 = require("../../utils/utils");
var UssFormGroup_1 = require("./UssFormGroup");
var messages_service_1 = require("../../services/messages.service");
var inject_decorator_1 = require("../../decorators/inject.decorator");
/**
 * Для корректной работы директивы uss-data-source наследуйте все компоненты, работающие с ней,
 * от этого класса и корректно реализуйте методы интерфейса IUssValidateComponent.
 */
var UssDataSourceComponent = (function () {
    function UssDataSourceComponent(viewContainer, changeDetector) {
        this.viewContainer = viewContainer;
        this.changeDetector = changeDetector;
        /**
         * Водяной знак компонента
         */
        this.placeholder = '';
        this.modelChange = new ng.EventEmitter();
        this._observes = [];
        if (!viewContainer) {
            throw new Error(this.constructor.name + " pass viewContainer: ng.ViewContainerRef to constructor.");
        }
        if (!changeDetector) {
            throw new Error(this.constructor.name + " pass changeDetector: ng.ChangeDetectorRef to constructor.");
        }
    }
    Object.defineProperty(UssDataSourceComponent.prototype, "dataSource", {
        get: function () {
            var res = this.ussDataSource;
            if (!res && this.ussFormGroup instanceof UssFormGroup_1.UssFormGroup) {
                res = this.ussFormGroup.datasource;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UssDataSourceComponent.prototype, "fieldName", {
        get: function () { return this._fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : ""); },
        enumerable: true,
        configurable: true
    });
    UssDataSourceComponent.prototype.clearValue = function () {
        this.value = null;
        this.dataSource && this.dataSource[this.fieldName] && (delete this.dataSource[this.fieldName]);
        this.setValue(null);
        this.emitChanges(null);
    };
    Object.defineProperty(UssDataSourceComponent.prototype, "propertyMetadata", {
        get: function () {
            var _this = this;
            var res = undefined;
            if (typeof this.metadata === "function") {
                res = this.metadata();
            }
            else {
                res = this.metadata;
            }
            if (res && 'Properties' in res) {
                res = res.Properties.firstOrDefault(function (pi) { return pi.Name === _this._fieldName; });
            }
            if (!res && this.ussFormGroup) {
                var m = this.ussFormGroup.metadata;
                if (m && m.Properties) {
                    res = m.Properties.firstOrDefault(function (pi) { return pi.Name === _this._fieldName; });
                }
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UssDataSourceComponent.prototype, "dataFieldName", {
        /**
         * Название реального поля, содержащего значение
         */
        get: function () {
            return this.fieldName;
        },
        enumerable: true,
        configurable: true
    });
    UssDataSourceComponent.prototype.getEntityMetadata = function () {
        var res = undefined;
        if (typeof this.metadata === "function") {
            res = this.metadata();
        }
        else {
            res = this.metadata;
        }
        return res;
    };
    Object.defineProperty(UssDataSourceComponent.prototype, "isInsideForm", {
        get: function () {
            return !!this.formGroup;
        },
        enumerable: true,
        configurable: true
    });
    ;
    UssDataSourceComponent.prototype.isRequired = function () {
        var res = this.required === '' || this.required;
        if (this.propertyMetadata && this.propertyMetadata.Required) {
            // если кто-то явно не отменил признак required
            res = this.required !== false && this.required !== 'false';
        }
        return res;
    };
    UssDataSourceComponent.prototype.getValue = function () {
        return this.toValue(this._value);
    };
    UssDataSourceComponent.prototype.setValue = function (v) {
        var _this = this;
        var value = this.toValue(v);
        this._value = value;
        if (this.wasInit) {
            var controlValueChanged = this.control && !this.isValuesEqual(this.control.value, value);
            if (controlValueChanged) {
                this.control.setValue(value);
            }
            this.setDataSourceValue(value);
            this.updateInputElement(value);
            utils_1.debounce(function () { return _this.changeDetector && _this.changeDetector.detectChanges(); }, 0, this.changeDetector);
        }
    };
    Object.defineProperty(UssDataSourceComponent.prototype, "value", {
        get: function () { return this.getValue(); },
        set: function (value) {
            this.setValue(value);
            this.emitChanges(this.value);
        },
        enumerable: true,
        configurable: true
    });
    UssDataSourceComponent.prototype.getDataSourceValue = function () {
        var fieldName = this.dataFieldName;
        return this.toValue((this.dataSource && fieldName) ? this.dataSource[fieldName] : this.value);
    };
    UssDataSourceComponent.prototype.setDataSourceValue = function (v) {
        var fieldName = this.dataFieldName;
        if (this.dataSource && fieldName) {
            this.dataSource[fieldName] = this.toValue(v);
        }
    };
    UssDataSourceComponent.prototype.searchForm = function (parent) {
        var _this = this;
        return Enumerable
            .from(parent)
            .select(function (kv) {
            if (kv.value && typeof kv.value === 'object') {
                if ((kv.value instanceof ngForms.NgForm || kv.value instanceof ngForms.FormGroupDirective))
                    return kv.value;
                if (kv.key.startsWith('_') && kv.value.context) {
                    return _this.searchForm(kv.value.context);
                }
            }
            return null;
        })
            .where(function (x) { return !!x; })
            .select(function (x) { return x instanceof ngForms.FormGroup ? x : x.form; })
            .firstOrDefault();
    };
    UssDataSourceComponent.prototype.initForm = function () {
        if (this.ussDataSource) {
            this.ussFormGroup = null;
        }
        else {
            this.formGroup = this.searchForm(this.viewContainer.parentInjector['_view']);
            if (this.formGroup) {
                if (this.formGroup instanceof UssFormGroup_1.UssFormGroup) {
                    this.ussFormGroup = this.formGroup;
                }
            }
        }
        this.initControl();
    };
    /**
     * Вызывается при установке сво-ва value компонента или нажатии клавиши Escape
     */
    UssDataSourceComponent.prototype.updateInputElement = function (value) {
        this.setInputElementValue(value);
    };
    /**
     * Вызывается при потере фокуса или нажатии клавиши Enter в поле ввода.
     */
    UssDataSourceComponent.prototype.updateValue = function (textValue) {
        if (this.wasInit) {
            this.value = this.validateControlValue(textValue);
        }
    };
    /**
     * Вызывается в методе updateValue.
     * Служит для проверки и исправления значения на основании данных валидации валидаторами.
     * @param value проверяемое значение, которое должно быть установлено.
     * @returns {} исправленное корректное значение.
     */
    UssDataSourceComponent.prototype.validateControlValue = function (value) {
        var res = this.toValue(value);
        if (this.control) {
            this.control.setValue(res);
            if (this.control.invalid) {
                var errors = this.control.errors;
                if (errors.minValue) {
                    res = errors.minValue.validValue;
                }
                else if (errors.maxValue) {
                    res = errors.maxValue.validValue;
                }
                else if (errors.required) {
                    res = this.toValue('');
                }
            }
        }
        return res;
    };
    Object.defineProperty(UssDataSourceComponent.prototype, "markAsInvalid", {
        get: function () {
            return this.control && !this.control.valid
                && !this.control.disabled // не считаем невалидными запрещённые контролы - всё-равно пользователь ничего сделать не может
                && (this.isValuesEqual(this.control.value, this.value) || document.activeElement === this.inputElement);
        },
        enumerable: true,
        configurable: true
    });
    UssDataSourceComponent.prototype.initControl = function () {
        if (this.ussFormGroup) {
            this.control = (this.ussFormGroup.controls[this.fieldName]);
            if (!this.control) {
                messages_service_1.debug(this.constructor.name + ": Form has not got the control with name '" + this.fieldName + "'.");
            }
            else {
                this.control['_ussComponents'] = this.control['_ussComponents'] || [];
                this.control['_ussComponents'].push(this);
            }
        }
        this.control = this.control || new ngForms.FormControl(this.value, CustomValidators_1.CustomValidators.ussDataSourceComponentValidator(this));
        if (this.disabled)
            this.control.disable();
        else
            this.control.enable();
        this.updateInputElement(this.value);
    };
    UssDataSourceComponent.prototype.observeEvent = function (eventName, fn) {
        if (this.inputElement) {
            this._observes.push(rx.Observable.fromEvent(this.inputElement, eventName).subscribe(fn));
        }
    };
    UssDataSourceComponent.prototype.assignInputElement = function (element) {
        var _this = this;
        this.inputElement = element
            || this.inputElement
            || this.viewContainer.element.nativeElement.querySelector('input')
            || this.viewContainer.element.nativeElement.querySelector('textarea')
            || this.viewContainer.element.nativeElement.querySelector('select');
        if (this.inputElement && 'value' in this.inputElement) {
            this.observeEvent('change', function ($event) { return _this.onInputElementChange($event); });
            this.observeEvent('keyup', function ($event) { return _this.onInputElementKeyUp($event); });
            this.observeEvent('keydown', function ($event) { return _this.onInputElementKeyDown($event); });
            this.observeEvent('keypress', function ($event) { return _this.onInputElementKeyPress($event); });
            this.observeEvent('input', function ($event) { return _this.onInputElementInput($event); });
        }
    };
    UssDataSourceComponent.prototype.getInputElementValue = function () {
        return (this.inputElement && 'value' in this.inputElement) ? this.inputElement['value'] : null;
    };
    UssDataSourceComponent.prototype.setInputElementValue = function (value) {
        var text = this.toText(value);
        this.setInputValueDirect(text);
    };
    UssDataSourceComponent.prototype.setInputValueDirect = function (value) {
        this.inputElement
            && ('value' in this.inputElement)
            && (this.inputElement['value'] = value);
    };
    UssDataSourceComponent.prototype.onInputElementChange = function ($event) {
        this.updateValue(this.getInputElementValue());
    };
    UssDataSourceComponent.prototype.onInputElementKeyUp = function ($event) {
    };
    UssDataSourceComponent.prototype.onInputElementInput = function ($event) {
        this.control.markAsDirty();
        this.control.setValue(this.toValue(this.getInputElementValue()));
    };
    UssDataSourceComponent.prototype.onInputElementKeyDown = function ($event) {
        var el = this.inputElement;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            if (!this.isValuesEqual(el.value, this.value)) {
                switch ($event.keyCode) {
                    case 27:
                        this.updateInputElement(this.value);
                    // тут НЕ нужен break !!!!
                    case 13:
                        if (!(el instanceof HTMLTextAreaElement)) {
                            this.updateValue(el.value);
                            setTimeout(function () {
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
    };
    UssDataSourceComponent.prototype.onInputElementKeyPress = function ($event) {
    };
    UssDataSourceComponent.prototype.ngOnInit = function () {
        this.assignInputElement();
        //        this.initForm();
        //        setTimeout(() => this.initForm(), 0);
    };
    UssDataSourceComponent.prototype.ngAfterViewInit = function () {
        this.initForm();
        this.wasInit = true;
        this.value = this.getDataSourceValue();
        this.observeChanges();
    };
    UssDataSourceComponent.prototype.ngOnChanges = function (ch) {
        if (!this.wasInit)
            return;
        if (ch.disabled) {
            this.initControl();
        }
        if ((ch.dataSource || ch._fieldName || ch.metadata)) {
            this.initForm();
        }
    };
    UssDataSourceComponent.prototype.ngOnDestroy = function () {
        this.changeDetector = null;
        this.disposeValueObserver();
        for (var _i = 0, _a = this._observes; _i < _a.length; _i++) {
            var o = _a[_i];
            o.unsubscribe();
        }
        this._observes = [];
    };
    Object.defineProperty(UssDataSourceComponent.prototype, "valueObserver", {
        get: function () { return this._valueObserver; },
        set: function (value) {
            this.disposeValueObserver();
            this._valueObserver = value;
            if (this._valueObserver) {
                this._valueObserverZoneSubscription = this.zone.onStable.subscribe(function () {
                    Platform.performMicrotaskCheckpoint();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    UssDataSourceComponent.prototype.disposeValueObserver = function () {
        if (this._valueObserver) {
            this._valueObserver.close();
            this._valueObserver = undefined;
            this._valueObserverZoneSubscription.unsubscribe();
        }
    };
    UssDataSourceComponent.prototype.observeChanges = function () {
        var _this = this;
        this.disposeValueObserver();
        if (utils_1.isJsObject(this.dataSource) && this.dataFieldName) {
            (this.valueObserver = new ojs.PathObserver(this.dataSource, this.dataFieldName))
                .open(function (newValue) {
                _this.value = newValue;
            });
        }
    };
    UssDataSourceComponent.prototype.isValuesEqual = function (value1, value2) {
        value1 = this.toValue(value1);
        value2 = this.toValue(value2);
        if (value1 === undefined && value2 === undefined || value1 === null && value2 === null)
            return true;
        if (value1 === undefined || value1 === null || value2 === undefined || value2 === null)
            return false;
        if (utils_1.isJsObject(value1) || utils_1.isJsObject(value2))
            return this.toText(value1) === this.toText(value2);
        else
            return value1 === value2;
    };
    /**
     * Преобразование значения компонента в текстовое представление.
     */
    UssDataSourceComponent.prototype.toText = function (v) {
        v = this.toValue(v);
        var res = (v === undefined || v === null) ? '' : v.toString();
        if (this.propertyMetadata && res !== '') {
            if (this.propertyMetadata.TypeName === 'integer' || this.propertyMetadata.TypeName === 'float')
                res = isNaN(v) ? '' : res;
            else if (this.propertyMetadata.EnumerableMetadata)
                res = this.propertyMetadata.EnumerableMetadata.where(function (x) { return x.Value === v; })
                    .select(function (x) { return x.Description || x.Name; })
                    .firstOrDefault() || res;
        }
        return res;
    };
    /**
     * Преобразование переданного значения (в том числе и текстового представления) в значение компонента корректного типа.
     */
    UssDataSourceComponent.prototype.toValue = function (v) {
        var res = v;
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
    };
    /**
     * Инициирует отсылку сообщений об изменении значения в компоненте.
     * @param value значение, которое будет послано для уведомления. Если не указано - используется текущее значение.
     */
    UssDataSourceComponent.prototype.emitChanges = function (value) {
        if (value === undefined)
            value = this.value;
        this.modelChange.emit(value);
    };
    /**
     * Имплементация валидатора контрола компонента.
     * Будет автоматически вызвана, если контрол содержит CustomValidators.ussDataSourceComponentValidator или CustomValidators.ussFormValidator.
     * Необходимо вернуть null в случае, если валидация прошла успешно или объект с ошибкой валидации.
     * Пустой объект в качестве успеха валидации возвращать нельзя - форма считает себя невалидной.
     * @param control ссылка на FormControl, для которого проводится валидация.
     */
    UssDataSourceComponent.prototype.onValidate = function (control) {
        var res = null;
        if (control) {
            res = Json_1.Json.assign(null, CustomValidators_1.CustomValidators.ussPropertyMetadataValidator(this.propertyMetadata)(control));
            if (this.isRequired()) {
                res = Json_1.Json.assign(res, ngForms.Validators.required(control));
            }
            else if (res) {
                delete res.required;
            }
        }
        return res;
    };
    return UssDataSourceComponent;
}());
UssDataSourceComponent.Inputs = ['value: model', 'required', 'control', 'placeholder', 'metadata', 'disabled', 'ussDataSource', '_fieldName: fieldName', 'class', 'label', 'defaultValue'];
UssDataSourceComponent.Outputs = ['modelChange'];
__decorate([
    ng.Input('label'),
    __metadata("design:type", String)
], UssDataSourceComponent.prototype, "label", void 0);
__decorate([
    ng.Input('class'),
    __metadata("design:type", String)
], UssDataSourceComponent.prototype, "class", void 0);
__decorate([
    ng.Input('ussDataSource'),
    __metadata("design:type", Object)
], UssDataSourceComponent.prototype, "ussDataSource", void 0);
__decorate([
    ng.Input('fieldName'),
    __metadata("design:type", String)
], UssDataSourceComponent.prototype, "_fieldName", void 0);
__decorate([
    ng.Input('defaultValue'),
    __metadata("design:type", Object)
], UssDataSourceComponent.prototype, "defaultValue", void 0);
__decorate([
    ng.Input('metadata'),
    __metadata("design:type", Object)
], UssDataSourceComponent.prototype, "metadata", void 0);
__decorate([
    ng.Input('control'),
    __metadata("design:type", ngForms.FormControl)
], UssDataSourceComponent.prototype, "control", void 0);
__decorate([
    ng.Input('required'),
    __metadata("design:type", Object)
], UssDataSourceComponent.prototype, "required", void 0);
__decorate([
    ng.Input('disabled'),
    __metadata("design:type", Boolean)
], UssDataSourceComponent.prototype, "disabled", void 0);
__decorate([
    ng.Input("placeholder"),
    __metadata("design:type", String)
], UssDataSourceComponent.prototype, "placeholder", void 0);
__decorate([
    inject_decorator_1.Inject(ng.NgZone),
    __metadata("design:type", ng.NgZone)
], UssDataSourceComponent.prototype, "zone", void 0);
__decorate([
    ng.Input('model'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], UssDataSourceComponent.prototype, "value", null);
__decorate([
    ng.Output('modelChange'),
    __metadata("design:type", Object)
], UssDataSourceComponent.prototype, "modelChange", void 0);
exports.UssDataSourceComponent = UssDataSourceComponent;
//# sourceMappingURL=UssDataSourceComponent.js.map