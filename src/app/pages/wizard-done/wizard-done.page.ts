import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {GeocodeService} from '../../services/geocode.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {UssInputComponent} from '../../../system/components/semanticui/input/inputs.component';
import {AppSettings} from '../../services/settings.service';
declare var google: any;

@ng.Component({
    styleUrls: ['./wizard-done.page.scss'],
    templateUrl: './wizard-done.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-done' })
export class AppWizardDonePage implements ng.OnInit {

    constructor(public wizard: AppWizardService, private settings: AppSettings) { }

    ngOnInit(): void {
        this.fbLikeIframeSrc();
    }

    private fbLikeIframeSrc() {
        const likeBtn = document.getElementById('fb-like-btn');
        if (likeBtn) {
            likeBtn.setAttribute('data-href', this.settings.siteToLike);
            this.initFbSdk();
        }
    }

    private initFbSdk() {
        const id = 'facebook-jssdk';
        const fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) return;
        const js = document.createElement('script');
        js.id = id;
        js.src = `//connect.facebook.net/${this.wizard.translate.currentLang === 'fr' ? "fr_FR" : "en_US"}/sdk.js#xfbml=1&version=v2.8&appId=${this.settings.facebookAppId}`;
        fjs.parentNode.insertBefore(js, fjs);
    }
}
