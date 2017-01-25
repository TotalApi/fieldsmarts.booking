import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {DomSanitizer} from '@angular/platform-browser';
import {AppWizardService} from "../../services/wizard.service";
import {GeocodeService} from '../../services/geocode.service';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import {UssInputComponent} from '../../../system/components/semanticui/input/inputs.component';
import {CalendarEvent} from '../../common/AddToCalendar';
import {AddToCalendar} from '../../common/AddToCalendar';
declare var google: any;

@ng.Component({
    styleUrls: ['./wizard-done.page.scss'],
    templateUrl: './wizard-done.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ path: 'wizard-done' })
export class AppWizardDonePage implements ng.OnInit {

//    url = 'http://aelitsoft.com';
    url = 'http://spray-net.com';

    constructor(public wizard: AppWizardService, private sanitizer:DomSanitizer) { }

    ngOnInit(): void {
        this.fbLikeIframeSrc();
        this.generateEvent();
    }

    private fbLikeIframeSrc() {
        let likeBtn = document.getElementById('fb-like-btn');
        if (likeBtn) {
            likeBtn.setAttribute('data-href', this.url);
            this.initFbSdk();
        }
    }

    private initFbSdk() {
        let d = document;
        let s = 'script';
        let id = 'facebook-jssdk';
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = `//connect.facebook.net/${this.wizard.translate.currentLang === 'fr' ? "fr_FR" : "en_US"}/sdk.js#xfbml=1&version=v2.8&appId=773528466036157`;
        fjs.parentNode.insertBefore(js, fjs);
    }

    private googleCal: string;
    private iCal: string;

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    private generateEvent() {
        let event = new CalendarEvent();
        event.title = "Spray Net Consultation";
        event.address = this.wizard.data.address;
        event.description = "Spray Net Consultation";
        event.start = new Date(this.wizard.data.bookTime);
        event.end = moment(this.wizard.data.bookTime).add(30, 'minutes').toDate();

        this.googleCal = AddToCalendar.google(event);
        this.iCal = AddToCalendar.ical(event);
    }
}
