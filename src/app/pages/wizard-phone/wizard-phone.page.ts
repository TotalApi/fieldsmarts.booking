import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizard-phone.page.scss'],
    templateUrl: './wizard-phone.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-phone' })
export class AppWizardPhonePage {

    constructor(public wizard: AppWizardService) { }

}
