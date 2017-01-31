import { Reflection } from "../utils/Reflection";


export interface IApiMethodMetadata {
    /**
     * Name of HTTP-method.
     * If not set - for methods starts with Load and Get it will be 'GET',
     * with Delete and Remove - 'DELETE',
     * others - 'POST'.
     */
    method?: string;

    /**
     * Name of WebApi route.
     * If parameters transfers by url - they must be included in route as 'routeAddress/{param1}/{param2}...'
     */
    route?: string;

    /**
     * Indicates how to transfer parameters or request. false - by url, true - by request body.
     * For methods GET/DELETE/HEAD/OPTIONS - ignoring (always by url)
     * For POST/PUT/PATCH by default uses body (parameters transfered by url will be excluded from transfering object)
     * In other cases by default is false.
     */
    useBody?: boolean;

    /**
     * Name of calling method
     */
    caller?: string;
}

export class ApiMethodMetadata implements IApiMethodMetadata {

    /**
     * Name of HTTP-method.
     * If not set - for methods starts with Load and Get it will be 'GET',
     * with Delete and Remove - 'DELETE',
     * others - 'POST'.
     */
    method: string;

    /**
     * Name of WebApi route.
     * If parameters transfers by url - they must be included in route as 'routeAddress/{param1}/{param2}...'
     */
    route: string;

    /**
     * Indicates how to transfer parameters or request. false - by url, true - by request body.
     * For methods GET/DELETE/HEAD/OPTIONS - ignoring (always by url)
     * For POST/PUT/PATCH by default uses body (parameters transfered by url will be excluded from transfering object)
     * In other cases by default is false.
     */
    useBody: boolean;

    constructor(metadata: IApiMethodMetadata) {
        if (metadata) {
            this.method = metadata.method;    
            this.route = metadata.route;
            this.useBody = metadata.useBody;    
        }
    }
}

export var ApiMethod = (metadata?: IApiMethodMetadata) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const oldFn = descriptor.value;
    descriptor.value = function () {
        metadata.caller = propertyKey;
        this['__apiMethod'] = metadata;
        return oldFn.apply(this, arguments);
    }
};