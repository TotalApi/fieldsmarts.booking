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
@AppRoute({ path: 'wizard-surfaces' })          
export class AppWizardSurfacesPage {

    private surfaces: Surface[] = [];
    private forgotted: boolean;

    public nextAction = { action: () => this.check(), caption: 'NEXT'};

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

    private checkIfSurfaceSelected(surface: Surface) {
        if (surface.isSelected && surface.options && surface.options.length > 0) {
            if (typeof(surface.options) === 'string') {
                return true;
            } else {
                return (surface.options as SurfaceOption[]).any(x => x.isSelected);
            }
        } else {
            return surface.isSelected;
        }
    }

    select(surface: Surface) {
        if (surface.name === 'isOther') {
            this.router.navigate(['surface-options', surface.name]);
        } else if (!this.checkIfSurfaceSelected(surface)) {
            (surface.options && surface.options.length > 0) && this.router.navigate(['surface-options', surface.name]);
        }

        surface.isSelected = !surface.isSelected;
    }

    closeAlert() {
        this.forgotted = false;
    }

    check(): boolean {
        const ifAnySelected = this.surfaces.any(x => this.checkIfSurfaceSelected(x));
        this.forgotted = !ifAnySelected;
        //this.wizard.data.isQualifiedLead = true;
        this.wizard.data.status = 'Lead';

        if (this.forgotted) {
            return false;
        }

        const array = this.surfaces.where(x => x.isSelected && x.name !== 'isOther')
            .selectMany(x => x.options as SurfaceOption[])
            .where((x: SurfaceOption) => x && x.isSelected).toArray(); 
        if (array.any() && array.all((x: SurfaceOption) => ['isWood', 'isRusted', 'isPainted'].contains(x.name))) {
            
            $('.ui.modal').modal({blurring: true}).modal('show');
            //this.wizard.data.isQualifiedLead = false;
            this.wizard.data.status = 'Rejected';
            return false;
        }

        return !this.forgotted;
    }

    closePopup() {
        $('.ui.modal').modal('hide');
    }

    next() {
        $('.ui.modal').modal('hide');
        
        this.wizard.next();
    }
}
