import { RouterModule, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';
import {WorkingHours} from '../models/WorkingHours';
import {WeekWorkingHours} from '../models/WorkingHours';



@Injectable()
@ApiService("api/admin")
export class AppSettings extends UssApiService {

    mainCallPhone: string;
    siteToLike: string;
    facebookAppId: string;
    googleApiKey: string;
    translateApiUrl: string;

    workingHours: WorkingHours[];
    nonWorkingDays: string[];

    weekWorkingHours: WeekWorkingHours;

    constructor(http: Http) {
        super(http);

        this.mainCallPhone = '+1234567890';
        this.siteToLike = 'https://www.spray-net.com';
        this.facebookAppId = '773528466036157';
        this.googleApiKey = 'AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA';

        this.load().then((s: Settings[]) => {
            s.forEach(x => {
                this[x.key] = x.isJson ? JSON.parse(x.value) : x.value;
            });

            if (this.workingHours) {
                this.weekWorkingHours = new WeekWorkingHours(this.workingHours, this.nonWorkingDays);
            }
        });
    }

    @ApiMethod({ method: "GET", route: "settings", useBody: false })
    load(): Promise<Settings[]> {
        return this.request<Settings[]>().toPromise();
    }
}


@Injectable()
export class AppSettingsResolver implements Resolve<Settings[]> {
  constructor(private cs: AppSettings) {}
  resolve(): Promise<Settings[]> {
      return this.cs.load();
  }
}