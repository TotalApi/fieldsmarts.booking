export class WorkingHours {
    public day: number;
    public startTime: string;
    public endTime: string;
}

export class WeekWorkingHours {
    public workingHours: WorkingHours[] = [];
    public nonWorkingDays: moment.Moment[] = [];
    
    constructor(workingHours?: WorkingHours[], nonWorkingDays?: string[]) {
        this.workingHours = workingHours || [];
        this.nonWorkingDays = (nonWorkingDays || []).select(x => { return moment(x, 'DD.MM').startOf('day'); }).toArray();
    }

    public isCallAvaliableForNow(): boolean {
        let now = moment();
        let dayOfWeek = now.isoWeekday();

        let day = this.workingHours.firstOrDefault(x => x.day === dayOfWeek);

        let callAvaliable = false;
        if (day) {
            let timeStart = moment(day.startTime, 'H:mm');
            let timeEnd = moment(day.endTime, 'H:mm');

            callAvaliable = now.isSameOrAfter(timeStart) && now.isBefore(timeEnd) && !this.nonWorkingDays.any(x => x.isSame(now.startOf('day')));
        }

        return callAvaliable;
    }
}