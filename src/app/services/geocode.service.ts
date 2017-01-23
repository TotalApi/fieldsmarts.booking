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
@ApiService("https://maps.googleapis.com/maps/api/geocode")
export class GeocodeService extends UssApiService {
    constructor(http: Http) { super(http); }

    public static GOOGLEAPIKEY = "AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA";

    @ApiMethod({ method: "GET", route: "json?address={p1}&key={p2}", useBody: false })
    getSuggestedAddess(address: string): Promise<any> {
        return this.request<any>({ p1: address, p2: GeocodeService.GOOGLEAPIKEY }).toPromise();
    }
}