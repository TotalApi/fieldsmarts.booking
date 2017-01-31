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
@AppRoute({ path: 'wizard-calendar' })
export class AppWizardCalendarPage implements ng.OnInit {
    

    @ng.ViewChild("timeBooking")
    timeBooking: ng.ComponentRef<TimeBookingComponent>;

    public selectedDayTime: DayTime = 'morning';

    public model: any;
    private loading: boolean = true;

    public nextAction = { action: () => this.check(), caption: 'NEXT'};

    private loaded(x) {
        this.loading = !x;
    }

    constructor(public wizard: AppWizardService) {
        this.model = wizard.data;
        this.model.agreedForBook = false;

    }

    private setDayTime(dayTime: DayTime) {
        this.selectedDayTime = dayTime;
    }

    private check(): boolean {
        if (!this.wizard.data.bookTime) {
            return false;
        }

        if (!this.wizard.data.agreedForBook) {
            $('#calendarModal').modal({blurring: true}).modal('show');
        }

        return this.wizard.data.agreedForBook;

    }

    private closePopup() {
        this.model.agreedForBook = false;
        $('#calendarModal').modal('hide');
    }

    private next() {
        $('#calendarModal').modal('hide');
        this.wizard.next();
    }

    public nextDisabled() {
        return !this.wizard.data.bookTime;
    }

    ngOnInit(): void {
    }

}
