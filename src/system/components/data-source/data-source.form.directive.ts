import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import { SystemComponent } from '../../decorators/system-component.decorator';
import { UssDirectiveBase } from '../../directives/directive.base';
import { UssDataSourceBaseDirective } from './data-source.base.directive';
import { UssFormGroup } from '../common/UssFormGroup';
import { EntityMetadata, PropertyMetadata } from '../common/UssDataSourceComponent';
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
     * Data source
     */
    @ng.Input('ussDataSource') dataSource: Object;

    /**
     * Metadata for class
     */
    @ng.Input('metadata') metadata: EntityMetadata;

    public ngForm: ngForms.NgForm;

    ngOnChanges(changes) {
        if (this.wasInit && (changes.dataSource || changes.metadata)) {
            this.initForm();
        }
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.dataSource && !this.metadata) {
            this.metadata = <any>{
                Properties: Enumerable.from(this.dataSource).select(kv => <PropertyMetadata>{ Name: kv.key }).toArray()
            };
        }
        this.ngForm = Enumerable.from(this.hostViewContainer.injector['_view']).select(kv => kv.value).firstOrDefault(x => x instanceof ngForms.NgForm);

        this.initForm();
    }

    private initForm() {
        if (this.ngForm) {
            this.ngForm.form = UssFormGroup.create(this.metadata, this.dataSource);
            this.hostElementRef.nativeElement['_ussDataSource'] = this;
        }
    }
}


