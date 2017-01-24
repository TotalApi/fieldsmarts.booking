import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';

@ng.Component({
    styleUrls: ['./surface-custom.page.scss'],
    templateUrl: './surface-custom.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'surface-custom' })
export class AppSurfacesCustomPage {

    constructor(public sales: SalesService,
        public wizard: AppWizardService) { }

}
