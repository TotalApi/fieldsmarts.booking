import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizard-location.page.scss'],
    templateUrl: './wizard-location.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-location' })
export class AppWizardLocationPage {

    constructor(public wizard: AppWizardService) { }

}
