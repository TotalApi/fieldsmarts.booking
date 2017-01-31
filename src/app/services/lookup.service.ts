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
import {Lookup, HeardAboutUsItem, LookupItem} from '../models/Sales';
import * as ng2Translate from 'ng2-translate';

@Injectable()
@ApiService("api/lookup")
export class LookupService extends UssApiService {

    public get url() {
        return this.translate.currentLang === 'fr' ? `api/fr/lookup` : `api/lookup`;
    }
    public set url(value: string) { }

    constructor(http: Http, private translate: ng2Translate.TranslateService) {
        super(http);
    }

    @ApiMethod({ method: "GET", route: "{p1}", useBody: false })
    getLookup<T extends LookupItem>(lookup: string): Promise<Lookup<T>> {
        
        return this.request<Lookup<T>>({ p1: lookup }).toPromise();
    }

    getHeardAboutUs(): Promise<Lookup<HeardAboutUsItem>> {
        return this.getLookup<HeardAboutUsItem>('HeardAboutUs');
    }

}