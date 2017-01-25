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

    constructor(public wizard: AppWizardService, public sales: SalesService) {
        this.selectedSurfaces = wizard.data.surfaces.where(x => x.isSelected).toArray();
    }

    private editBookingTime() {
        this.wizard.go('wizard-calendar');
    }

    private editSurfaces() {
        this.wizard.go('wizard-surfaces');
    }

    public saveBookTime(): Promise<any> {
        let b = new PostBooking();
        b.franchisee = this.wizard.data.franchise;
        b.salesNumber = this.wizard.data.salesNumber;
        b.timeSlot = new Date(this.wizard.data.bookTime);

        return this.sales.book(b);
    }

    private check(): Promise<any> {
        return this.saveBookTime();
    }

}
