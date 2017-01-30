import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';

@Injectable()
@ApiService("api/admin")
export class AppSettings extends UssApiService {

    mainCallPhone: string;
    siteToLike: string;
    facebookAppId: string;
    googleApiKey: string;
    translateApiUrl: string;

    constructor(http: Http) {
        super(http);

        this.mainCallPhone = '+1234567890';
        this.siteToLike = 'http://aelitsoft.com';
        this.facebookAppId = '773528466036157';
        this.googleApiKey = 'AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA';
        this.translateApiUrl = 'http://192.168.3.202:7202/locales';

        this.load().then((s: Settings[]) => {
            s.forEach(x => this[x.key] = x.value);
        });
    }

    @ApiMethod({ method: "GET", route: "settings", useBody: false })
    load(): Promise<Settings[]> {
        return this.request<Settings[]>().toPromise();
    }
}
