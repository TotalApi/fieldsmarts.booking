import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {GeocodeService} from '../../services/geocode.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {UssInputComponent} from '../../../system/components/semanticui/input/inputs.component';

declare var google: any;

@ng.Component({
    styleUrls: ['./wizard-location.page.scss'],
    templateUrl: './wizard-location.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-location' })
export class AppWizardLocationPage implements ng.OnInit {

    @ng.ViewChild("search") searchElement: UssInputComponent;

    constructor(public wizard: AppWizardService, public geocode: GeocodeService, private mapsApiLoader: MapsAPILoader,
    private ngZone: ng.NgZone) { }

    /*private checkAddress() {
        this.geocode.getSuggestedAddess(this.wizard.data.address).then((addr) => {

        }).catch(e => {
            
        });
    }*/

    ngOnInit(): void {
      this.mapsApiLoader.load().then(() => {
          const autocomplete = new google.maps.places.Autocomplete(this.searchElement.inputElement);
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              const place = autocomplete.getPlace();
                this.wizard.data.address = place.formatted_address;

                const postCode = place.address_components.firstOrDefault(x => x.types.contains('postal_code'));
                if (postCode) {
                    this.wizard.data.postalCode = postCode.long_name;
                } else {
                    this.wizard.data.postalCode = null;
                }
            });
          });
        });
    }

}
