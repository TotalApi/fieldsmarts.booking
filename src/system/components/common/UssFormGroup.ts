import { FormGroup, FormControl, Validators, Validator, FormBuilder } from '@angular/forms';
import { CustomValidators } from "./CustomValidators";
import { EntityMetadata, PropertyMetadata } from './UssDataSourceComponent';


export class UssFormGroup extends FormGroup {
    public metadata?: EntityMetadata;
    public datasource?: any;

    constructor(metadata?: EntityMetadata, datasource?: any) {
        if (metadata) {
            super(UssFormGroup.createFormControls(metadata));
            this.metadata = metadata;
            if (datasource)
            this.setDatasource(datasource);
        }
    }

    private static createFormControls(metadata: EntityMetadata) {
        const formControls = {};
        if (metadata) {
            for (let prop of metadata.Properties) {
                formControls[prop.Name] = new FormControl(undefined, CustomValidators.ussFormValidator(prop));
                }
            }
        return formControls;
        }

    public static create(metadata: EntityMetadata, datasource?: any): UssFormGroup {
        return new UssFormGroup(metadata, datasource);
    }

    public getPropertyMetadata(name: string) {
        return this.metadata ? this.metadata.Properties.firstOrDefault(x => x.Name === name) : null;
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