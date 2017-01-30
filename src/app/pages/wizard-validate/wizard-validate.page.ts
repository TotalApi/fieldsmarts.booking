import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Surface} from '../../models/Surface';
import {PostBooking} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';

@ng.Component({
    styleUrls: ['./wizard-validate.page.scss'],
    templateUrl: './wizard-validate.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-validate' })
export class AppWizardValidatePage {

    private selectedSurfaces: Surface[];

    public nextAction = { action: () => this.check(), caption: 'FINISH'};

    constructor(public wizard: AppWizardService, public sales: SalesService) {
        this.selectedSurfaces = wizard.data.surfaces.where(x => x.isSelected).toArray();
    }

    private editBookingTime() {
        this.wizard.go('wizard-calendar');
    }

    private editSurfaces() {
        this.wizard.go('wizard-surfaces');
    }

    public async check(): Promise<boolean> {
        await this.sales.saveLead();
        await this.sales.saveBookTime();

        return true;
    }

}
