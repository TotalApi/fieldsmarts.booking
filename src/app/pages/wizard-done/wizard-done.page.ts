import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {DomSanitizer} from '@angular/platform-browser';
import {AppWizardService} from "../../services/wizard.service";
import {GeocodeService} from '../../services/geocode.service';
import {AgmCoreModule, MapsAPILoader} from 'angular2-google-maps/core';
import {UssInputComponent} from '../../../system/components/semanticui/input/inputs.component';
import {CalendarEvent} from '../../common/AddToCalendar';
import {AppSettings} from '../../services/settings.service';
import { AddToCalendar } from '../../common/AddToCalendar';
import * as system from 'src/system';


@ng.Component({
    styleUrls: ['./wizard-done.page.scss'],
    templateUrl: './wizard-done.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-done' })
export class AppWizardDonePage implements ng.OnInit {

    private googleCal: string;
    private iCal: string;

    public returnSite = 'https://www.spray-net.com';

    constructor(public wizard: AppWizardService, private settings: AppSettings, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        if (this.wizard.data.callMe) {
            this.fbLikeIframeSrc();    
        }
        else if (this.wizard.data.bookTime) {
            this.generateEvent();    
        }
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    private fbLikeIframeSrc() {
        const likeBtn = document.getElementById('fb-like-btn');
        if (likeBtn) {
            likeBtn.setAttribute('data-href', this.settings.siteToLike);
            this.initFbSdk();
        } else {
            setTimeout(() => this.fbLikeIframeSrc());
        }
    }

    private initFbSdk() {
        const id = 'facebook-jssdk';
        const fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) return;
        const js = document.createElement('script');
        js.id = id;
        js.src = `//connect.facebook.net/${this.wizard.translate.currentCulture}/sdk.js#xfbml=1&version=v2.8&appId=${this.settings.facebookAppId}`;
        fjs.parentNode.insertBefore(js, fjs);
    }

    private generateEvent() {
        try {
            const event = new CalendarEvent();
            event.title = "Spray Net Consultation";
            event.address = this.wizard.data.address;
            event.description = "Spray Net Consultation";
            event.start = new Date(this.wizard.data.bookTime);
            event.end = moment(this.wizard.data.bookTime).add(30, 'minutes').toDate();

            this.googleCal = AddToCalendar.google(event);
            this.iCal = AddToCalendar.ical(event);
        } catch (e) {
            system.error(e);
        } 
    }
}
