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
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/core");
var dropdown_menu_1 = require("../dropdown/dropdown-menu");
var dropdown_service_1 = require("../dropdown/dropdown.service");
var select_option_1 = require("./select-option");
var search_service_1 = require("../search.service");
var system_component_decorator_1 = require("../../../decorators/system-component.decorator");
var SuiSelect = (function () {
    function SuiSelect(el) {
        var _this = this;
        this.el = el;
        this._dropdownService = new dropdown_service_1.SuiDropdownService();
        this._searchService = new search_service_1.SuiSearchService();
        this.renderedOptionsSubscriptions = [];
        this.searchClasses = true;
        this.tabIndex = 0;
        this.isSearchable = false;
        this.placeholder = "Select one";
        this.selectedOptionChange = new core_1.EventEmitter();
        this.onItemSelected = new core_1.EventEmitter();
        this._dropdownService.dropdownElement = el;
        this._dropdownService.autoClose = "outsideClick";
        this._dropdownService.itemClass = "item";
        this._dropdownService.itemSelectedClass = "selected";
        this._searchService.allowEmptyQuery = true;
        this._searchService.searchDelay = 0;
        this._dropdownService.isOpenChange
            .subscribe(function (isOpen) {
            if (isOpen) {
                if (_this.isSearchable && !_this._dropdownService.selectedItem) {
                    _this._dropdownService.selectNextItem();
                }
            }
        });
    }
    Object.defineProperty(SuiSelect.prototype, "options", {
        get: function () {
            return this._searchService.options;
        },
        set: function (value) {
            var _this = this;
            this._searchService.options = value;
            if (this.options.length > 0 && !this.options.find(function (o) { return o == _this.selectedOption; })) {
                this.selectedOption = this.options.find(function (o) { return _this.selectedOption == _this._searchService.deepValue(o, _this.keyField); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "displayField", {
        get: function () {
            return this._searchService.optionsField;
        },
        set: function (value) {
            this._searchService.optionsField = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "query", {
        get: function () {
            return this._searchService.query;
        },
        set: function (value) {
            this._searchService.updateQuery(value);
            this.isOpen = true;
            this.focusFirstItem();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "isActive", {
        get: function () {
            return this._dropdownService.isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "isOpen", {
        get: function () {
            return this._dropdownService.isOpen;
        },
        set: function (value) {
            this._dropdownService.isOpen = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "isDisabled", {
        get: function () {
            return this._dropdownService.isDisabled;
        },
        set: function (value) {
            this._dropdownService.isDisabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "results", {
        get: function () {
            return this._searchService.results;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSelect.prototype, "availableOptions", {
        get: function () {
            return this.results;
        },
        enumerable: true,
        configurable: true
    });
    SuiSelect.prototype.ngAfterContentInit = function () {
        var _this = this;
        //Initialise initial results
        this.renderedOptionsSubscribe();
        this.renderedOptions.changes.subscribe(function () { return _this.renderedOptionsSubscribe(); });
    };
    SuiSelect.prototype.ngAfterViewInit = function () {
        this._dropdownMenu.service = this._dropdownService;
    };
    SuiSelect.prototype.renderedOptionsSubscribe = function () {
        var _this = this;
        this.renderedOptionsSubscriptions.forEach(function (s) { return s.unsubscribe(); });
        this.renderedOptionsSubscriptions = [];
        this.renderedOptions.forEach(function (option) {
            _this.renderedOptionsSubscriptions.push(option.selected.subscribe(function (value) {
                _this.selectOption(value);
            }));
            setTimeout(function () {
                option.useTemplate = !!_this.optionTemplate;
                option.readValue = function (v) { return _this._searchService.readValue(v); };
                if (option.useTemplate) {
                    option.viewContainerRef.clear();
                    option.viewContainerRef.createEmbeddedView(_this.optionTemplate, { option: option.value });
                }
            });
        });
    };
    SuiSelect.prototype.renderSelectedItem = function () {
        if (this.selectedOption && this.optionTemplate) {
            this.selectedOptionContainer.clear();
            this.selectedOptionContainer.createEmbeddedView(this.optionTemplate, { option: this.selectedOption });
        }
    };
    SuiSelect.prototype.selectOption = function (option) {
        this.selectedOption = option;
        var keyed = this._searchService.deepValue(option, this.keyField);
        this.selectedOptionChange.emit(keyed);
        this.onItemSelected.emit(keyed);
        this._searchService.updateQuery(this._searchService.readValue(option), false);
        this._dropdownService.isOpen = false;
        this.renderSelectedItem();
        this._searchService.updateQuery("", false);
    };
    SuiSelect.prototype.focusSearch = function () {
        if (this.isSearchable) {
            this._dropdownService.dropdownElement.nativeElement.querySelector("input").focus();
        }
    };
    SuiSelect.prototype.focusFirstItem = function () {
        var _this = this;
        setTimeout(function () {
            _this._dropdownService.selectedItem = null;
            _this._dropdownService.selectNextItem();
        });
    };
    SuiSelect.prototype.writeValue = function (value) {
        var _this = this;
        if (value !== null && value !== undefined) {
            this.selectedOption = value;
            if (this.options.length > 0) {
                this.selectedOption = this.options.find(function (o) { return value == _this._searchService.deepValue(o, _this.keyField); });
            }
        }
        this.renderSelectedItem();
    };
    SuiSelect.prototype.click = function (event) {
        event.stopPropagation();
        if (!this._dropdownService.menuElement.nativeElement.contains(event.target)) {
            if (!this.isOpen) {
                this.isOpen = true;
                this._searchService.search();
                this.focusSearch();
            }
            else if (event.target.tagName != "INPUT") {
                this.isOpen = false;
            }
        }
        return false;
    };
    SuiSelect.prototype.keypress = function (event) {
        if ((event.which == dropdown_service_1.KeyCode.Enter || event.which == dropdown_service_1.KeyCode.Space) && !this.isOpen) {
            this.click(event);
            event.preventDefault();
        }
    };
    return SuiSelect;
}());
__decorate([
    core_1.ViewChild(dropdown_menu_1.SuiDropdownMenu),
    __metadata("design:type", dropdown_menu_1.SuiDropdownMenu)
], SuiSelect.prototype, "_dropdownMenu", void 0);
__decorate([
    core_1.ViewChild('selectedOptionRenderTarget', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], SuiSelect.prototype, "selectedOptionContainer", void 0);
__decorate([
    core_1.ContentChildren(select_option_1.SuiSelectOption),
    __metadata("design:type", core_1.QueryList)
], SuiSelect.prototype, "renderedOptions", void 0);
__decorate([
    core_1.HostBinding('class.ui'),
    core_1.HostBinding('class.selection'),
    core_1.HostBinding('class.dropdown'),
    __metadata("design:type", Object)
], SuiSelect.prototype, "searchClasses", void 0);
__decorate([
    core_1.HostBinding('attr.tabindex'),
    __metadata("design:type", Object)
], SuiSelect.prototype, "tabIndex", void 0);
__decorate([
    core_1.HostBinding('class.search'),
    core_2.Input(),
    __metadata("design:type", Boolean)
], SuiSelect.prototype, "isSearchable", void 0);
__decorate([
    core_2.Input(),
    __metadata("design:type", String)
], SuiSelect.prototype, "placeholder", void 0);
__decorate([
    core_2.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], SuiSelect.prototype, "options", null);
__decorate([
    core_2.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SuiSelect.prototype, "displayField", null);
__decorate([
    core_2.Input(),
    __metadata("design:type", String)
], SuiSelect.prototype, "keyField", void 0);
__decorate([
    core_2.Output(),
    __metadata("design:type", core_1.EventEmitter)
], SuiSelect.prototype, "selectedOptionChange", void 0);
__decorate([
    core_2.Output(),
    __metadata("design:type", core_1.EventEmitter)
], SuiSelect.prototype, "onItemSelected", void 0);
__decorate([
    core_2.Input(),
    __metadata("design:type", core_1.TemplateRef)
], SuiSelect.prototype, "optionTemplate", void 0);
__decorate([
    core_1.HostBinding('class.visible'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SuiSelect.prototype, "isActive", null);
__decorate([
    core_1.HostBinding('class.active'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], SuiSelect.prototype, "isOpen", null);
__decorate([
    core_1.HostBinding('class.disabled'),
    core_2.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], SuiSelect.prototype, "isDisabled", null);
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", Boolean)
], SuiSelect.prototype, "click", null);
__decorate([
    core_1.HostListener('keypress', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], SuiSelect.prototype, "keypress", null);
SuiSelect = __decorate([
    core_1.Component({
        selector: 'sui-select',
        exportAs: 'suiSelect',
        template: "\n<i class=\"dropdown icon\"></i>\n<input *ngIf=\"isSearchable\" class=\"search\" type=\"text\" autocomplete=\"off\" [(ngModel)]=\"query\">\n<!-- Single-select label -->\n<div *ngIf=\"!selectedOption\" class=\"default text\" [class.filtered]=\"query\">{{ placeholder }}</div>\n<div [hidden]=\"!selectedOption\" class=\"text\" [class.filtered]=\"query\">\n    <span #selectedOptionRenderTarget></span>\n    <span *ngIf=\"!optionTemplate\">{{ _searchService.readValue(selectedOption) }}</span>\n</div>\n<!-- Select dropdown menu -->\n<div class=\"menu\" suiDropdownMenu>\n    <ng-content></ng-content>\n    <div *ngIf=\"isSearchable && !results.length\" class=\"message\">No Results</div>\n</div>\n",
        styles: ["\n:host input.search {\n    width: 12em !important;\n}\n.selected-results {\n    display: none;\n}\n"]
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [core_1.ElementRef])
], SuiSelect);
exports.SuiSelect = SuiSelect;
exports.CUSTOM_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return SuiSelectValueAccessor; }),
    multi: true
};
var SuiSelectValueAccessor = (function () {
    function SuiSelectValueAccessor(host) {
        this.host = host;
        this.onChange = function () { };
        this.onTouched = function () { };
    }
    SuiSelectValueAccessor.prototype.writeValue = function (value) {
        this.host.writeValue(value);
    };
    SuiSelectValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    SuiSelectValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    return SuiSelectValueAccessor;
}());
SuiSelectValueAccessor = __decorate([
    core_1.Directive({
        selector: 'sui-select',
        host: { '(selectedOptionChange)': 'onChange($event)' },
        providers: [exports.CUSTOM_VALUE_ACCESSOR]
    }),
    system_component_decorator_1.SystemComponent(true),
    __metadata("design:paramtypes", [SuiSelect])
], SuiSelectValueAccessor);
exports.SuiSelectValueAccessor = SuiSelectValueAccessor;
//# sourceMappingURL=select.js.map