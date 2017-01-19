import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizardName.page.scss'],
    templateUrl: './wizardName.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-name' })
export class AppWizardNamePage {

    constructor(public wizard: AppWizardService) { }

}
