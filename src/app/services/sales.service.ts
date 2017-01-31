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
import {Surface, TSurfaceType} from '../models/Surface';

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

    private getSurface(surfaceType: TSurfaceType): Surface {
        return this.wizard.data.surfaces.first((x: Surface) => x.name === surfaceType);
    }

    public fillSaleWithSurfaces(sale: Sales) {

        if (this.wizard.data.surfaces && this.wizard.data.surfaces.length > 0) {
            sale.isAluminiumSiding = this.getSurface('isAluminiumSiding').isSelected;
            sale.isVinylSiding = this.getSurface('isVinylSiding').isSelected;
            sale.isStucco = this.getSurface('isStucco').isSelected;
            sale.isAggregate = this.getSurface('isAggregate').isSelected;
            sale.isBrick = this.getSurface('isBrick').isSelected;
            sale.isFrontDoor = this.getSurface('isFrontDoor').isSelected;
            sale.isGarageDoor = this.getSurface('isGarageDoor').isSelected;
            sale.isWindows = this.getSurface('isWindows').isSelected;
            sale.isSoffits = this.getSurface('isSoffits').isSelected;
            sale.isOther = this.getSurface('isOther').isSelected;

            const isOther = this.getSurface('isOther');
            sale.otherSurfacesNotes = isOther.isSelected ? isOther.options as string : "";
        }
    }

    public async saveLead(): Promise<boolean> {
        let sale = new Sales();
        sale.isQualifiedLead = this.wizard.data.status === 'Lead';
        sale.status = this.wizard.data.status;
        sale.franchisee = this.wizard.data.franchise;
        sale.address1 = this.wizard.data.address;
        sale.contactEmail = this.wizard.data.email;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactLastName = this.wizard.data.lastName;
        sale.contactFirstName = this.wizard.data.firstName;
        sale.contactPhone = this.wizard.data.phoneNumber;
        sale.postCode = this.wizard.data.postalCode;
        sale.salesNumber = this.wizard.data.salesNumber;
        sale.isOutOfBounds = this.wizard.data.isOutOfBounds;       

        this.fillSaleWithSurfaces(sale);

        sale = await this.save(sale);
        this.wizard.data.salesNumber = sale.salesNumber;
        this.wizard.data.franchise = sale.franchisee;
        this.wizard.data.status = <any>sale.status || this.wizard.data.status;
        return true;
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