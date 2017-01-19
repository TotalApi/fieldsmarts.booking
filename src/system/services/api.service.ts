import { Type, EventEmitter, Optional } from "@angular/core";
import { Json } from "../utils/Json";
import { OData } from "../utils/OData";
import { Http, RequestOptionsArgs } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import * as utils from "../utils/utils";
import { Reflection } from "../utils/Reflection"
import { ApiServiceMetadata } from "../decorators/api-service.decorator";
import { ApiMethodMetadata, IApiMethodMetadata } from "../decorators/api-method.decorator";
import { UssHttp } from "./http.service";

/**
 * Описание нашего базового интерфейса API-контроллера ресурсов
 */
export class UssApiService {

    protected serviceDescription: ApiServiceMetadata;

    public url: string;

    constructor( @Optional() protected http: Http) {
        this.http = http || Reflection.get(Http);
        this.serviceDescription = Reflection.classMetadata(this, ApiServiceMetadata);
        this.url = this.serviceDescription ? this.serviceDescription.Url : undefined;
    }

    private static updateMethod(method: string, fnName: string) {
        fnName = (fnName || '').toUpperCase();
        if (!method) {
            if (fnName.StartsWith('GET') || fnName.StartsWith('LOAD'))
                method = "GET";
            else if (fnName.StartsWith('DELETE') || fnName.StartsWith('REMOVE'))
                method = "DELETE";
            else
                method = "POST";
        }
        return method.toUpperCase();
    }

    private static objectToStringParams(params: any, url: string, methodDescriptor: IApiMethodMetadata): string {
        let res = url || "";
        if (methodDescriptor.route && methodDescriptor.route.StartsWith("/")) {
            res = methodDescriptor.route.substr(1);
        } else if (methodDescriptor.route && methodDescriptor.route !== "/") {
            if (!methodDescriptor.route.StartsWith('/') && !res.EndsWith('/'))
                res = res + "/";
            res = res + methodDescriptor.route;
        }


        if (methodDescriptor.useBody === undefined) {
            methodDescriptor.useBody = methodDescriptor.method === "POST"
                || methodDescriptor.method === "PUT"
                || methodDescriptor.method === "PATCH";
        }
        else if (methodDescriptor.method === "GET" || methodDescriptor.method === "DELETE" || methodDescriptor.method === "HEAD" || methodDescriptor.method === "OPTIONS") {
            methodDescriptor.useBody = false;
        }

        let prefix = res.indexOf("?") === -1 ? "?" : "&";
        if (!utils.isString(params)) {
            for (let param in params) {
                if (params.hasOwnProperty(param)) {
                    if (param === "$query") {
                        res = `${res}${prefix}${param}`;
                        prefix = "&";
                        delete params[param];
                    }
                    else if (res.indexOf(`{${param}}`) !== -1) {
                        res = res.replace(`{${param}}`, encodeURIComponent(params[param]));
                        delete params[param];
                    }
                }
            }
            if (!methodDescriptor.useBody) {
                for (let param in params) {
                    if (params.hasOwnProperty(param)) {
                        res = `${res}${prefix}${param}=${encodeURIComponent(params[param])}`;
                        prefix = "&";
                        delete params[param];
                    }
                }
            }
        } else if (!methodDescriptor.useBody) {
            res = res + prefix + params;
        }
        return UssHttp.updateUrl(res);
    }

    public request<T>(params?: any, methodDescriptor?: IApiMethodMetadata, options?: RequestOptionsArgs): Observable<T> {
        params = params || {};
        const paramsObject = params instanceof OData ? params.query : Json.clone(params);

        let caller = '';
        methodDescriptor = methodDescriptor || this['__apiMethod'];
        if (!methodDescriptor) {
            caller = utils.callerName(1);
            methodDescriptor = <IApiMethodMetadata>(Reflection.memberMetadata(this, caller, ApiMethodMetadata) || {});
        }
        caller = methodDescriptor.caller || caller;

        methodDescriptor.method = UssApiService.updateMethod(methodDescriptor.method, caller);
        switch (methodDescriptor.method) {
            case "GET": return <Observable<T>>UssHttp.HandleResponse(this.http.get(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "POST": return <Observable<T>>UssHttp.HandleResponse(this.http.post(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "PUT": return <Observable<T>>UssHttp.HandleResponse(this.http.put(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "DELETE": return <Observable<T>>UssHttp.HandleResponse(this.http.delete(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "PATCH": return <Observable<T>>UssHttp.HandleResponse(this.http.patch(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), paramsObject, options));
            case "HEAD": return <Observable<T>>UssHttp.HandleResponse(this.http.head(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            case "OPTIONS": return <Observable<T>>UssHttp.HandleResponse(this.http.options(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
            default:
                options = options || { method: methodDescriptor.method, body: paramsObject };
                options.method = options.method || methodDescriptor.method;
                options.body = options.body || paramsObject;
                return <Observable<T>>UssHttp.HandleResponse(this.http.request(UssApiService.objectToStringParams(paramsObject, this.url, methodDescriptor), options));
                //throw new Error(`Unknown HTTP method ${methodDescriptor.method}.`);
        }
    }

    public create<T>(object: T): Observable<T> {
        return this.update<T>(object, true);
    }
    public update<T>(object: T, isNew?: boolean): Observable<T> {
        const method = <IApiMethodMetadata>{ method: isNew ? 'POST' : 'PUT', route: '', useBody: true };
        return this.request<T>(object, method);
    }
}
