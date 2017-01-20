import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {DayTime} from '../../components/time-booking/time-booking.component';
import {TimeBookingComponent} from '../../components/time-booking/time-booking.component';

@ng.Component({
    styleUrls: ['./wizard-calendar.page.scss'],
    templateUrl: './wizard-calendar.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ menuPath: 'wizard-calendar' })
export class AppWizardCalendarPage {

    @ng.ViewChild("timeBooking")
    timeBooking: ng.ComponentRef<TimeBookingComponent>;

    public selectedDayTime: DayTime = 'morning';

    constructor(public wizard: AppWizardService) { }

    private setDayTime(dayTime: DayTime) {
        this.selectedDayTime = dayTime;
    }
}
