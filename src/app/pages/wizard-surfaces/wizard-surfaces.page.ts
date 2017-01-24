import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import { Router } from '@angular/router';
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import {Surface} from '../../models/Surface';

@ng.Component({
    styleUrls: ['./wizard-surfaces.page.scss'],
    templateUrl: './wizard-surfaces.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-surfaces' })
export class AppWizardSurfacesPage {

    private surfaces = [
        <Surface>{ name: 'Brick' }, 
        <Surface>{ name: 'Windows' }, 
        <Surface>{ name: 'Soffits' }, 
        <Surface>{ name: 'Stucco' } ];

    constructor(public sales: SalesService,
        public wizard: AppWizardService, public router: Router) { }

    showOptions(surface) {
        return this.router.navigate(['surface-options']).then((res) => {
            return res;
        });
    }

}
