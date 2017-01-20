import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import { SystemComponent } from '../../decorators/system-component.decorator';
import { UssDirectiveBase } from '../../directives/directive.base';
import { UssDataSourceBaseDirective } from './data-source.base.directive';
import {UssFormGroup} from '../common/UssFormGroup';
var Enumerable: linqjs.Enumerable = require('linq');

@ng.Directive({
    selector: 'form[ussDataSource]'
})
@SystemComponent(true)
export class UssDataSourceFormDirective extends UssDirectiveBase<ngForms.NgForm> implements ng.OnChanges, ng.OnInit {

    constructor(hostElementRef: ng.ElementRef, viewContainer: ng.ViewContainerRef, @ng.Host() hostComponent: ngForms.NgForm) {
        super(hostComponent, hostElementRef, viewContainer);
    }

    /**
     * Источник данных (объект) с полем которого связывается компонент
     */
    @ng.Input('ussDataSource') dataSource: Object;


    public ngForm: ngForms.NgForm;

    ngOnChanges(changes) {
        if (this.wasInit && (changes.dataSource || changes.metadata)) {
            this.initForm();
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.ngForm = Enumerable.from(this.hostViewContainer.injector['_view']).select(kv => kv.value).firstOrDefault(x => x instanceof ngForms.NgForm);

        this.initForm();
    }

    private initForm() {
        if (this.ngForm) {
            this.ngForm.form = UssFormGroup.create(this.dataSource);
            this.hostElementRef.nativeElement['_ussDataSource'] = this;
        }
    }
}


