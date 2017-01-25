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
@AppService()
export class AppSettings {

    mainCallPhone: '+1234567890';
    siteToLike: 'http://aelitsoft.com';
    facebookAppId: '773528466036157';
    googleApiKey: 'AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA';

    constructor(settingsService: SettingsService) {
        settingsService.load().then(s => _.defaults(this, s));
    }
}

@Injectable()
@AppService()
export class SettingsService extends UssApiService {

    constructor(http: Http) {
        super(http);
    }

    load(): Promise<AppSettings> {
        return Promise.resolve({});
    }
}