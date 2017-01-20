import * as ng from "@angular/core";
import * as rx from "rxjs";
import { FormControl, ControlValueAccessor } from "@angular/forms";
import { SystemComponent } from '../../../decorators/system-component.decorator';
import { guid, debounce } from '../../../utils/utils';
import { UssDataSourceComponent } from '../../common/UssDataSourceComponent';

/**
 * Implementation of Input element
 *
 * @link http://semantic-ui.com/elements/input.html
 *
 * @example
 * <uss-input icon="dollar" type="number" [dataSource]="object" fieldName="value" class="right fluid" placeholder="Enter a sum..."></uss-input>
 */
@ng.Component({
    selector: "uss-input",
    template: `
<div class="field uss-input uss-component" [ngClass]="{ error: (markAsInvalid && isFluid), disabled: disabled }">
    <label *ngIf="label && isFluid">{{label}}</label>
    <div class="ui input {{class}}" [ngClass]="{ icon: icon, error: (markAsInvalid && !isFluid), fluid: isFluid }">
        <label *ngIf="label && !isFluid" class="ui label">{{label}}</label>
        <input [type]="type" [placeholder]="placeholder">
        <i *ngIf="icon" class="{{icon}} icon"></i>
    </div>
</div>`,
    inputs: UssDataSourceComponent.Inputs,
    outputs: UssDataSourceComponent.Outputs
})
@SystemComponent(true)
export class UssInputComponent extends UssDataSourceComponent<string, HTMLInputElement> {
    @ng.Input() icon: string;
    @ng.Input() type: string = "text";

    constructor(vc: ng.ViewContainerRef, cd: ng.ChangeDetectorRef) { super(vc, cd); }

    public get isFluid(): boolean {
        return this.isInsideForm || ` ${this.class} `.Contains(' fluid ');
    }
}

/**
 * Implementation of Textarea element
 *
 * @link http://semantic-ui.com/collections/form.html#text-area
 */
@ng.Component({
    selector: "uss-textarea",
    template: `
<div class="field uss-textarea uss-component" [ngClass]="{ error: (markAsInvalid && isInsideForm), disabled: disabled }">
    <label *ngIf="label">{{label}}</label>
    <div class="ui input fluid {{class}}" [ngClass]="{ error: (markAsInvalid && !isInsideForm) }">
        <textarea rows="{{rows}}" [placeholder]="placeholder"></textarea>
    </div>
</div>`,
    inputs: UssDataSourceComponent.Inputs,
    outputs: UssDataSourceComponent.Outputs
})
@SystemComponent(true)
export class UssTextAreaComponent extends UssDataSourceComponent<string, HTMLTextAreaElement> {

    @ng.Input() rows: string;

    constructor(vc: ng.ViewContainerRef, cd: ng.ChangeDetectorRef) { super(vc, cd); }
}

/**
 * Implementation of Checkbox element
 *
 * @link http://semantic-ui.com/modules/checkbox.html
 */
@ng.Component({
    selector: "uss-checkbox",
    template: `
<div class="field">
    <div class="ui {{classType}} checkbox">
        <input #checkbox type="checkbox" [attr.id]='id'
        [attr.value]="attrValue"
        [attr.type]="inputType" tabindex="0" [attr.name]="name" [attr.disabled]="disabled" />
        <label [attr.for]='id'>
            {{label}}
            <ng-content></ng-content>
        </label>
    </div>
</div>`,
    inputs: UssDataSourceComponent.Inputs,
    outputs: UssDataSourceComponent.Outputs
})
@SystemComponent(true)
export class UssCheckboxComponent extends UssDataSourceComponent<number, HTMLInputElement> implements ng.OnChanges {

    constructor(vc: ng.ViewContainerRef, cd: ng.ChangeDetectorRef) { super(vc, cd); }
    @ng.Input('value') attrValue: string|number;
    @ng.Input('name') name: string;

    @ng.ViewChild('checkbox') checkbox: ng.ElementRef;

    @ng.Input("type")
    set type(data: string) {
        if (data && data !== "checkbox") {
            this.classType = data;
            if (data === "radio") {
                this.inputType = data;
            }
        }
    }

    private inputType: string = "checkbox";
    private classType = "checkbox";

    public id = guid();

    ngOnChanges(changes): void {
        if (changes.attrValue) {
            this.checkbox.nativeElement.checked = this.attrValue;
        }
    }

    protected getInputElementValue() {
        let res = <any>super.getInputElementValue();
        switch (this.inputElement.type) {
            case 'checkbox':
                if (isNaN(res))
                    res = this.inputElement.checked;
                else {
                    if (this.inputElement.checked)
                        res = this.value | parseInt(res);
                    else
                        res = this.value & ~parseInt(res);
                }
                break;
            case 'radio':
                if (this.inputElement.checked)
                    res = parseInt(res);
                break;
        }
        return res;
    }

    protected setInputElementValue(value) {
        switch (this.inputElement.type) {
            case 'checkbox':
                if (isNaN(<any>this.inputElement.value)) {
                    // Если значения value не установлено - этот checkbox просто переключает значения true/false
                    this.inputElement.checked = !!value;
                } else {
                    // Если значения value установлено - этот checkbox устанавливает/сбрасывает указанные в этом значении биты
                    this.inputElement.checked = (parseInt(this.inputElement.value) & value) !== 0;
                }
                break;
            case 'radio':
                this.inputElement.checked = parseInt(this.inputElement.value) === value;
                break;
            default:
                value = value === undefined ? '' : value;
                if (this.inputElement.value !== value) {
                    this.inputElement.value = value;
                }
                break;
        }
    }
}
