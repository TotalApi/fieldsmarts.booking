import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizard-email.page.scss'],
    templateUrl: './wizard-email.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-email' })
export class AppWizardEmailPage {

    constructor(public wizard: AppWizardService) { }

}
