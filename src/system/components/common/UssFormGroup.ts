import { FormGroup, FormControl, Validators, Validator, FormBuilder } from '@angular/forms';

export class UssFormGroup extends FormGroup {
    public datasource?: any;

    constructor(datasource?: any) {
        if (datasource) {
            super(UssFormGroup.createFormControls(datasource));
            this.setDatasource(datasource);
        }
    }

    private static createFormControls(datasource: any) {
        const formControls = {};
        if (datasource) {
            for (let prop in datasource) {
                if (datasource.hasOwnProperty(prop)) {
                    formControls[prop] = new FormControl(undefined/*, CustomValidators.ussFormValidator(prop)*/);
                }
            }
        }
        return formControls;
    }

    public static create(datasource?: any): UssFormGroup {
        return new UssFormGroup(datasource);
    }

    public setDatasource(datasource: any): UssFormGroup {
        this.datasource = datasource;
        for (let prop in this.datasource) {
            if (this.datasource.hasOwnProperty(prop)) {
                const ctrl = <FormControl>this.controls[prop];
                if (ctrl) {
                    ctrl.setValue(this.datasource[prop]);
                }
            }
        }

        return this;
    }
}