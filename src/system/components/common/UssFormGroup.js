"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var forms_1 = require("@angular/forms");
var CustomValidators_1 = require("./CustomValidators");
var UssFormGroup = (function (_super) {
    __extends(UssFormGroup, _super);
    function UssFormGroup(metadata, datasource) {
        var _this;
        if (metadata) {
            _this = _super.call(this, UssFormGroup.createFormControls(metadata)) || this;
            _this.metadata = metadata;
            if (datasource)
                _this.setDatasource(datasource);
        }
        return _this;
    }
    UssFormGroup.createFormControls = function (metadata) {
        var formControls = {};
        if (metadata) {
            for (var _i = 0, _a = metadata.Properties; _i < _a.length; _i++) {
                var prop = _a[_i];
                formControls[prop.Name] = new forms_1.FormControl(undefined, CustomValidators_1.CustomValidators.ussFormValidator(prop));
            }
        }
        return formControls;
    };
    UssFormGroup.create = function (metadata, datasource) {
        return new UssFormGroup(metadata, datasource);
    };
    UssFormGroup.prototype.getPropertyMetadata = function (name) {
        return this.metadata ? this.metadata.Properties.firstOrDefault(function (x) { return x.Name === name; }) : null;
    };
    UssFormGroup.prototype.setDatasource = function (datasource) {
        this.datasource = datasource;
        for (var prop in this.datasource) {
            if (this.datasource.hasOwnProperty(prop)) {
                var ctrl = this.controls[prop];
                if (ctrl) {
                    ctrl.setValue(this.datasource[prop]);
                }
            }
        }
        return this;
    };
    return UssFormGroup;
}(forms_1.FormGroup));
exports.UssFormGroup = UssFormGroup;
//# sourceMappingURL=UssFormGroup.js.map