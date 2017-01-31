const MS_IN_MINUTES = 60 * 1000;

export class CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    description: string;
    address: string;
    duration: number;
}

export class AddToCalendar {

    private static formatTime(date): string {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }

    private static calculateEndTime(event: CalendarEvent): string {
        return event.end
            ? this.formatTime(event.end)
            : this.formatTime(new Date(event.start.getTime() + (event.duration * MS_IN_MINUTES)));
    }

    public static google(event: CalendarEvent) {
          const startTime = this.formatTime(event.start);
          const endTime = this.calculateEndTime(event);

          const href = encodeURI([
              //'https://www.google.com/calendar/render',
              'https://www.google.com/calendar/gp#~calendar:view=e&bm=1&trp=false',
              '&action=TEMPLATE',
              '&text=' + (event.title || ''),
              '&dates=' + (startTime || ''),
              '/' + (endTime || ''),
              '&details=' + (event.description || ''),
              '&location=' + (event.address || ''),
              '&sprop=&sprop=name:'
          ].join(''));
          return href;
      }

    public static ics(event: CalendarEvent) {
          const startTime = this.formatTime(event.start);
          const endTime = this.calculateEndTime(event);

          const href = encodeURI(
              'data:text/calendar;charset=utf8,' + [
                  'BEGIN:VCALENDAR',
                  'VERSION:2.0',
                  'BEGIN:VEVENT',
                  'URL:' + document.URL,
                  'DTSTART:' + (startTime || ''),
                  'DTEND:' + (endTime || ''),
                  'SUMMARY:' + (event.title || ''),
                  'DESCRIPTION:' + (event.description || ''),
                  'LOCATION:' + (event.address || ''),
                  'END:VEVENT',
                  'END:VCALENDAR'].join('\n'));

          return href;
      }

  
    public static ical(event: CalendarEvent) {
      return this.ics(event);
    }
}

