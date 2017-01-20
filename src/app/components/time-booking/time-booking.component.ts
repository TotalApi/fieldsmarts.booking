﻿import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import * as system from 'src/system';
import { AppComponent } from 'src/system';
import { Subscription } from 'rxjs/Subscription';
import { AppRoutes } from 'src/app/app.routes';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {AvailableTimeSlots} from '../../models/Sales';
import {SalesSchedule} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';


@Component({
    selector: 'time-booking',
    templateUrl: './time-booking.component.html',
    styleUrls: ['./time-booking.component.scss']
})
@AppComponent()
export class TimeBookingComponent implements OnInit {

    public availableTimeSlotsByDay: Array<SalesSchedule> = [];
    private slotStartDate:Date;
    public monthList: Array<string> = [];
    public availableTimeSlots: Array<Date> = [];
    public selectedMonth: string;

    private minTime: moment.Moment;
    private maxTime: moment.Moment;

    public allTimeSlots: Array<Date> = [];

    private franchise: string = 'corporate';
    private salesNumber: string = '17011868331'; 

    public hasPrevious: boolean = false;

    public selectedTime: Date;

    constructor(
        public sales: SalesService,
        private router: Router,
        private location: Location,
        public translate: TranslateService
    ) {
    }
    
    ngOnInit() {
        this.populateMonthList('en');
        this.getSalesAvailableSlots(moment().toDate()).then(() => {
            const times = this.availableTimeSlotsByDay.selectMany(x => x.times);
            this.minTime = moment(times.minBy(x => x)).year(moment().year()).month(moment().month()).date(moment().date());
            this.maxTime = moment(times.maxBy(x => x)).year(moment().year()).month(moment().month()).date(moment().date());

            let currentTime = moment(this.minTime);
            while (currentTime.isSameOrBefore(this.maxTime, "minute")) {
                this.allTimeSlots.push(currentTime.toDate());
                currentTime.add(30, "minute");
            }
        });
    }

    public isSelected(day: SalesSchedule, time: Date) {
        let m = moment(day.dayOfTheWeek);
        let t = moment(time).year(m.year()).month(m.month()).date(m.date()).toDate();
        return !!day.dayOfTheWeek &&
            !!this.selectedTime &&
            t.getDate() === this.selectedTime.getDate() &&
            t.getHours() === this.selectedTime.getHours() &&
            t.getMinutes() === this.selectedTime.getMinutes();
    }

    public isTimeAvailable(day: SalesSchedule, time: Date): boolean {
        let m = moment(day.dayOfTheWeek);
        let t = moment(time).year(m.year()).month(m.month()).date(m.date()).toDate();
        return day.times.any(e => moment(e).isSame(moment(t)));
    }

    public bookTime(day: SalesSchedule, time: Date) {
        const t = moment(time);
        this.selectedTime = moment(day.dayOfTheWeek).hours(t.hours()).minutes(t.minutes()).seconds(t.seconds()).toDate();
    }

    public isToday(date: Date | moment.Moment | string): boolean {
            return moment(date).isSame(moment().startOf('day'));
        }

    public static getMonthNameBy(index: number, langCode:string): string {
            var monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var monthNameFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            if (langCode === 'fr') {
                return monthNameFr[index];
            }
            return monthNamesEn[index];
        }

    private populateMonthList(lang: string) {
            var langCode = localStorage[lang];
            this.monthList = new Array<string>();
            for (var i = 0; i < 12; i++) {
                this.monthList.push(TimeBookingComponent.getMonthNameBy(i, langCode));
            }
        }

    public getSalesAvailableSlots(startDate: Date): Promise<void> {
            this.availableTimeSlotsByDay = new Array<SalesSchedule>();

        return this.sales.getAvailableTimeSlots(this.franchise, this.salesNumber, startDate).then((response) => {
            var availableTimeSlotsStrings = response.availableTimeSlots;
            this.availableTimeSlots = new Array<Date>();
            for (var i = 0; i < availableTimeSlotsStrings.length; i++) {
                var date = new Date(availableTimeSlotsStrings[i].toString());
                this.availableTimeSlots.push(date);
            }
            this.populateAvailableSlotsByDay(this.availableTimeSlots, startDate);
            var currentWeekMonth = this.availableTimeSlots[0].getMonth();
            this.selectedMonth = this.monthList.first((x, idx) => idx === currentWeekMonth);
        });
    }

    private populateAvailableSlotsByDay(flatDateTimes: Array<Date>, startDate: Date = null): void {
        this.slotStartDate = new Date(startDate.toString());
        for (var j = 0; j < 7; j++) {
            if (j > 0) {
                startDate.setDate(startDate.getDate() + 1);
            }
            this.availableTimeSlotsByDay.push(new SalesSchedule(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())));
        }

        flatDateTimes.forEach(availableTime => {
            var schedule = this.getSaleSchedule(availableTime);
            if (!!schedule) {
                schedule.times.push(availableTime);
            }
        });
    }

    private getSaleSchedule(availableTime: Date): SalesSchedule {
        var result = null;
        this.availableTimeSlotsByDay.forEach((schedule) => {
            if (schedule.dayOfTheWeek.getDate() === availableTime.getDate()) {
                result = schedule;
            }
        });

        return result;
    }

    public onSelectedMonthChanged(month: number) {
        const firstDayOfSelectedMonth = moment().month(this.monthList.indexOf(this.selectedMonth)).date(1).toDate();
        this.getSalesAvailableSlots(firstDayOfSelectedMonth);

    }

    public nextWeek(): void {
        var currentSlotLasttDay = this.availableTimeSlotsByDay[6].dayOfTheWeek; 
        var nextWeekFirstDay = new Date(currentSlotLasttDay.getFullYear(), currentSlotLasttDay.getMonth(), currentSlotLasttDay.getDate());
        nextWeekFirstDay.setDate(nextWeekFirstDay.getDate() + 1);
        this.getSalesAvailableSlots(nextWeekFirstDay);
    }

    public previousWeek(): void {
        var currentSlotfirsttDay = this.availableTimeSlotsByDay[0].dayOfTheWeek;
        var prevousWeekFirstDay = new Date(currentSlotfirsttDay.getFullYear(), currentSlotfirsttDay.getMonth(), currentSlotfirsttDay.getDate());
        prevousWeekFirstDay.setDate(prevousWeekFirstDay.getDate() - 7);
        this.getSalesAvailableSlots(prevousWeekFirstDay);
    }
}