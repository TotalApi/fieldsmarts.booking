import * as utils from "../utils/utils";
import {isDevMode}  from '@angular/core';
import {Json} from "../utils/Json";
import {Injectable} from '@angular/core';
import {Http, Headers, ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/Observable/ErrorObservable';
import {UssAuthService as Auth } from "./auth.service";
import {UssMessagesService, MessageType} from "./messages.service";
import {Reflection} from '../utils/Reflection';
import {TranslateService} from 'ng2-translate/ng2-translate';


export class UssHttp extends Http {

    public static baseAddress: string = BACKEND_ADDRESS;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private msg: UssMessagesService) {
        super(backend, defaultOptions);
    }

    public AuthorizationManager: Auth;

    private static translate: TranslateService;

    public static get Instance(): Http { return Reflection.Injector.get(Http); }

    private createAuthorizationHeader(url: string | Request, options?: RequestOptionsArgs): RequestOptionsArgs {
        if (UssHttp.translate === undefined) {
            try { UssHttp.translate = Reflection.Injector.get(TranslateService) } catch (e) { UssHttp.translate = null; }
        }
        let uri: string;
        if (url instanceof Request) {
            uri = url.url;
            options = url;
        }
        else
            uri = url;
        if (uri.indexOf('://') === -1 || (UssHttp.baseAddress && uri.StartsWith(UssHttp.baseAddress + '/', true))) {
            options = options || {};
            options.headers = options.headers || new Headers();
            if (this.AuthorizationManager && this.AuthorizationManager.IsLoggedIn) {
                options.headers.append('Authorization', `Bearer ${this.AuthorizationManager.AccessToken}`);
            }
            if (UssHttp.translate && UssHttp.translate.currentLang) {
                options.headers.append('X-Language', UssHttp.translate.currentLang);
            }
        }
        return options;
    }

    public static updateUrl(uri: string | Request): string | Request | any {
        var url: string = <any>uri;
        if (uri instanceof Request) {
            url = uri.url;
        }
        if (url && UssHttp.baseAddress && url.indexOf('/') !== 0 && url.indexOf('://') === -1) {
            url = `${UssHttp.baseAddress}/${url}`;
        }
        if (uri instanceof Request) {
            uri.url = url;
        } else {
            uri = url;
        }
        return uri;
    }

    /**
     * Выделяет ошибку из ответа серевера, возникшую при вызове методов сервиса.
     */
    public static ExctractError(err: any): string {
        if (err instanceof Response) {
            try {
                err = this.ExctractError(err.json()) || err;
            } catch (e) {
                //return err.toString();
                return "";
            } 
        }
        let error = (err || "Fatal error").toString();
        if (!err) return error;
        if (utils.isArray(err.data)) {
            error = (<any[]>(err.data)).select(x => this.ExctractError(x)).aggregate("", (prev, current) => prev ? prev + "\r\n" + current : current);
        }
        else if (typeof err.data === "object") {
            if (err.data.ModelState && typeof err.data.ModelState === "object")
                error = Enumerable.from(err.data.ModelState).select(kv => kv.value).toArray().join("<br/>");
            else
                error = (err.data.ExceptionMessage == undefined) ? err.data.Message : err.data.ExceptionMessage;
            if (!error && err.data.result) {
                if (typeof err.data.result === "string")
                    error = err.data.result;
                else if (typeof err.data.result === "object")
                    error = (err.data.result.ExceptionMessage == undefined) ? err.data.result.Message : err.data.result.ExceptionMessage;
            }
        }
        else if (err.ExceptionMessage !== undefined)
            error = err.ExceptionMessage.toString();
        else if (err.statusText !== undefined)
            error = err.statusText.toString();
        else if (err.data !== undefined)
            error = err.data.toString().substr(0, 100);
        else if (err.Message !== undefined)
            error = err.Message.toString();
        else if (err.error_description !== undefined || err.error !== undefined)
            error = (err.error_description || err.error).toString();
        else if (err.message) {
            error = err.message;
            if (Json.IsJsonLike(error)) {
                err = Json.fromJson(error);
                if (err.errorCode) {
                    error = UssHttp.translate.instant(err.errorCode);
                    if (err.developerMessage && isDevMode) {
                        error = `${error}<hr/>${err.developerMessage}`;
                    }
                } else {
                    error = this.ExctractError(err) || err;    
                }
                
            }
        }
        error = (error || '').replace(/(?:\r\n|\r|\n)/g, '<br/>');

        if (error === '[object ProgressEvent]')
            error = 'Connection to API is lost.';
        return error;
    }

    /**
     * Обрабатывает ошибку, возникшую при вызове методов сервиса.
     */
    public ProcessError(err: any): string {
        const error = UssHttp.ExctractError(err);
        if (error) {
            if (this.msg)
                this.msg.runtimeError(error);
            else
                console.error(error);
        }
        return error;
    }

    /**
     * Обрабатывает ошибку, возникшую при вызове методов сервиса.
     */
    public HandleError(error: any): ErrorObservable<string> {
        return Observable.throw(this.ProcessError(error));
    }

    public static TransformServiceResponse(data: any, headers?: Headers, isArray: boolean = false): any {
        // Copied from Angular default transform method
        if (utils.isString(data)) {
            // Strip json vulnerability protection prefix and trim whitespace
            var tempData = data.replace(Json.JSON_PROTECTION_PREFIX, '').trim();

            if (tempData) {
                var contentType = headers && headers.get('Content-Type');
                if ((contentType && (contentType.indexOf(Json.APPLICATION_JSON) === 0)) || Json.IsJsonLike(tempData)) {
                    data = Json.ResolveReferences(Json.fromJson(tempData));
                    if (isArray && !utils.isArray(data))
                        data = [data];
                }
            }
        }
/*
        if (!angular.isJsObject(data))
            data = { result: data };
*/
        return data;
    }


    public static HandleResponse(response: Observable<Response>) {
        return response.map((value: Response) => this.TransformServiceResponse(value.text(), value.headers));
    }

    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }

/*
    /**
     * Performs a request with `get` http method.
     #1#
    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }

    /**
     * Performs a request with `post` http method.
     #1#
    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(UssHttp.updateUrl(url), body, this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }

    /**
     * Performs a request with `put` http method.
     #1#
    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(UssHttp.updateUrl(url), body, this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }
    /**
     * Performs a request with `delete` http method.
     #1#
    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }
    /**
     * Performs a request with `patch` http method.
     #1#
    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.patch(UssHttp.updateUrl(url), body, this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }
    /**
     * Performs a request with `head` http method.
     #1#
    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.head(UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }
    /**
     * Performs a request with `options` http method.
     #1#
    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.options(UssHttp.updateUrl(url), this.createAuthorizationHeader(url, options)).catch(e => this.HandleError(e));
    }
*/

}