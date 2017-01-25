"use strict";
var core_1 = require("@angular/core");
var Disabled = 'disabled';
var OutsideClick = 'outsideClick';
exports.KeyCode = {
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Escape: 27,
    Enter: 13,
    Space: 32,
    Backspace: 8
};
var SuiDropdownService = (function () {
    function SuiDropdownService() {
        // State Events
        this.onToggle = new core_1.EventEmitter(false);
        this.isOpenChange = new core_1.EventEmitter(false);
        // Document Event Bindings
        this.closeDropdownBind = this.closeDropdown.bind(this);
        this.keybindFilterBind = this.keybindFilter.bind(this);
        // Keyboard Navigation
        this._selectedItem = null;
        // Classes
        this.itemClass = "item";
        this.itemSelectedClass = "selected";
        this.itemDisabledClass = "disabled";
    }
    Object.defineProperty(SuiDropdownService.prototype, "isOpen", {
        get: function () {
            return this._isOpen;
        },
        set: function (value) {
            var _this = this;
            if (value == this._isOpen) {
                return;
            }
            if (this.isDisabled) {
                value = false;
            }
            this._isOpen = value;
            if (this.transition) {
                this.isVisible = true;
                this.transition.stopAll();
                this.transition.animate({
                    name: "slide down",
                    duration: 200,
                    callback: function () { return _this.isVisible = _this.isOpen; }
                });
            }
            if (this.isOpen) {
                this.bindDocumentEvents();
                this.selectedItem = null;
            }
            else {
                this.unbindDocumentEvents();
            }
            setTimeout(function () {
                _this.onToggle.emit(_this._isOpen);
                _this.isOpenChange.emit(_this._isOpen);
            });
        },
        enumerable: true,
        configurable: true
    });
    SuiDropdownService.prototype.toggle = function () {
        this.isOpen = !this.isOpen;
    };
    SuiDropdownService.prototype.bindDocumentEvents = function () {
        window.document.addEventListener('click', this.closeDropdownBind, true);
        if (!this.dropdownElement.nativeElement.parentElement.hasAttribute("suiDropdownMenu")) {
            window.document.addEventListener('keydown', this.keybindFilterBind);
        }
    };
    SuiDropdownService.prototype.unbindDocumentEvents = function () {
        window.document.removeEventListener('click', this.closeDropdownBind, true);
        window.document.removeEventListener('keydown', this.keybindFilterBind);
    };
    SuiDropdownService.prototype.closeDropdown = function (event) {
        //Never close the dropdown if autoClose is disabled
        if (event && this.autoClose === Disabled) {
            return;
        }
        //Don't close the dropdown when clicking the toggle
        if (event && this.dropdownElement.nativeElement.contains(event.target) &&
            !this.menuElement.nativeElement.contains(event.target)) {
            return;
        }
        //Don't close the dropdown if expanding a nested dropdown
        if (event && this.menuElement.nativeElement.contains(event.target) &&
            event.target.hasAttribute("suiDropdown")) {
            return;
        }
        //Don't close the dropdown if clicking on any input element
        if (event && this.menuElement &&
            /input|textarea/i.test(event.target.tagName) &&
            this.menuElement.nativeElement.contains(event.target)) {
            return;
        }
        //Don't close the dropdown when clicking inside if autoClose is outsideClick
        if (event && this.autoClose === OutsideClick &&
            this.menuElement &&
            this.menuElement.nativeElement.contains(event.target)) {
            return;
        }
        //Close the dropdown
        this.isOpen = false;
    };
    SuiDropdownService.prototype.keybindFilter = function (event) {
        if (event.which === exports.KeyCode.Escape) {
            this.isOpen = false;
            return;
        }
        //noinspection TypeScriptUnresolvedFunction
        if (this.isOpen &&
            ([exports.KeyCode.Enter, exports.KeyCode.Up, exports.KeyCode.Right, exports.KeyCode.Down, exports.KeyCode.Left]
                .find(function (keyCode) { return event.which == keyCode; }))) {
            event.preventDefault();
            event.stopPropagation();
            this.keyPress(event.which);
        }
    };
    Object.defineProperty(SuiDropdownService.prototype, "selectedItem", {
        get: function () {
            return this._selectedItem;
        },
        set: function (item) {
            if (this._selectedItem) {
                this._selectedItem.classList.remove(this.itemSelectedClass);
            }
            this._selectedItem = item;
            if (item) {
                item.classList.add(this.itemSelectedClass);
            }
        },
        enumerable: true,
        configurable: true
    });
    SuiDropdownService.prototype.keyPress = function (keyCode) {
        //noinspection FallThroughInSwitchStatementJS
        switch (keyCode) {
            case exports.KeyCode.Down:
                this.selectNextItem();
                break;
            case exports.KeyCode.Up:
                this.selectPreviousItem();
                break;
            case exports.KeyCode.Enter:
                if (this.selectedItem && !this.selectedItem.hasAttribute("suiDropdown")) {
                    this.selectedItem.click();
                    this.selectedItem = null;
                    break;
                }
            //Fall through on purpose! (So enter on a nested dropdown acts as right arrow)
            case exports.KeyCode.Right:
                if (this.selectedItem && this.selectedItem.hasAttribute("suiDropdown")) {
                    this.selectedItem.click();
                    this.selectedItem = this.selectedItem.querySelector("." + this.itemClass + ":not(." + this.itemDisabledClass + ")");
                }
                break;
            case exports.KeyCode.Left:
                if (this.selectedItem.parentElement != this.menuElement.nativeElement) {
                    this.selectedItem.parentElement.parentElement.click();
                    this.selectedItem = this.selectedItem.parentElement.parentElement;
                }
                break;
        }
    };
    SuiDropdownService.prototype.selectNextItem = function () {
        if (!this.selectedItem) {
            this.selectedItem = this.menuElement.nativeElement.querySelector("." + this.itemClass + ":not(." + this.itemDisabledClass + ")");
            return;
        }
        var nextItem = this.selectedItem.nextElementSibling;
        if (nextItem) {
            this.selectedItem = nextItem;
            if (this.selectedItem.classList.contains(this.itemDisabledClass)) {
                this.selectNextItem();
            }
        }
    };
    SuiDropdownService.prototype.selectPreviousItem = function () {
        if (this.selectedItem) {
            var previousItem = this.selectedItem.previousElementSibling;
            if (previousItem) {
                this.selectedItem = previousItem;
                if (this.selectedItem.classList.contains(this.itemDisabledClass)) {
                    this.selectPreviousItem();
                }
            }
            return;
        }
        this.selectNextItem();
    };
    return SuiDropdownService;
}());
exports.SuiDropdownService = SuiDropdownService;
//# sourceMappingURL=dropdown.service.js.map