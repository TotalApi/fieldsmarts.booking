import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';

@ng.Component({
    styleUrls: ['./wizard-surfaces.page.scss'],
    templateUrl: './wizard-surfaces.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'wizard-surfaces' })
export class AppWizardSurfacesPage {

    constructor(public sales: SalesService,
        public wizard: AppWizardService) { }

}
