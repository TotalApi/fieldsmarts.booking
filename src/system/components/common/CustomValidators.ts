import { FormGroup, FormControl, Validators, Validator, FormBuilder, AbstractControl } from '@angular/forms';
import * as utils from 'src/system/utils';
import { IUssValidateComponent, PropertyMetadata } from './UssDataSourceComponent';
import {Json} from '../../utils/Json';

export class CustomValidators {

    public static valueIsEmpty(value) {
        return (!value && value !== 0) || !value.toString().trim();
    }

    public static ussDataSourceComponentValidator(component: IUssValidateComponent) {
        return (control: AbstractControl) => {
            let result = null;
            if (component && typeof component.onValidate === "function") {
                result = component.onValidate(control);
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        }
    }

    public static ussPropertyMetadataValidator(propertyMetadata: PropertyMetadata) {
        return (control: AbstractControl) => {
            let result = null;
            if (propertyMetadata) {
                if (propertyMetadata.Required) {
                    result = Validators.required(control);
                }
                if (propertyMetadata.TypeName === 'string' && propertyMetadata.MaxLength) {
                    result = Json.assign(result, Validators.maxLength(propertyMetadata.MaxLength)(control));
                }
                if (propertyMetadata.TypeName === 'integer' || propertyMetadata.TypeName === 'float') {
                    if (propertyMetadata.MinValue) {
                        result = Json.assign(result, CustomValidators.minValueValidator(propertyMetadata.MinValue)(control));
                    }
                    if (propertyMetadata.MaxValue) {
                        result = Json.assign(result, CustomValidators.maxValueValidator(propertyMetadata.MaxValue)(control));
                    }
                }
                if (propertyMetadata.EnumerableMetadata) {
                    result = Json.assign(result, CustomValidators.minValueValidator(propertyMetadata.EnumerableMetadata.min(x => x.Value))(control));
                    result = Json.assign(result, CustomValidators.maxValueValidator(propertyMetadata.EnumerableMetadata.max(x => x.Value))(control));
                }
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        }
    }

    public static ussFormValidator(propertyMetadata: PropertyMetadata) {
        return (control: AbstractControl) => {
            let result = CustomValidators.ussPropertyMetadataValidator(propertyMetadata)(control);
            // директива ussDataSource добавляет все компоненты, привязанные к этому FormControl'у в этот массив...
            if (utils.isArray(control['_ussComponents'])) {
                for (let component of control['_ussComponents']) {
                    result = Json.assign(result, CustomValidators.ussDataSourceComponentValidator(component)(control));
                }
            }
            if (result && Object.getOwnPropertyNames(result).length === 0) {
                result = null;
            }
            return result;
        }
    }

    public static intNumberValidator(c: AbstractControl) {
        if (CustomValidators.valueIsEmpty(c.value)) return null;

        let isValid = utils.isIntNumber(c.value);
        let result;
        if (isValid) {
            result = null;
        } else {
            result = {
                intNumber: {
                    valid: false
                }
            };
        }

        return result;
    }

    public static floatNumberValidator(c: AbstractControl) {
        if (CustomValidators.valueIsEmpty(c.value)) return null;

        let isValid = utils.isFloatNumber(c.value);
        let result;
        if (isValid) {
            result = null;
        } else {
            result = {
                floatNumber: {
                    valid: false
                }
            }
        }

        return result;
    }

    public static minValueValidator(min: number) {
        return (c: AbstractControl) => {
            if (min === undefined || CustomValidators.valueIsEmpty(c.value)) return null;

            let result = null;
            if (isNaN(c.value) || Number(c.value) < min) {
                result = {
                    minValue: {
                        valid: false,
                        validValue: min
                    }
                };
            }

            return result;
        }
    }

    public static maxValueValidator(max: number) {
        return (c: AbstractControl) => {
            if (max === undefined || CustomValidators.valueIsEmpty(c.value)) return null;

            let result = null;
            if (isNaN(c.value) || Number(c.value) > max) {
                result = {
                    maxValue: {
                        valid: false,
                        validValue: max
                    }
                };
            }

            return result;
        }
    }
}