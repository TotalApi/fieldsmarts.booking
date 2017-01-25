import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {SalesService} from '../../services/sales.service';
import {LookupService} from '../../services/lookup.service';
import {Lookup} from '../../models/Sales';
import {LookupItem} from '../../models/Sales';
import {MarketingInfo} from '../../models/Sales';

@ng.Component({
    styleUrls: ['./recomendation-source.page.scss'],
    templateUrl: './recomendation-source.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'recomendation-source' })
export class AppRecomendationSourcePage {

    private options: Lookup = new Lookup();

    private selectedSource: LookupItem;

    constructor(public sales: SalesService, public lookup: LookupService,  public wizard: AppWizardService) {
        lookup.getHeardAboutUs().then(x => {
            this.options = x;
            this.selectedSource = x.default;
        });
    }

    private select(selection: LookupItem) {
        this.selectedSource = selection;
    }

    private async save() {
        let mi = new MarketingInfo();
        mi.salesNumber = this.wizard.data.salesNumber;
        mi.franchisee = this.wizard.data.franchise;
        mi.heardAboutUs = this.selectedSource.id;

        await this.sales.saveMarkeingInfo(mi);
    }
}
