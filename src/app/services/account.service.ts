import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';

@Injectable()
@ApiService("api/account")
export class AccountService extends UssApiService {

    @ApiMethod({ method: "GET", route: "userInfo?userName={p1}", useBody: false })
    getUserInfo(userName: string): Promise<any> {
        return this.request<any>({ p1: userName }).toPromise();
    }
    
}