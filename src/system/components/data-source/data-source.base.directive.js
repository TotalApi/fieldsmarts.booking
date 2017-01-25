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
var ojs = require("observe-js");
var ng = require("@angular/core");
var ngForms = require("@angular/forms");
var directive_base_1 = require("../../directives/directive.base");
var utils_1 = require("../../utils/utils");
var Enumerable = require('linq');
var UssSimpleValueComponent = (function () {
    function UssSimpleValueComponent() {
    }
    /**
     * Создание простой имплементации интерфейса IUssValueComponent
     * @param getValueFn метод получения значения
     * @param setValueFn метод установки значения
     * @param toTextFn метод преобразования значения в текст
     * @param toValueFn метод преобразования текста в значение
     */
    UssSimpleValueComponent.create = function (getValueFn, setValueFn, toTextFn, toValueFn) {
        var res = new UssSimpleValueComponent();
        res.getValueFn = getValueFn;
        res.setValueFn = setValueFn;
        res.toTextFn = toTextFn;
        res.toValueFn = toValueFn;
        return res;
    };
    Object.defineProperty(UssSimpleValueComponent.prototype, "propertyMetadata", {
        get: function () {
            if (typeof this.metadata === "function")
                return this.metadata();
            else
                return this.metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UssSimpleValueComponent.prototype, "value", {
        get: function () { return this.getValueFn(); },
        set: function (v) { this.setValueFn(v); },
        enumerable: true,
        configurable: true
    });
    /**
     * Преобразование значения компонента в текстовое представление.
     */
    UssSimpleValueComponent.prototype.toText = function (v) {
        return this.toTextFn
            ? this.toTextFn(v)
            : (v === undefined || v === null || isNaN(v)) ? '' : v.toString();
    };
    /**
     * Преобразование переданного значения (в том числе и текстового представления) в значение компонента корректного типа.
     */
    UssSimpleValueComponent.prototype.toValue = function (v) {
        var res = v;
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
    };
    UssSimpleValueComponent.prototype.isValuesEqual = function (value1, value2) {
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
    return UssSimpleValueComponent;
}());
exports.UssSimpleValueComponent = UssSimpleValueComponent;
var UssDataSourceBaseDirective = (function (_super) {
    __extends(UssDataSourceBaseDirective, _super);
    function UssDataSourceBaseDirective(hostElementRef, viewContainer, hostComponent) {
        var _this = _super.call(this, hostComponent, hostElementRef, viewContainer) || this;
        /**
         * Если равно true - содержимое инпута будет автоматически выделено после попадания в него фокуса ввода
         */
        _this.autoSelectOnFocus = false;
        _this.valueChange = new ng.EventEmitter();
        return _this;
    }
    Object.defineProperty(UssDataSourceBaseDirective.prototype, "propertyMetadata", {
        get: function () {
            var _this = this;
            var res = null;
            if (this.metadata) {
                if (this.metadata.Properties) {
                    res = Enumerable.from(this.metadata.Properties).firstOrDefault(function (x) { return x.Name === _this.fieldName; });
                }
                else {
                    res = this.metadata;
                }
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UssDataSourceBaseDirective.prototype, "value", {
        /**
         * Текущее значение компонента.
         */
        get: function () { return (this.dataSource && this.fieldName) ? this.dataSource[this.fieldName] : this._value; },
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
                this.updateValue(value);
                this.updateElementValue(this.value);
                this.valueChange.emit(this.value);
            }
        },
        enumerable: true,
        configurable: true
    });
    UssDataSourceBaseDirective.prototype.onChanged = function ($event) {
        this.updateComponentValue($event instanceof Event ? undefined : $event);
        this.inOnChanged = true;
    };
    UssDataSourceBaseDirective.prototype.onKeyDown = function ($event) {
        this.inOnChanged = false;
    };
    UssDataSourceBaseDirective.prototype.onKeyUp = function ($event) {
        this.updateFormValue();
    };
    UssDataSourceBaseDirective.prototype.onFocused = function ($event) {
        if (this.autoSelectOnFocus)
            $event.srcElement.select();
    };
    UssDataSourceBaseDirective.prototype.ngOnChanges = function (changes) {
        if (changes.dataSource || changes.fieldName || changes.metadata) {
            this.updateValue();
            this.observeChanges();
        }
    };
    UssDataSourceBaseDirective.prototype.observeChanges = function () {
        var _this = this;
        this.disposeValueObserver();
        if (typeof this.dataSource === "object" && this.fieldName) {
            (this.valueObserver = new ojs.PathObserver(this.dataSource, this.fieldName))
                .open(function (newValue) {
                _this.value = newValue;
            });
        }
    };
    /**
     * Обновление значения компонента в источнике данных.
     */
    UssDataSourceBaseDirective.prototype.updateValue = function (value) {
        this.fieldName = this.fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : undefined);
        if (this.dataSource && this.fieldName && this.wasInit) {
            this.dataSource[this.fieldName] = value === undefined ? this.value : value;
        }
    };
    UssDataSourceBaseDirective.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.hostElementRef.nativeElement['_ussDataSource'] = this;
        // если хост-компонент имплементирует UssValueComponent - будем использовать этот интерфейс 
        // для получения/установки значения компонента, если нет - создадим имплементацию по умолчанию,
        // для простоты работы директивы:
        var hostComponent = this.hostComponent || {};
        this.ussHostComponent = this.createUssHostComponent(hostComponent);
        this.initControl();
    };
    UssDataSourceBaseDirective.prototype.createUssHostComponent = function (hostComponent) {
        var _this = this;
        var res = UssSimpleValueComponent.create(function () { return _this.getComponentValue(); }, function (v) { return _this.setElementValue(v); }, hostComponent.toText, hostComponent.toValue);
        res.metadata = this.propertyMetadata;
        return res;
    };
    /**
     * Получение текущего значения компонента на основании значения в HTML-элементе
     */
    UssDataSourceBaseDirective.prototype.getComponentValue = function () {
        return this.nativeElement ? this.nativeElement.value : null;
    };
    /**
     * Установка значения в HTML-элементе, соответствующая текущему значению компонента.
     */
    UssDataSourceBaseDirective.prototype.setElementValue = function (value) {
        if (this.nativeElement) {
            value = value === undefined ? '' : value;
            if (this.nativeElement.value !== value) {
                this.nativeElement.value = value;
            }
        }
    };
    UssDataSourceBaseDirective.prototype.initControl = function () {
        var _this = this;
        this.fieldName = this.fieldName || (this.propertyMetadata ? this.propertyMetadata.Name : undefined);
        var formDirective = Enumerable.from(this.hostViewContainer.injector['_view'])
            .select(function (kv) { return kv.value; })
            .firstOrDefault(function (x) { return x instanceof ngForms.FormGroupDirective; });
        if (formDirective) {
            this.form = formDirective.form;
        }
        else {
            this.form = Enumerable.from(this.hostViewContainer.injector['_view'])
                .select(function (kv) { return kv.value; })
                .where(function (x) { return x instanceof ngForms.NgForm; })
                .select(function (f) { return f.form; })
                .firstOrDefault();
        }
        if (this.form) {
            this.dataSource = this.dataSource || this.form.datasource;
            this.metadata = this.metadata || this.form.metadata;
            if (this.dataSource && this.ussHostComponent) {
                var fieldName_1 = this.fieldName;
                if (!fieldName_1 && this.propertyMetadata) {
                    fieldName_1 = this.propertyMetadata.Name;
                }
                var control = this.form.controls[fieldName_1];
                if (control) {
                    control['_ussComponents'] = control['_ussComponents'] || [];
                    control['_ussComponents'].push(this.ussHostComponent);
                    this.ussHostComponent.control = control;
                }
                this.ussHostComponent.metadata = this.propertyMetadata;
                setTimeout(function () {
                    _this.ussHostComponent.value = _this.dataSource[fieldName_1];
                });
            }
        }
        // Установить значение в контроле равным значению в источнике данных
        setTimeout(function () {
            _this.updateElementValue(_this.value);
        });
        this.observeChanges();
    };
    /**
     * Установка значения в FormControl-е, соответствующая текущему значению компонента.
     */
    UssDataSourceBaseDirective.prototype.updateFormValue = function (value) {
        if (this.form) {
            var control = this.form.controls[this.fieldName];
            if (control && this.nativeElement) {
                if (value === undefined)
                    value = this.nativeElement.value;
                value = this.ussHostComponent.toValue(value);
                // Нужно вызывать setValue для FormControl'а только если оно изменилось,
                // чтобы не вызывались ненужные события, информирующие об изменении состояния
                var v1 = this.form.controls[this.fieldName].value;
                var v2 = value;
                if (utils_1.isJsObject(value)) {
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
    };
    /**
     * Обновляет значение компонента на основании данных контрола
     * @param value
     */
    UssDataSourceBaseDirective.prototype.updateComponentValue = function (value) {
        this.value = value === undefined ? this.ussHostComponent.value : value;
        this.updateFormValue(this.value);
    };
    /**
     * Обновляет значение в контроле соответствующего текущему значению компонента
     * @param value
     */
    UssDataSourceBaseDirective.prototype.updateElementValue = function (value) {
        if (!this.ussHostComponent.isValuesEqual(this.ussHostComponent.value, value)) {
            this.ussHostComponent.value = value;
            this.updateFormValue(this.ussHostComponent.value);
        }
    };
    return UssDataSourceBaseDirective;
}(directive_base_1.UssDirectiveBase));
UssDataSourceBaseDirective.Inputs = ['dataSource: ussDataSource', 'fieldName', 'autoSelectOnFocus: autoSelect', 'metadata'];
UssDataSourceBaseDirective.Outputs = ['valueChange'];
UssDataSourceBaseDirective.Host = {
    '(change)': 'onChanged($event)',
    '(modelChange)': 'onChanged($event)',
    '(keydown)': 'onKeyDown($event)',
    '(keyup)': 'onKeyUp($event)',
    '(focusin)': 'onFocused($event)'
};
__decorate([
    ng.Input('ussDataSource'),
    __metadata("design:type", Object)
], UssDataSourceBaseDirective.prototype, "dataSource", void 0);
__decorate([
    ng.Input('fieldName'),
    __metadata("design:type", String)
], UssDataSourceBaseDirective.prototype, "fieldName", void 0);
__decorate([
    ng.Input('autoSelect'),
    __metadata("design:type", Boolean)
], UssDataSourceBaseDirective.prototype, "autoSelectOnFocus", void 0);
__decorate([
    ng.Input('metadata'),
    __metadata("design:type", Object)
], UssDataSourceBaseDirective.prototype, "metadata", void 0);
__decorate([
    ng.Output('valueChange'),
    __metadata("design:type", Object)
], UssDataSourceBaseDirective.prototype, "valueChange", void 0);
__decorate([
    ng.HostListener('change', ['$event']),
    ng.HostListener('modelChange', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UssDataSourceBaseDirective.prototype, "onChanged", null);
__decorate([
    ng.HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], UssDataSourceBaseDirective.prototype, "onKeyDown", null);
__decorate([
    ng.HostListener('keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], UssDataSourceBaseDirective.prototype, "onKeyUp", null);
__decorate([
    ng.HostListener('focusin', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], UssDataSourceBaseDirective.prototype, "onFocused", null);
exports.UssDataSourceBaseDirective = UssDataSourceBaseDirective;
//# sourceMappingURL=data-source.base.directive.js.map