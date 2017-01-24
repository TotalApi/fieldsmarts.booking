import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";

@ng.Component({
    styleUrls: ['./wizard-home.page.scss'],
    templateUrl: './wizard-home.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'home' })
export class AppWizardHomePage {

    constructor(public wizard: AppWizardService) { }

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
        window.location.href = 'tel:+1800229933';
        return false;
    }


    isCurrentTimeOff() {
        return true;
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
