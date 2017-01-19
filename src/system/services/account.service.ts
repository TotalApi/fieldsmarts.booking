import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {SystemService} from "../decorators/system-service.decorator";
import {UssApiService} from "./api.service";
import {ApiMethod} from "../decorators/api-method.decorator";
import {ApiService} from "../decorators/api-service.decorator";

// ReSharper disable InconsistentNaming
export class BearerLoginResponse {
    userName: string;
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
    '.expires': string;
    '.issued': string;
}
// ReSharper restore InconsistentNaming

@Injectable()
@ApiService("api/Account")
export class UssAccountService extends UssApiService {

/*
    @ApiMethod({ method: "GET", route: "{login}" })
    public Load(login: string): Promise<App.User> {
        return this.request<App.User>({ login }).toPromise();
    }
*/
    @ApiMethod({ method: "GET", route: "MyUserInfo" })
    public CurrentUserInfo(): Promise<User> {
        return this.request<User>().toPromise();
    }

    @ApiMethod({ method: "POST", route: "/token" })
    public Login(login: string, password: string): Promise<BearerLoginResponse> {
        return this.request<BearerLoginResponse>(`grant_type=password&username=${login}&password=${password}`).toPromise();
    }

/*
    @ApiMethod({ method: "POST", route: "Login" })
    public Login(login: string, password: string, rememberMe?: boolean): Promise<App.User> {
        return this.request<App.User>({ Login: login, Password: password, RememberMe: rememberMe }).toPromise();
    }

    @ApiMethod({ method: "POST", route: "Register" })
    public Register(login: string, password: string): Promise<App.User> {
        return this.request<App.User>({ Login: login, Password: password }).toPromise();
    }

    @ApiMethod({ method: "POST", route: "ForgotPassword" })
    public RestorePassword(email: string): Promise<void> {
        return this.request<void>({ Email: email }).toPromise();
    }

    @ApiMethod({ method: "POST", route: "ResetPassword" })
    public ResetPassword(email: string, password: string, code: string): Promise<App.User> {
        return this.request<App.User>({ Email: email, Password: password, Code: code }).toPromise();
    }

*/

}