import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import * as rx from 'rxjs';
import { AppRoute } from 'src/app/app.routes';
import {AppComponent} from 'src/system/decorators/app-component.decorator';
import {Json} from '../../../system/utils/Json';
import { AppWizardService } from '../../services/wizard.service';

declare type WizardCommand = { caption?: string; route?: string; action?: (command: WizardCommand) => void; isHidden?: boolean };

@ng.Component({
    selector: 'wizard-page',
    styleUrls: ['./wizard-page.component.scss'],
    templateUrl: './wizard-page.component.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppComponent()
export class WizardPageComponent implements ng.OnInit {

    @ng.Input('id') id: string;
    @ng.Input('class') class: string;
    @ng.Input('title') title: string;
    @ng.Input('description') description: string;
    @ng.Input('back') back: WizardCommand | string | boolean | any;
    @ng.Input('next') next: WizardCommand | string | any;

    @ng.ViewChild('ussForm') ussForm: ngForms.NgForm;

    constructor(private wizard: AppWizardService) {
        
    }

    ngOnInit(): void {
        this.id = this.id || this.wizard.current;
        this.class = this.class || '';

        if (typeof this.back === 'boolean') {
            this.back = <any>{ isHidden: !this.back };
        }
        if (typeof this.next === 'boolean') {
            this.next = <any>{ isHidden: !this.next };
        }

        this.back = this.back || { isHidden: false };
        this.next = this.next || { isHidden: false };

        if (typeof this.back === 'string') {
            this.back = <any>{ caption: this.back };
        }
        if (typeof this.next === 'string') {
            this.next = <any>{ caption: this.next };
        }

        if (!this.back.isHidden && !this.back.caption) {
            this.back.caption = 'BACK';
        }
        if (!this.next.isHidden && !this.next.caption) {
            this.next.caption = 'NEXT ->';
        }
        this.wizard.updateState();
    }

    public execute(command: WizardCommand) {
        if (command) {
            if (command.action) {
                command.action(command);    
            }
            if (command.route) {
                this.wizard.go(command.route);
            }
            else if (command === this.back) {
                this.wizard.back(this.id);
            }
            else if (command === this.next) {
                this.wizard.next(this.id);
            }
        }
    }
    
}
