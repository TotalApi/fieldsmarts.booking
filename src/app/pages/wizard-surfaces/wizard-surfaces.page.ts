import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import { Router } from '@angular/router';
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import {Surface} from '../../models/Surface';
import {SurfacesService} from '../../services/surfaces.service';
import {SurfaceOption} from '../../models/Surface';

@ng.Component({
    styleUrls: ['./wizard-surfaces.page.scss'],
    templateUrl: './wizard-surfaces.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'wizard-surfaces' })
export class AppWizardSurfacesPage {

    private surfaces = [];
    private forgotted: boolean;

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

    select(surface: Surface) {
        surface.isSelected = !surface.isSelected;

        const ifAnySelected = () => (surface.options as SurfaceOption[]).any(x => x.isSelected);
        if (surface.name === 'not_listed' || !ifAnySelected()) {
            this.router.navigate(['surface-options', surface.name]);
        }
    }

    closeAlert() {
        this.forgotted = false;
    }

    check(): boolean {
        const ifAnySelected = this.surfaces.where(x => x.isSelected).selectMany(x => x.options).any(x => x && (typeof(x) === 'string' ? x.length > 0 : (x as SurfaceOption).isSelected));
        return this.forgotted = !ifAnySelected;
    }
}
