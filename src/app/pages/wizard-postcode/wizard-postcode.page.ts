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
    private defaultNextAction: WizardCommand = { action: () => this.checkPostCode(), caption: 'NEXT' };
    public backAction: WizardCommand = this.defaultBackAction;
    public nextAction: WizardCommand = this.defaultNextAction;
    public error: string;
    public consultant: IUserInfo;
    public partner: IUserInfo;

    constructor(public sales: SalesService,
        public wizard: AppWizardService,
        public account: AccountService,
        public franchise: FranchiseService,
    ) { }

    public async checkPostCode(): Promise<boolean> {
        let ass: PostCodeAssignment;

        this.wizard.data.status = 'Lead';
        this.wizard.data.isOutOfBounds = false;

        try {
            ass = await this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false);
        } catch (e) {
            this.errorState = 'invalid_code';
            this.error = 'WIZARD-POSTCODE.NOT_SERVE|Unfortunatelly we do not serve your area';
            this.nextAction = { caption: 'WIZARD-POSTCODE.ALERT_ME|Alert me instead ->', action: () => alert('Alert!!!!!') };
            this.backAction = { isHidden: true };
            this.wizard.data.status = 'Unqualified';
            await this.sales.saveLead();
            return false;
        } 
        if (ass.isOutOfBounds) {
            this.wizard.data.isOutOfBounds = true;
            this.wizard.data.status = 'Rejected';
            this.errorState = 'outbound_code';
            this.error = 'WIZARD-POSTCODE.OUTSIDE|You are a little outside our service area';
            this.nextAction = {
                caption: 'GOTO_SITE|Go to SPRAY-NET.COM',
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
            this.partner = await this.account.getFirstFranchisePartner(this.consultant.franchise);
            this.franchise.get(this.consultant.franchise, this.consultant.region).then(fran => {
                if (fran) {
                    this.consultant.franchise = fran.displayName;
                    this.consultant.userName = this.consultant.userName || fran.email;
                    this.consultant.tel = this.consultant.tel || fran.tel;
                }
            });
        }
        await this.sales.saveLead();
        return this.wizard.data.status === 'Lead';
    }

}
