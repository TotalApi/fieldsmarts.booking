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

export class SalesConsultant {
        public name: string;
        public franchise: string;
        public franchiseDisplayName: string;
        public pictureURL: string;
        public availableTimeSlots : Array<SalesSchedule>;
    }

    export class Sales extends SaleBase {
        constructor() {
            super();
            this.franchisee = null;
            this.salesNumber = null;
            this.isOther = false;
            this.isCommercial = false;
            this.address1 = "";
            this.address2 = "";
            this.city = "";
            this.state = "";
            this.country = "";
            this.preferredMethodOfContact = "EMAIL";
            this.preferredLanguage = "English";
            this.isOutOfBounds = false;
            this.lockedBy = null;
            this.lockedDate = null;
            this.isRepaintedSurface = false;
            this.isRustedSurface = false;
            this.isWoodSurface = false;
            this.isQualifiedLead = true;
        }

        public address1: string;
        public address2: string;
        public city: string;
        public state: string;
        public postCode: string;
        public country: string;
        public longitude: number;
        public latitude: number;
        public contactFirstName: string;
        public contactLastName: string;
        public contactPhone: string;
        public contactEmail: string;
        public isSiding: boolean;
        public isMasonry: boolean;
        public isWindows: boolean;
        public isDoors: boolean;
        public isOther: boolean;
        public isCommercial: boolean;
        public isQualifiedLead: boolean;
        public preferredMethodOfContact: string;
        public preferredLanguage: string;
        public formatedAddress: string;
        public salesConsultant: string;
        public salesConsultantTel: string;
        public status: string;
        public heardAboutUs: string;
        public isWoodSurface: boolean;
        public isRepaintedSurface: boolean;
        public isRustedSurface: boolean;
        public contractNumber: string;


        public validateContactFirstName = (value: any, model: Sales): string => {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTFIRSTNAMEREQUIRED";
            }
            return '';
        }

        public validateContactLastName = (value: any, model: Sales): string => {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTLASTNAMEREQUIRED";
            }
            return '';
        }

        public validateContactPhone = (value: any, model: Sales): string => {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTPHONEREQUIRED";
            } /*else if (!Util.IsValidPhoneNumber(value)) {
                return 'INVLIDPHONENUMBBER';
            }*/ else {
                return '';
            }
        }

        public validateContactEmail = (value: any, model: Sales): string => {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTEMAILREQUIRED";
            } /*else if (!Util.IsValidEmail(value)) {
                return 'INVLIDEMAIL';
            }*/ else {
                return '';
            }
        }
    }

export class PostBooking {
        public franchisee: string;
        public salesNumber: string;
        public notes: string;
        public timeSlot: Date;
    }

export class PostCodeAssignment {
        constructor() {
        }

        public postCode: string;
        public region: string;
        public salesConsultant: string;
        public order: number;
        public createdBy: string;
        public isCommercial: boolean;
        public isOutOfBounds: boolean;
    }

export class MarketingInfo {
        public franchisee: string;
        public salesNumber: string;
        public heardAboutUs: string;
    }

export class LookupItem {
    id: string;
    value: string;
}

export class Lookup {
    name: string;
    values: Array<LookupItem>;
    default: LookupItem;
}