import { Http } from "@angular/http";
import { UssHttp } from "./http.service";
import { UssAccountService } from "./account.service";
import { Injectable, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Reflection } from '../utils/Reflection';
import {SystemService} from '../decorators/system-service.decorator';

export interface UssAuthServiceEvent {
    action: 'loggedIn' | 'loggedOut';
    user: App.User;
}

export interface IUssAuthService {
    Event: { loggedIn: string, loggedOut: string };
    /**
     * Признак, что пользователь залогинен
     */
    IsLoggedIn: boolean;
    /**
     * Информация о текущем залогиненом пользователе
     */
    LoggedUser: App.User;

    /**
     * Информация о логине текущего пользователя
     */
    LoggedUserName: string;

    /**
     * Информация о текущем токене залогиненого пользователя
     */
    AccessToken: string;

    /**
     * Время до которого текущий токен валиден
     */
    AccessTokenExpires: moment.Moment;

    Login(login: string, password: string): Promise <App.User>;
    Logout(noReload?: boolean): Promise<void>;
    Register(login: string, password: string): Promise<App.User>;
    RestorePassword(email: string): Promise<void>;
    ResetPassword(email: string, password: string, code: string): Promise<App.User>;
}

@Injectable()
@SystemService()
export class UssAuthService {
    private storageKey: string = 'app_auth';

    public static Event = { loggedIn: 'loggedIn' , loggedOut: 'loggedOut' };

    public static get Instance(): UssAuthService { return  Reflection.Injector.get(UssAuthService); }

    public onAuthEvent = new EventEmitter<UssAuthServiceEvent>();

    constructor(private account: UssAccountService, private _http: Http) {
        if (_http instanceof UssHttp) {
            // Прописываем информацию о менеджере аутентификации в расширенный Http-сервис.
            // Сделать это чере DI невозможно из-за взаимных ссылок друг на друга.
            _http.AuthorizationManager = <any>this;
        }

        if (this.IsLoggedIn) {
            // Восстанавливаем данные о текущем пользователе из локального хранилища.
            this.LoggedUser = <App.User>{
                Id: localStorage.getItem(`${this.storageKey}_uid`),
                UserName: localStorage.getItem(`${this.storageKey}_login`),
                Email: localStorage.getItem(`${this.storageKey}_uemail`),
                UserRole: parseInt(localStorage.getItem(`${this.storageKey}_urole`)),
            }
            // Обновим данные о пользователе
            this.updateUserInfo();
        }
    }

    /**
     * Признак, что пользователь залогинен
     * @returns {} 
     */
    public get IsLoggedIn(): boolean {
        // проверяем наличие полученного токена и ппроверяем, не просрочен ли он
        const res = !!this.AccessToken && this.AccessTokenExpires > moment().local();
        if (!res && this.AccessToken) {
            // если токен есть, но просрочен - очищаем данные о нём
            this.Logout();
        }
        return res;
    }

    /**
     * Информация о текущем залогиненом пользователе
     */
    public LoggedUser = <App.User>{};

    /**
     * Информация о логине текущего пользователя
     */
    public LoggedUserName: string = localStorage.getItem(`${this.storageKey}_login`);

    /**
     * Информация о текущем токене залогиненого пользователя
     */
    public AccessToken: string = localStorage.getItem(`${this.storageKey}_access`);

    /**
     * Время до которого текущий токен валиден
     */
    public AccessTokenExpires: moment.Moment = moment(localStorage.getItem(`${this.storageKey}_exp`));

    /**
     * Обновляет информацию о пользователе.
     */
    private updateUserInfo(userNameOrId?: string): Promise<App.User> {
        userNameOrId = userNameOrId || localStorage.getItem(`${this.storageKey}_uid`) || this.LoggedUserName;
        return this.account.Load(userNameOrId)
            .then(user => {
                this.LoggedUser = user;
                if (user) {
                    localStorage.setItem(`${this.storageKey}_uid`, user.Id);
                    localStorage.setItem(`${this.storageKey}_uemail`, user.Email);
                    localStorage.setItem(`${this.storageKey}_urole`, user.UserRole ? user.UserRole.toString() : '0');

                    const ev = <UssAuthServiceEvent>{ action: UssAuthService.Event.loggedIn, user };
                    this.onAuthEvent.emit(ev);
                } else {
                    this.Logout();
                }
                return user;
            });
    }

    public Login(login: string, password: string/*, rememberMe: boolean = true*/): Promise<App.User> {
        return this.account.BearerLogin(login, password)
            .then(r => {
                this.LoggedUserName = r.userName;
                this.AccessToken = r.access_token;
                //this.AccessTokenExpires = moment(r['.expires']);
                this.AccessTokenExpires = moment().local().add(r.expires_in, "s");
                localStorage.setItem(`${this.storageKey}_login`, this.LoggedUserName);
                localStorage.setItem(`${this.storageKey}_access`, this.AccessToken);
                localStorage.setItem(`${this.storageKey}_exp`, this.AccessTokenExpires.format());
                return this.updateUserInfo();
            });
    }

    public Logout(noReload?: boolean): Promise<void> {
        //sessionStorage.removeItem(this.tokenKey);
        localStorage.removeItem(`${this.storageKey}_access`);
        localStorage.removeItem(`${this.storageKey}_login`);
        localStorage.removeItem(`${this.storageKey}_access`);
        localStorage.removeItem(`${this.storageKey}_exp`);
        localStorage.removeItem(`${this.storageKey}_uid`);
        localStorage.removeItem(`${this.storageKey}_uemail`);
        localStorage.removeItem(`${this.storageKey}_urole`);
        const user = this.LoggedUser;
        this.LoggedUser = <App.User>{};
        this.LoggedUserName = null;
        this.AccessToken = null;
        this.AccessTokenExpires = null;
        const ev = <UssAuthServiceEvent>{ action: UssAuthService.Event.loggedOut, user };
        this.onAuthEvent.emit(ev);
        return this.account.Logout();
    }

    public Register(login: string, password: string): Promise<App.User> {
        return this.account.Register(login, password).then(() => this.Login(login, password));
    }

    public RestorePassword(email: string): Promise<void> {
        return this.account.RestorePassword(email);
    }

    public ResetPassword(email: string, password: string, code: string): Promise<App.User> {
        return this.account.ResetPassword(email, password, code).then(u => this.Login(u.UserName, password));
    }
}

export var auth: IUssAuthService =
{
    Event: UssAuthService.Event,
    get IsLoggedIn() { return UssAuthService.Instance.IsLoggedIn; },
    get LoggedUser() { return UssAuthService.Instance.LoggedUser; },
    get LoggedUserName() { return UssAuthService.Instance.LoggedUserName; },
    get AccessToken() { return UssAuthService.Instance.AccessToken; },
    get AccessTokenExpires() { return UssAuthService.Instance.AccessTokenExpires; },
    Login: (login, password) => UssAuthService.Instance.Login(login, password),
    Logout: (noReload) => UssAuthService.Instance.Logout(noReload),
    Register: (login, password) => UssAuthService.Instance.Register(login, password),
    ResetPassword: (email, password, code) => UssAuthService.Instance.ResetPassword(email, password, code),
    RestorePassword: (email) => UssAuthService.Instance.RestorePassword(email),
}