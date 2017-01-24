import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import { Router } from '@angular/router';
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import {Surface} from '../../models/Surface';
import {SurfacesService} from '../../services/surfaces.service';

@ng.Component({
    styleUrls: ['./wizard-surfaces.page.scss'],
    templateUrl: './wizard-surfaces.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-surfaces' })
export class AppWizardSurfacesPage {

    private surfaces = [];

    constructor(public sales: SalesService,
        public wizard: AppWizardService,
        public router: Router,
        public surfacesService: SurfacesService) {

        wizard.data.surfaces = wizard.data.surfaces || surfacesService.getSurfaces();
        this.surfaces = wizard.data.surfaces;
    }

    showOptions(surface: Surface) {
        return this.router.navigate(['surface-options', surface.name]);
    }

}
