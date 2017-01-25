"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require("@angular/http");
var http_service_1 = require("./http.service");
var account_service_1 = require("./account.service");
var core_1 = require("@angular/core");
var moment = require("moment");
var Reflection_1 = require("../utils/Reflection");
var system_service_decorator_1 = require("../decorators/system-service.decorator");
var UssAuthService = UssAuthService_1 = (function () {
    function UssAuthService(account, _http) {
        this.account = account;
        this._http = _http;
        this.storageKey = 'app_auth';
        this.onAuthEvent = new core_1.EventEmitter();
        /**
         * Информация о текущем залогиненом пользователе
         */
        this.LoggedUser = {};
        /**
         * Информация о логине текущего пользователя
         */
        this.LoggedUserName = localStorage.getItem(this.storageKey + "_login");
        /**
         * Информация о текущем токене залогиненого пользователя
         */
        this.AccessToken = localStorage.getItem(this.storageKey + "_access");
        /**
         * Время до которого текущий токен валиден
         */
        this.AccessTokenExpires = moment(localStorage.getItem(this.storageKey + "_exp"));
        if (_http instanceof http_service_1.UssHttp) {
            // Прописываем информацию о менеджере аутентификации в расширенный Http-сервис.
            // Сделать это чере DI невозможно из-за взаимных ссылок друг на друга.
            _http.AuthorizationManager = this;
        }
        if (this.IsLoggedIn) {
            // Восстанавливаем данные о текущем пользователе из локального хранилища.
            this.LoggedUser = {
                userName: localStorage.getItem(this.storageKey + "_uid"),
                role: localStorage.getItem(this.storageKey + "_urole"),
            };
            // Обновим данные о пользователе
            this.updateUserInfo();
        }
    }
    Object.defineProperty(UssAuthService, "Instance", {
        get: function () { return Reflection_1.Reflection.Injector.get(UssAuthService_1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UssAuthService.prototype, "IsLoggedIn", {
        /**
         * Признак, что пользователь залогинен
         * @returns {}
         */
        get: function () {
            // проверяем наличие полученного токена и ппроверяем, не просрочен ли он
            var res = !!this.AccessToken && this.AccessTokenExpires > moment().local();
            if (!res && this.AccessToken) {
                // если токен есть, но просрочен - очищаем данные о нём
                this.Logout();
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Обновляет информацию о пользователе.
     */
    UssAuthService.prototype.updateUserInfo = function (userNameOrId) {
        var _this = this;
        //userNameOrId = userNameOrId || localStorage.getItem(`${this.storageKey}_uid`) || this.LoggedUserName;
        return this.account.CurrentUserInfo()
            .then(function (user) {
            _this.LoggedUser = user;
            if (user) {
                localStorage.setItem(_this.storageKey + "_uid", user.userName);
                localStorage.setItem(_this.storageKey + "_urole", user.role);
                var ev = { action: UssAuthService_1.Event.loggedIn, user: user };
                _this.onAuthEvent.emit(ev);
            }
            else {
                _this.Logout();
            }
            return user;
        });
    };
    UssAuthService.prototype.Login = function (login, password /*, rememberMe: boolean = true*/) {
        var _this = this;
        return this.account.Login(login, password)
            .then(function (r) {
            _this.LoggedUserName = r.userName;
            _this.AccessToken = r.access_token;
            //this.AccessTokenExpires = moment(r['.expires']);
            _this.AccessTokenExpires = moment().local().add(r.expires_in, "s");
            localStorage.setItem(_this.storageKey + "_login", _this.LoggedUserName);
            localStorage.setItem(_this.storageKey + "_access", _this.AccessToken);
            localStorage.setItem(_this.storageKey + "_exp", _this.AccessTokenExpires.format());
            return _this.updateUserInfo();
        });
    };
    UssAuthService.prototype.Logout = function (noReload) {
        //sessionStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.storageKey + "_access");
        localStorage.removeItem(this.storageKey + "_login");
        localStorage.removeItem(this.storageKey + "_access");
        localStorage.removeItem(this.storageKey + "_exp");
        localStorage.removeItem(this.storageKey + "_uid");
        localStorage.removeItem(this.storageKey + "_uemail");
        localStorage.removeItem(this.storageKey + "_urole");
        var user = this.LoggedUser;
        this.LoggedUser = {};
        this.LoggedUserName = null;
        this.AccessToken = null;
        this.AccessTokenExpires = null;
        var ev = { action: UssAuthService_1.Event.loggedOut, user: user };
        this.onAuthEvent.emit(ev);
    };
    return UssAuthService;
}());
UssAuthService.Event = { loggedIn: 'loggedIn', loggedOut: 'loggedOut' };
UssAuthService = UssAuthService_1 = __decorate([
    core_1.Injectable(),
    system_service_decorator_1.SystemService(),
    __metadata("design:paramtypes", [account_service_1.UssAccountService, http_1.Http])
], UssAuthService);
exports.UssAuthService = UssAuthService;
exports.auth = {
    Event: UssAuthService.Event,
    get IsLoggedIn() { return UssAuthService.Instance.IsLoggedIn; },
    get LoggedUser() { return UssAuthService.Instance.LoggedUser; },
    get LoggedUserName() { return UssAuthService.Instance.LoggedUserName; },
    get AccessToken() { return UssAuthService.Instance.AccessToken; },
    get AccessTokenExpires() { return UssAuthService.Instance.AccessTokenExpires; },
    Login: function (login, password) { return UssAuthService.Instance.Login(login, password); },
    Logout: function (noReload) { return UssAuthService.Instance.Logout(noReload); },
};
var UssAuthService_1;
//# sourceMappingURL=auth.service.js.map