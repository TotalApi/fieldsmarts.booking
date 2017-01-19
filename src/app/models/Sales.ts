export class SaleBase {

        public franchisee: string;
        public region: string;
        public salesNumber: string;
        public lastQuotationNumber: string;
        public contactPhone: string;
        public contactEmail: string;
        public isOutOfBounds: boolean;
        public lockedBy: string;
        public lockedDate: Date;
    }

export class AvailableTimeSlots extends SaleBase {
        public region: string;
        public contactName: string;
        public address: string;
        public salesConsultantDisplayName: string;
        public salesConsultantPictureURL: string;
        public availableTimeSlots = new Array<Date>();
    }

export class SalesSchedule {
       public constructor(public dayOfTheWeek: Date) {
            this.times = new Array<Date>();
       }
       public times:Array<Date>;
    }