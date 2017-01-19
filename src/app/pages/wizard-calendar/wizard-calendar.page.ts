import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizard-calendar.page.scss'],
    templateUrl: './wizard-calendar.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-calendar' })
export class AppWizardCalendarPage {

    constructor(public wizard: AppWizardService) { }
}
