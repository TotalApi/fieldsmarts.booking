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

@Injectable()
@ApiService("api/sales")
export class SalesService extends UssApiService {
    constructor(http: Http) { super(http); }

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

    @ApiMethod({ method: "GET", route: "postcodeassignment/{p1}/{p2}", useBody: true })
    getPostCodeAssignmentForSale(postcode: string, isCommercial: boolean): Promise<PostCodeAssignment> {
        return this.request<PostCodeAssignment>({ p1: postcode, p2: isCommercial }).toPromise();
    }
}