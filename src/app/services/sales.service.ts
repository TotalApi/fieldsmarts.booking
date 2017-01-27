import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';
import {SalesConsultant} from '../models/Sales';
import {Sales} from '../models/Sales';
import {PostBooking} from '../models/Sales';
import {PostCodeAssignment} from '../models/Sales';
import {MarketingInfo} from '../models/Sales';
import {AppWizardService} from './wizard.service';

@Injectable()
@ApiService("api/sales")
export class SalesService extends UssApiService {

    constructor(http: Http, public wizard: AppWizardService) {
        super(http);
    }

    @ApiMethod({ method: "GET", route: "{p1}/{p2}/availabletimeslots?startingDate={p3}", useBody: false })
    getAvailableTimeSlots(franchisee: string, salesNumber: string, startingDate: Date): Promise<AvailableTimeSlots> {
        return this.request<AvailableTimeSlots>({ p1: franchisee, p2: salesNumber, p3: startingDate.toISOString() }).toPromise();
    }
    
    @ApiMethod({ method: "GET", route: "salesconsultant?postCode={p1}", useBody: false })
    getSalesConsultant(postalCode: string): Promise<SalesConsultant> {
            return this.request<SalesConsultant>({ p1: postalCode }).toPromise();
        }

    @ApiMethod({ method: "POST", useBody: true })
    save(sales: Sales): Promise<Sales> {
        return this.request<Sales>(sales).toPromise();
    }

    @ApiMethod({ method: "POST", route: "book", useBody: true })
    book(bookingModel: PostBooking): Promise<PostBooking> {
        return this.request<PostBooking>(bookingModel).toPromise();
    }

    @ApiMethod({ method: "GET", route: "postcodeassignment/{p1}/{p2}", useBody: false })
    getPostCodeAssignmentForSale(postcode: string, isCommercial: boolean): Promise<PostCodeAssignment> {
        return this.request<PostCodeAssignment>({ p1: postcode, p2: isCommercial }).toPromise();
    }

    @ApiMethod({ method: "POST", route: "marketinginfo", useBody: true })
    saveMarkeingInfo(marketingInfo: MarketingInfo): Promise<any> {
        return this.request<MarketingInfo>(marketingInfo).toPromise();
    }

    public async saveLead(): Promise<boolean> {
        let sale = new Sales();
        sale.isQualifiedLead = this.wizard.data.isQualifiedLead;
        sale.franchisee = this.wizard.data.franchise;
        sale.address1 = this.wizard.data.address;
        sale.contactEmail = this.wizard.data.email;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactLastName = this.wizard.data.lastName;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactPhone = this.wizard.data.phoneNumber;
        sale.postCode = this.wizard.data.postalCode;
        sale.salesNumber = this.wizard.data.salesNumber;
        sale = await this.save(sale);
        this.wizard.data.salesNumber = sale.salesNumber;
        this.wizard.data.franchise = sale.franchisee;
        return this.wizard.data.isQualifiedLead;
    }

    public async saveBookTime(): Promise<PostBooking> {
        let b = new PostBooking();
        b.franchisee = this.wizard.data.franchise;
        b.salesNumber = this.wizard.data.salesNumber;
        b.timeSlot = new Date(this.wizard.data.bookTime);

        b = await this.book(b);
        return b;
    }
}