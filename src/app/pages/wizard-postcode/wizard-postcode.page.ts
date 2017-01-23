import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {PostCodeAssignment} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import {AccountService} from '../../services/account.service';

@ng.Component({
    styleUrls: ['./wizard-postcode.page.scss'],
    templateUrl: './wizard-postcode.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-postcode' })
export class AppWizardPostCodePage {

    private isPostCodeInvalid: boolean = false;
    private assignment: PostCodeAssignment;

    constructor(public sales: SalesService,
        public wizard: AppWizardService,
        public account: AccountService) { }

    public saveLead() {
        let sale = new Sales();
        sale.franchisee = this.wizard.data.franchise;
        sale.address1 = this.wizard.data.address;
        sale.contactEmail = this.wizard.data.email;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactLastName = this.wizard.data.lastName;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactPhone = this.wizard.data.phoneNumber;
        sale.postCode = this.wizard.data.postalCode;

        this.sales.save(sale).then((sale: Sales) => {
            this.wizard.data.salesNumber = sale.salesNumber;
            this.wizard.data.franchise = sale.franchisee;
        }).catch(e => {

        });
    }

    public checkPostCode() {
        this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false).then((ass: PostCodeAssignment) => {
            this.assignment = ass;

            this.account.getUserInfo(ass.salesConsultant).then(cons => {

            });

            this.isPostCodeInvalid = false;
        }).catch(e => {
            this.isPostCodeInvalid = true;
        });
    }

}
