"use strict";
var forms_1 = require("@angular/forms");
var utils = require("src/system/utils");
var Json_1 = require("../../utils/Json");
var CustomValidators = (function () {
    function CustomValidators() {
    }
    CustomValidators.valueIsEmpty = function (value) {
        return (!value && value !== 0) || !value.toString().trim();
    };
    CustomValidators.ussDataSourceComponentValidator = function (component) {
        return function (control) {
            var result = null;
            if (component && typeof component.onValidate === "function") {
                result = component.onValidate(control);
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        };
    };
    CustomValidators.ussPropertyMetadataValidator = function (propertyMetadata) {
        return function (control) {
            var result = null;
            if (propertyMetadata) {
                if (propertyMetadata.Required) {
                    result = forms_1.Validators.required(control);
                }
                if (propertyMetadata.TypeName === 'string' && propertyMetadata.MaxLength) {
                    result = Json_1.Json.assign(result, forms_1.Validators.maxLength(propertyMetadata.MaxLength)(control));
                }
                if (propertyMetadata.TypeName === 'integer' || propertyMetadata.TypeName === 'float') {
                    if (propertyMetadata.MinValue) {
                        result = Json_1.Json.assign(result, CustomValidators.minValueValidator(propertyMetadata.MinValue)(control));
                    }
                    if (propertyMetadata.MaxValue) {
                        result = Json_1.Json.assign(result, CustomValidators.maxValueValidator(propertyMetadata.MaxValue)(control));
                    }
                }
                if (propertyMetadata.EnumerableMetadata) {
                    result = Json_1.Json.assign(result, CustomValidators.minValueValidator(propertyMetadata.EnumerableMetadata.min(function (x) { return x.Value; }))(control));
                    result = Json_1.Json.assign(result, CustomValidators.maxValueValidator(propertyMetadata.EnumerableMetadata.max(function (x) { return x.Value; }))(control));
                }
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        };
    };
    CustomValidators.ussFormValidator = function (propertyMetadata) {
        return function (control) {
            var result = CustomValidators.ussPropertyMetadataValidator(propertyMetadata)(control);
            // директива ussDataSource добавляет все компоненты, привязанные к этому FormControl'у в этот массив...
            if (utils.isArray(control['_ussComponents'])) {
                for (var _i = 0, _a = control['_ussComponents']; _i < _a.length; _i++) {
                    var component = _a[_i];
                    result = Json_1.Json.assign(result, CustomValidators.ussDataSourceComponentValidator(component)(control));
                }
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        };
    };
    CustomValidators.intNumberValidator = function (c) {
        if (CustomValidators.valueIsEmpty(c.value))
            return null;
        var isValid = utils.isIntNumber(c.value);
        var result;
        if (isValid) {
            result = null;
        }
        else {
            result = {
                intNumber: {
                    valid: false
                }
            };
        }
        return result;
    };
    CustomValidators.floatNumberValidator = function (c) {
        if (CustomValidators.valueIsEmpty(c.value))
            return null;
        var isValid = utils.isFloatNumber(c.value);
        var result;
        if (isValid) {
            result = null;
        }
        else {
            result = {
                floatNumber: {
                    valid: false
                }
            };
        }
        return result;
    };
    CustomValidators.minValueValidator = function (min) {
        return function (c) {
            if (min === undefined || CustomValidators.valueIsEmpty(c.value))
                return null;
            var result = null;
            if (isNaN(c.value) || Number(c.value) < min) {
                result = {
                    minValue: {
                        valid: false,
                        validValue: min
                    }
                };
            }
            return result;
        };
    };
    CustomValidators.maxValueValidator = function (max) {
        return function (c) {
            if (max === undefined || CustomValidators.valueIsEmpty(c.value))
                return null;
            var result = null;
            if (isNaN(c.value) || Number(c.value) > max) {
                result = {
                    maxValue: {
                        valid: false,
                        validValue: max
                    }
                };
            }
            return result;
        };
    };
    return CustomValidators;
}());
exports.CustomValidators = CustomValidators;
//# sourceMappingURL=CustomValidators.js.map