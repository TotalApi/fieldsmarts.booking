import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizardHome.page.scss'],
    templateUrl: './wizardHome.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'home' })
export class AppWizardHomePage {

    constructor(public wizard: AppWizardService) { }

    callMe() {
        this.wizard.data.callMe = true;
        this.wizard.go('wizard-name');
    }

    bookOnline() {
        this.wizard.data.callMe = false;
        this.wizard.go('wizard-name');
    }

    call() {
        window.location.href = 'tel:+1800229933';
    }

}
