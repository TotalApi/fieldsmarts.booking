import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {SalesService} from '../../services/sales.service';
import {LookupService} from '../../services/lookup.service';
import {Lookup, LookupItem,MarketingInfo, HeardAboutUsItem} from '../../models/Sales';

@ng.Component({
    styleUrls: ['./recomendation-source.page.scss'],
    templateUrl: './recomendation-source.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'recomendation-source' })
export class AppRecomendationSourcePage {

    private options = new Lookup<HeardAboutUsItem>();

    private selectedSource: LookupItem;

    constructor(public sales: SalesService, public lookup: LookupService,  public wizard: AppWizardService) {
        lookup.getHeardAboutUs().then(x => {
            this.options = x;
            this.selectedSource = x.default;
            this.options.values = this.options.values
                .filter(x => x.forBookingOnly !== undefined && x.forBookingOnly !== null);
        });
    }

    private select(selection: LookupItem) {
        this.selectedSource = selection;
    }

    private async save(): Promise<any> {
        const mi = new MarketingInfo();
        mi.salesNumber = this.wizard.data.salesNumber;
        mi.franchisee = this.wizard.data.franchise;
        mi.heardAboutUs = this.selectedSource.id;
        return await this.sales.saveMarkeingInfo(mi);
    }
}
