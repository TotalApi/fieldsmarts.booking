"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var system_1 = require("src/system");
var ng2_translate_1 = require("ng2-translate/ng2-translate");
var Sales_1 = require("../../models/Sales");
var sales_service_1 = require("../../services/sales.service");
var Sales_2 = require("../../models/Sales");
var wizard_service_1 = require("../../services/wizard.service");
var TimeBookingComponent = TimeBookingComponent_1 = (function () {
    function TimeBookingComponent(sales, router, location, translate, wizard) {
        this.sales = sales;
        this.router = router;
        this.location = location;
        this.translate = translate;
        this.wizard = wizard;
        this.availableTimeSlotsByDay = [];
        this.monthList = [];
        this.availableTimeSlots = [];
        this.allTimeSlots = [];
        this.hasPrevious = false;
        this.dayTime = 'morning';
        this.selectedTime = new Date(wizard.data.bookTime);
    }
    TimeBookingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.populateMonthList('en');
        this.getSalesAvailableSlots(moment().toDate()).then(function () {
            _this.configurateTimeSlots();
        });
    };
    TimeBookingComponent.prototype.configurateTimeSlots = function () {
        this.allTimeSlots = [];
        var times = this.availableTimeSlotsByDay.selectMany(function (x) { return x.times; });
        this.minTime = moment(times.minBy(function (x) { return x; })).year(moment().year()).month(moment().month()).date(moment().date());
        this.maxTime = moment(times.maxBy(function (x) { return x; })).year(moment().year()).month(moment().month()).date(moment().date());
        switch (this.dayTime) {
            case 'morning':
                this.maxTime = moment(this.maxTime).hours(11).minutes(30);
                break;
            case 'afternoon':
                this.minTime = moment(this.minTime).hours(12).minutes(0);
                this.maxTime = moment(this.maxTime).hours(17).minutes(30);
                break;
            case 'evening':
                this.minTime = moment(this.minTime).hours(18).minutes(0);
                break;
            default:
        }
        var currentTime = moment(this.minTime);
        while (currentTime.isSameOrBefore(this.maxTime, "minute")) {
            this.allTimeSlots.push({ date: currentTime.toDate(), formatted: currentTime.format("H:mm A") });
            currentTime.add(30, "minute");
        }
    };
    TimeBookingComponent.prototype.isSelected = function (day, time) {
        var m = moment(day.dayOfTheWeek);
        var t = moment(time).year(m.year()).month(m.month()).date(m.date()).toDate();
        return !!day.dayOfTheWeek &&
            !!this.selectedTime &&
            t.getDate() === this.selectedTime.getDate() &&
            t.getHours() === this.selectedTime.getHours() &&
            t.getMinutes() === this.selectedTime.getMinutes();
    };
    TimeBookingComponent.prototype.isTimeAvailable = function (day, time) {
        var m = moment(day.dayOfTheWeek);
        var t = moment(time).year(m.year()).month(m.month()).date(m.date()).toDate();
        return day.times.any(function (e) { return moment(e).isSame(moment(t)); });
    };
    TimeBookingComponent.prototype.bookTime = function (day, time) {
        var t = moment(time);
        this.selectedTime = moment(day.dayOfTheWeek).hours(t.hours()).minutes(t.minutes()).seconds(t.seconds()).toDate();
        this.wizard.data.bookTime = this.selectedTime;
    };
    TimeBookingComponent.prototype.isToday = function (date) {
        return moment(date).isSame(moment().startOf('day'));
    };
    TimeBookingComponent.getMonthNameBy = function (index, langCode) {
        var monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthNameFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        if (langCode === 'fr') {
            return monthNameFr[index];
        }
        return monthNamesEn[index];
    };
    TimeBookingComponent.prototype.populateMonthList = function (lang) {
        var langCode = localStorage[lang];
        this.monthList = new Array();
        for (var i = 0; i < 12; i++) {
            this.monthList.push(TimeBookingComponent_1.getMonthNameBy(i, langCode));
        }
    };
    TimeBookingComponent.prototype.getSalesAvailableSlots = function (startDate) {
        var _this = this;
        this.availableTimeSlotsByDay = new Array();
        return this.sales.getAvailableTimeSlots(this.franchise, this.salesNumber, startDate).then(function (response) {
            var availableTimeSlotsStrings = response.availableTimeSlots;
            _this.availableTimeSlots = new Array();
            for (var i = 0; i < availableTimeSlotsStrings.length; i++) {
                var date = moment(availableTimeSlotsStrings[i].toString()).utc().toDate();
                _this.availableTimeSlots.push(date);
            }
            _this.populateAvailableSlotsByDay(_this.availableTimeSlots, startDate);
            var currentWeekMonth = _this.availableTimeSlots[0].getMonth();
            _this.selectedMonth = _this.monthList.first(function (x, idx) { return idx === currentWeekMonth; });
        });
    };
    TimeBookingComponent.prototype.populateAvailableSlotsByDay = function (flatDateTimes, startDate) {
        var _this = this;
        if (startDate === void 0) { startDate = null; }
        this.slotStartDate = new Date(startDate.toString());
        for (var j = 0; j < 7; j++) {
            if (j > 0) {
                startDate.setDate(startDate.getDate() + 1);
            }
            this.availableTimeSlotsByDay.push(new Sales_1.SalesSchedule(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())));
        }
        flatDateTimes.forEach(function (availableTime) {
            var schedule = _this.getSaleSchedule(availableTime);
            if (!!schedule) {
                schedule.times.push(availableTime);
            }
        });
    };
    TimeBookingComponent.prototype.getSaleSchedule = function (availableTime) {
        var result = null;
        this.availableTimeSlotsByDay.forEach(function (schedule) {
            if (schedule.dayOfTheWeek.getDate() === availableTime.getDate()) {
                result = schedule;
            }
        });
        return result;
    };
    TimeBookingComponent.prototype.onSelectedMonthChanged = function (month) {
        var firstDayOfSelectedMonth = moment().month(this.monthList.indexOf(this.selectedMonth)).date(1).toDate();
        this.getSalesAvailableSlots(firstDayOfSelectedMonth);
    };
    TimeBookingComponent.prototype.nextWeek = function () {
        var currentSlotLasttDay = this.availableTimeSlotsByDay[6].dayOfTheWeek;
        var nextWeekFirstDay = new Date(currentSlotLasttDay.getFullYear(), currentSlotLasttDay.getMonth(), currentSlotLasttDay.getDate());
        nextWeekFirstDay.setDate(nextWeekFirstDay.getDate() + 1);
        this.getSalesAvailableSlots(nextWeekFirstDay);
    };
    TimeBookingComponent.prototype.previousWeek = function () {
        var currentSlotfirsttDay = this.availableTimeSlotsByDay[0].dayOfTheWeek;
        var prevousWeekFirstDay = new Date(currentSlotfirsttDay.getFullYear(), currentSlotfirsttDay.getMonth(), currentSlotfirsttDay.getDate());
        prevousWeekFirstDay.setDate(prevousWeekFirstDay.getDate() - 7);
        this.getSalesAvailableSlots(prevousWeekFirstDay);
    };
    TimeBookingComponent.prototype.ngOnChanges = function (changes) {
        var dayTime = changes['dayTime'];
        if (!!dayTime && this.availableTimeSlotsByDay.length > 0) {
            this.configurateTimeSlots();
        }
    };
    TimeBookingComponent.prototype.saveBookTime = function () {
        var b = new Sales_2.PostBooking();
        b.franchisee = this.franchise;
        b.salesNumber = this.salesNumber;
        b.timeSlot = this.selectedTime;
        this.sales.book(b).catch(function (e) {
        });
    };
    return TimeBookingComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TimeBookingComponent.prototype, "dayTime", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TimeBookingComponent.prototype, "franchise", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TimeBookingComponent.prototype, "salesNumber", void 0);
TimeBookingComponent = TimeBookingComponent_1 = __decorate([
    core_1.Component({
        selector: 'time-booking',
        templateUrl: './time-booking.component.html',
        styleUrls: ['./time-booking.component.scss']
    }),
    system_1.AppComponent(),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        router_1.Router,
        common_1.Location,
        ng2_translate_1.TranslateService,
        wizard_service_1.AppWizardService])
], TimeBookingComponent);
exports.TimeBookingComponent = TimeBookingComponent;
var TimeBookingComponent_1;
//# sourceMappingURL=time-booking.component.js.map