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
@ApiService("api/franchise")
export class FranchiseService extends UssApiService {

    @ApiMethod({ method: "GET", route: "" })
    load(): Promise<IFranshise[]> {
        return this.request<IFranshise[]>().toPromise();
    }
    @ApiMethod({ method: "GET", route: "?franchisee={franchisee}&region={region}", useBody: false })
    get(franchisee: string, region: string): Promise<IFranshise> {
        if (!region) {
            return this.load().then(r => r.firstOrDefault(f => f.name === franchisee));
        } else {
            return this.request<IFranshise>({ franchisee, region }).toPromise();    
        }
    }
}