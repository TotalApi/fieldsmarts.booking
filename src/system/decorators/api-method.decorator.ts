import { Reflection } from "../utils/Reflection";


export interface IApiMethodMetadata {
    /**
     * Название HTTP-метода обработки запроса.
     * Если не указано - то для методов, начинающихся с Load и Get это будет 'GET',
     * с Delete и Remove - 'DELETE',
     * для остальных - 'POST'.
     */
    method?: string;

    /**
     * Название роута WebApi запроса.
     * Если параметры (или часть параметров) передаются через адрес - их надо указать в роуте в виде 'routeAddress/{param1}/{param2}'
     */
    route?: string;

    /**
     * Указывает как передавать параметры в запрос. false - через адресную строку, true - через тело запроса.
     * Для методов GET/DELETE/HEAD/OPTIONS игнорируется (всегда передаётся через адресную строку)
     * Для POST/PUT/PATCH запросов параметры будут по умолчанию передаваться через тело запроса (параметры, передаваемые через адрес роута будут исключены из передаваемого объекта)
     * Для остальных запросов по умолчанию равно false.
     */
    useBody?: boolean;

    /**
     * Название функции, вызывающей метод
     */
    caller?: string;
}

export class ApiMethodMetadata implements IApiMethodMetadata {

    /**
     * Название HTTP-метода обработки запроса.
     * Если не указано - то для методов, начинающихся с Load и Get это будет 'GET',
     * с Delete и Remove - 'DELETE',
     * для остальных - 'POST'.
     */
    method: string;

    /**
     * Название роута WebApi запроса.
     * Если параметры (или часть параметров) передаются через адрес - их надо указать в роуте в виде 'routeAddress/{param1}/{param2}'
     */
    route: string;

    /**
     * Указывает как передавать параметры в запрос. false - через адресную строку, true - через тело запроса.
     * Для методов GET/DELETE/HEAD/OPTIONS игнорируется (всегда передаётся через адресную строку)
     * Для POST/PUT/PATCH запросов параметры будут по умолчанию передаваться через тело запроса (параметры, передаваемые через адрес роута будут исключены из передаваемого объекта)
     * Для остальных запросов по умолчанию равно false.
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