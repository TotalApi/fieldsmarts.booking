import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizardPhone.page.scss'],
    templateUrl: './wizardPhone.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-phone' })
export class AppWizardPhonePage {

    constructor(public wizard: AppWizardService) { }

}
