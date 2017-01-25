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
import {Lookup} from '../models/Sales';

@Injectable()
@ApiService("api/lookup")
export class LookupService extends UssApiService {
    constructor(http: Http) { super(http); }

    @ApiMethod({ method: "GET", route: "{p1}", useBody: false })
    getLookup(lookup: string): Promise<Lookup> {
        return this.request<Lookup>({ p1: lookup }).toPromise();
    }

    getHeardAboutUs(): Promise<Lookup> {
        return this.getLookup('HeardAboutUs');
    }

}