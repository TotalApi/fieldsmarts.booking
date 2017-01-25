import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Surface} from '../../models/Surface';

@ng.Component({
    styleUrls: ['./wizard-validate.page.scss'],
    templateUrl: './wizard-validate.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-validate' })
export class AppWizardValidatePage {

    private selectedSurfaces: Surface[];

    constructor(public wizard: AppWizardService) {
        this.selectedSurfaces = wizard.data.surfaces.where(x => x.isSelected).toArray();
    }

    private editBookingTime() {
        this.wizard.go('wizard-calendar');
    }

    private editSurfaces() {
        this.wizard.go('wizard-surfaces');
    }

}
