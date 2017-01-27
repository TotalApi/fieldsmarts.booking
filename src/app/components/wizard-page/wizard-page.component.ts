import * as ng from '@angular/core';
import * as ngForms from '@angular/forms';
import * as rx from 'rxjs';
import { AppRoute } from 'src/app/app.routes';
import {AppComponent} from 'src/system/decorators/app-component.decorator';
import {Json} from '../../../system/utils/Json';
import { AppWizardService } from '../../services/wizard.service';

export declare type WizardCommand = { caption?: string; route?: string; action?: (command: WizardCommand) => rx.Observable<boolean> | Promise<boolean> | boolean | void; isHidden?: boolean };

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
    @ng.Input('error') error: string;

    @ng.ViewChild('ussForm') ussForm: ngForms.NgForm;

    public loading: boolean = false;

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
            this.back.caption = 'BACK|Back';
        }
        if (!this.next.isHidden && !this.next.caption)
        {
            this.next.caption = 'NEXT|Next';
        }
        this.wizard.updateState();
    }

    public async execute(command: WizardCommand) {
        this.loading = true;
        try {
            await this.execute$(command);
        } finally {
            this.loading = false;
        } 
    }

    private async execute$(command: WizardCommand, ignoreRoute?: boolean): Promise<void> {
        this.wizard.updateState();
        if (command) {
            if (command.action && !ignoreRoute) {
                let res = command.action(command);
                if (res instanceof rx.Observable || res instanceof Promise) {
                    if (res instanceof rx.Observable) {
                        res = res.toPromise();
                    }
                    res = await res;
                }
                if (res) {
                    await this.execute$(command, true);
                }
            }
            else if (command.route) {
                this.wizard.go(command.route);
            }
            else if (command.caption === this.back.caption) {
                this.wizard.back(this.id);
            }
            else if (command.caption === this.next.caption) {
                this.wizard.next(this.id);
            }
        }
    }
    
}
