import * as ng from '@angular/core';
import { RouterModule, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import {AppRoute} from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import * as ng2Translate from 'ng2-translate';
import * as Settingsservice from '../../services/settings.service';
import AppSettingsResolver = Settingsservice.AppSettingsResolver;

@ng.Component({
    styleUrls: ['./wizard-home.page.scss'],
    templateUrl: './wizard-home.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
//@AppRoute({ path: 'home/:lang' })
@AppRoute({ path: 'home', resolve: { home: AppSettingsResolver } })
export class AppWizardHomePage {

    constructor(public wizard: AppWizardService, private route: ActivatedRoute, private settings: Settingsservice.AppSettings) {
        //wizard.translate.use(wizard.translate.getBrowserLang());
        wizard.translate.use("en");
        this.route.params.subscribe((p: any) => {
            if (p.lang) {
                wizard.data.language = p.lang;
                wizard.translate.use(wizard.data.language);
            }
        });
    }

    callMe() {
        this.wizard.data.callMe = true;
        this.wizard.go('wizard-name');
        return false;
    }

    bookOnline() {
        this.wizard.data.callMe = false;
        this.wizard.go('wizard-name');
        return false;
    }

    call() {
        window.location.href = `tel:${this.settings.mainCallPhone}`;
        return false;
    }


    isCurrentTimeOff() {

        return this.settings.weekWorkingHours && !this.settings.weekWorkingHours.isCallAvaliableForNow();

        //return true;
/*
        const today = moment();
        const res = (today.day() === 0 || today.day() === 6) // check weekend
            || (today.hour() < 8 || today.hour() > 18) // check working hours
            // check holidays
            || (today.date() === 25 && today.month() === 12) // check XMas
            ;
        return res;
*/
    }

}
