import {
    Component, Input, HostBinding, HostListener, EventEmitter, ViewContainerRef, ViewChild,
} from '@angular/core';
import {SystemComponent} from '../../../decorators/system-component.decorator';

@Component({
    selector: 'sui-select-option',
    template: `
<span #optionRenderTarget></span>
<span *ngIf="!useTemplate">{{ readValue(value) }}</span>
`
})
@SystemComponent(true)
export class SuiSelectOption {
    @HostBinding('class.item') itemClass = true;

    @Input()
    public value:any;

    public selected:EventEmitter<any> = new EventEmitter<any>();

    public useTemplate:boolean = false;

    @ViewChild('optionRenderTarget', { read: ViewContainerRef })
    public viewContainerRef:ViewContainerRef;

    public readValue = (value:any) => "";

    constructor() {}

    @HostListener('click', ['$event'])
    public click(event:MouseEvent):boolean {
        event.stopPropagation();
        this.selected.emit(this.value);
        return false;
    }
}
