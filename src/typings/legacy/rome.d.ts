declare namespace rome {

    interface Options {
        /**
         * DOM element where the calendar will be appended to. Takes 'parent' as the parent element
         */
        appendTo?: HTMLElement;
        /**
         * When set to true, the calendar is auto-closed when picking a day (or a time if time?: true and date?: false).
         * A value of 'time' will only auto-close the calendar when a time is picked.
         */
        autoClose?: boolean;
        /**
         * Hides the calendar when focusing something other than the input field
         */
        autoHideOnBlur?: boolean;
        /**
         * Hides the calendar when clicking away
         */
        autoHideOnClick?: boolean;
        /**
         * The calendar shows days and allows you to navigate between months
         */
        date?: boolean;
        /**
         * Function to validate that a given date is considered valid.Receives a native Date parameter.
         */
        dateValidator?: Function;
        /**
         * Format string used to display days on the calendar
         */
        dayFormat?: string;
        /**
         * Value used to initialize calendar.Takes string, Date, or moment
         */
        initialValue?: DateTime;
        /**
         * Format string used for the input field as well as the results of rome
         */
        inputFormat?: string;
        /**
         * Ensures the date is valid when the field is blurred
         */
        invalidate?: boolean;
        /**
         * Compares input strictly against inputFormat, and partial matches are discarded
         */
        strictParse?: boolean;
        /**
         * Disallow dates past max.Takes string, Date, or moment
         */
        max?: DateTime;
        /**
         * Disallow dates before min.Takes string, Date, or moment
         */
        min?: DateTime;
        /**
         * Format string used by the calendar to display months and their year
         */
        monthFormat?: string;
        /**
         * How many months get rendered in the calendar
         */
        monthsInCalendar?: number;
        /**
         * Is the field required or do you allow empty values?
         */
        required?: boolean;
        /**
         * CSS classes applied to elements on the calendar
         */
        styles?: Object;
        /**
         * The calendar shows the current time and allows you to change it using a dropdown
         */
        time?: boolean;
        /**
         * Format string used to display the time on the calendar
         */
        timeFormat?: string;
        /**
         * Seconds between each option in the time dropdown
         */
        timeInterval?: number;
        /**
         * Function to validate that a given time is considered valid.Receives a native Date parameter.
         */
        timeValidator?: Function;
        /**
         * Format used to display weekdays.Takes min (Mo), short(Mon), long(Monday), or an array with seven strings of your choosing.
         */
        weekdayFormat?: string;
        /**
         * Day considered the first of the week.Range?: Sunday 0 - Saturday 6    
         */
        weekStart?: number;
    }

    type Event =
          'ready'       // [options]	The calendar has been .restored
        | 'destroyed'   // []	        The calendar has been .destroyed
        | 'data'        // [value]	    The date may have been updated by the calendar. Value of .getDateString() is provided
        | 'year'        // [year]	    The year may have been updated by the calendar. Value of moment.year() is provided
        | 'month'       // [month]	    The month may have been updated by the calendar. Value of moment.month() is provided
        | 'day'         // [day]	    The day may have been updated by the calendar. Value of moment.date() is provided
        | 'time'        // [time]	    The time may have been updated by the calendar. Formatted time string is provided
        | 'show'        // []	        The calendar has been displayed
        | 'hide'        // []	        The calendar has been hidden
        | 'back'        // [month]	    The calendar view has been moved back a month to the value moment.month()
        | 'next'        // [month]	    The calendar view has been moved forward a month to the value moment.month()
        ;

    interface Api {
        /**
         * Shows the calendar. If associated with an input, the calendar gets absolutely position right below the input field.
         */
        show(): void;

        /**
         * Hides the calendar.
         */
        hide(): void;

        /**
         * Auto - generated unique identifier assigned to this instance of Rome.
         */
        id: string;

        /**
         * The DOM element that contains the calendar.
         */
        container: HTMLElement;

        /**
         * The associated DOM element assigned to this calendar instance. This is the input field or parent element that you used to create the calendar.
         */
        associated: HTMLElement;

        /**
         * Returns the current date, as defined by the calendar, in a native Date object. If required: false you'll get null when the input field is empty.
         */
        getDate(): Date;

        /**
         * Returns the current date, as defined by the calendar, using the provided options. inputFormat format string or a format of your choosing.
         * If required: false you'll get null when the input field is empty.
         * @param format 
         */
        getDateString(format?: string): string;


        /**
         * Returns a copy of the moment object underlying the current date in the calendar.If required: false you'll get null when the input field is empty.
         */
        getMoment(): moment.Moment;

        /**
         * Removes the calendar from the DOM and all of its associated DOM event listeners.The only responsive API method becomes the .restore method described below, the rest of the API becomes no- op methods.After emitting the destroyed event, all event listeners are removed from the instance.
         */
        destroy(): void;


        /**
         * Returns true when the calendar is in a destroyed state and false otherwise.
         */
        destroyed: boolean;

        /**
         * Restores the calendar, using the provided options (or the default options). The associated DOM element can't be changed. The API methods are restored to their original functionality.
         * @param options 
         */
        restore(options?: Options): void;

        /**
         * If an options object is provided, it destroys the calendar and initializes it with the provided options.
         * Effectively the same as calling.restore(options) immediately after calling .destroy().
         * If no options object is provided, a copy of the current options is returned.
         * @param options 
         */
        options(options?: Options): void;

    
        /**
         * Resets the options to the factory defaults.Effectively the same as calling.options({}) while preserving the appendTo option.
         */
        reset(): void;

        /**
         * Emits all of the data events listed below.Mostly used internally, should be avoided in consumer - land.
         */
        emitValues(): void;

        /**
         * Subscribe on event
         */
        on(event: Event, fn: Function): void;

        /**
         * Sets the current date to the provided value, but only if that value is valid according to the rules defined by the calendar.
         * Takes string, Date, or moment.Mostly used internally, and it doesn't emit any events.
         * @param value 
         */
        setValue(value: DateTime): void;

        /**
         * Forces a refresh of the calendar. This method will redraw the month and update the dates that can be selected in accordance with dateValidator and timeValidator.
         */
        refresh(): void;

        /**
         * Steps the calendar display back by one month.Equivalent to clicking the 'back' button. Returns undefined.
         */
        back(): void;

        /**
         * Steps the calendar display forward by one month.Equivalent to clicking the 'next' button. Returns undefined.
         */
        next(): void;
    }

    interface ApiInstance {
        (elem: HTMLElement, options?: rome.Options): rome.Api;
        find(elem: HTMLElement): rome.Api;
        val: any;
        moment: moment.Moment;
        use(moment: moment.Moment);
    }
}