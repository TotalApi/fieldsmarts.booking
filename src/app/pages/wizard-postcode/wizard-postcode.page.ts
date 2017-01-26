import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {PostCodeAssignment} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import { AccountService } from '../../services/account.service';
import { WizardCommand } from '../../components/wizard-page/wizard-page.component';
import {FranchiseService} from '../../services/franchise.service';

@ng.Component({
    styleUrls: ['./wizard-postcode.page.scss'],
    templateUrl: './wizard-postcode.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-postcode' })
export class AppWizardPostCodePage {

    private errorState: 'invalid_code' | 'outbound_code' | '';

    private defaultBackAction: WizardCommand = { action: () => this.wizard.back(), caption: 'BACK' };
    private defaultNextAction: WizardCommand = { action: () => this.checkPostCode(), caption: 'NEXT ->' };
    public backAction: WizardCommand = this.defaultBackAction;
    public nextAction: WizardCommand = this.defaultNextAction;
    public error: string;
    public consultant: IUserInfo;

    constructor(public sales: SalesService,
        public wizard: AppWizardService,
        public account: AccountService,
        public franchise: FranchiseService,
    ) { }

    public async saveLead(isQualifiedLead: boolean): Promise<boolean> {
        let sale = new Sales();
        sale.isQualifiedLead = isQualifiedLead;
        sale.franchisee = this.wizard.data.franchise;
        sale.address1 = this.wizard.data.address;
        sale.contactEmail = this.wizard.data.email;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactLastName = this.wizard.data.lastName;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactPhone = this.wizard.data.phoneNumber;
        sale.postCode = this.wizard.data.postalCode;
        sale.salesNumber = this.wizard.data.salesNumber;
        sale = await this.sales.save(sale);
        this.wizard.data.salesNumber = sale.salesNumber;
        this.wizard.data.franchise = sale.franchisee;
        return isQualifiedLead;
    }

    public async checkPostCode(): Promise<boolean> {
        let ass: PostCodeAssignment;
        try {
            ass = await this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false);
        } catch (e) {
            this.errorState = 'invalid_code';
            this.error = 'Unfortunatelly we do not serve your area';
            this.nextAction = { caption: 'Alert me instead ->', action: () => alert('Alert!!!!!') };
            this.backAction = { isHidden: true };
            return await this.saveLead(false);
        } 

        if (ass.isOutOfBounds) {
            this.errorState = 'outbound_code';
            this.error = 'You are a little outside our service area';
            this.nextAction = {
                caption: 'Go to SPRAY-NET.COM',
                action: () => {
                    window.location.href = 'https://www.spray-net.com';
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
            this.consultant = await this.account.getUserInfo(ass.salesConsultant);
            this.franchise.get(this.consultant.franchise, this.consultant.region).then(fran => {
                if (fran) {
                    this.consultant.franchise = fran.displayName;
                    this.consultant.userName = this.consultant.userName || fran.email;
                    this.consultant.tel = this.consultant.tel || fran.tel;
                }
            });
        }
        return await this.saveLead(true);
    }

}
