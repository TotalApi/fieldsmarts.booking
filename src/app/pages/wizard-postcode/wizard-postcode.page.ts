import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {PostCodeAssignment} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import { AccountService } from '../../services/account.service';
import { WizardCommand } from '../../components/wizard-page/wizard-page.component';


@ng.Component({
    styleUrls: ['./wizard-postcode.page.scss'],
    templateUrl: './wizard-postcode.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'wizard-postcode' })
export class AppWizardPostCodePage {

    private errorState: 'invalid_code' | 'outbound_code' | '';
//    private isPostCodeInvalid: boolean = false;
//    private assignment: PostCodeAssignment;

    private defaultBackAction: WizardCommand = { action: () => this.wizard.back(), caption: 'BACK' };
    private defaultNextAction: WizardCommand = { action: () => this.checkPostCode(), caption: 'NEXT ->' };
    public backAction: WizardCommand = this.defaultBackAction;
    public nextAction: WizardCommand = this.defaultNextAction;
    public error: string;

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

    public checkPostCode(): Promise<any> {
        return this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false)
            .then((ass: PostCodeAssignment) => {
//                this.assignment = ass;
                if (ass.isOutOfBounds) {
                    this.errorState = 'outbound_code';
                    this.error = 'You are a little outside our service area';
                    this.nextAction = {
                        caption: 'Go to SPRAY-NET.COM',
                        action: () => {
                            window.location.href = 'http://spray-net.com';
                        }
                    };
                    this.backAction = {
                        caption: 'BACK',
                        action: () => {
                            this.errorState = '';
                            this.error = '';
                            this.backAction = this.defaultBackAction;
                            this.nextAction = this.defaultNextAction;
                        }
                    };
                }
                this.account.getUserInfo(ass.salesConsultant).then(cons => {

                });
//                this.isPostCodeInvalid = false;
            })
            .catch(e => {
//                this.isPostCodeInvalid = true;
                this.errorState = 'invalid_code';
                this.error = 'Unfortunatelly we do not serve your area';
                this.nextAction = { caption: 'Alert me instead ->', action: () => alert('Alert!!!!!') };
                this.backAction = { isHidden: true };
            });
    }

}
