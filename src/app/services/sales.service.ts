import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';

@Injectable()
@ApiService("api/sales")
export class SalesService extends UssApiService {
    constructor(http: Http) { super(http); }

    @ApiMethod({ method: "GET", route: "{p1}/{p2}/availabletimeslots?startingDate={p3}", useBody: false })
    getAvailableTimeSlots(franchisee: string, salesNumber: string, startingDate: Date): Promise<AvailableTimeSlots> {
        return this.request<AvailableTimeSlots>({ p1: franchisee, p2: salesNumber, p3: startingDate.toISOString().substring(0, 10) }).toPromise();
    }
    
}