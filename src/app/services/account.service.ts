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
    public getUserInfo(userName: string): Promise<IUserInfo> {
        return this.request<IUserInfo>({ p1: userName }).toPromise();
    }
    
    @ApiMethod({ method: "GET", route: "{p1}/{p2}", useBody: false })
    public getUsersListByFranchiseByRole(franchise: string, role: string): Promise<User[]> {
        return this.request<User[]>({ p1: franchise, p2: role }).toPromise();
    }

    public async getFirstFranchisePartner(franchise: string): Promise<IUserInfo> {
        let users = await this.getUsersListByFranchiseByRole(franchise, 'FranchisePartner');
        if (users.any()) {
            let userInfo = await this.getUserInfo(users.first().userName);
            return userInfo;
        } else {
            return null;
        }
    }

}