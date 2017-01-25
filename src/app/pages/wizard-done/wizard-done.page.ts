import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {GeocodeService} from '../../services/geocode.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {UssInputComponent} from '../../../system/components/semanticui/input/inputs.component';

declare var google: any;

@ng.Component({
    styleUrls: ['./wizard-done.page.scss'],
    templateUrl: './wizard-done.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-done' })
export class AppWizardDonePage implements ng.OnInit {

    constructor(public wizard: AppWizardService) { }

    ngOnInit(): void {
    }

}
