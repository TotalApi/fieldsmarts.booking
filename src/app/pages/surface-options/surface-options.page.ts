import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';

@ng.Component({
    styleUrls: ['./surface-options.page.scss'],
    templateUrl: './surface-options.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'surface-options' })
export class AppSurfacesOptionsPage {

    constructor(public sales: SalesService,
        public wizard: AppWizardService) { }

}
