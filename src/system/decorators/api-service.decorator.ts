import { Reflection } from '../utils/Reflection';
import {systemServices} from './system-service.decorator';
declare type IApiServiceMetadata = any;

export class ApiServiceMetadata /*implements IApiServiceMetadata*/ {

    public Url: string;
    public Metadata: IApiServiceMetadata;

    constructor(url: string, metadata: IApiServiceMetadata) {
        this.Url = url;
        this.Metadata = metadata;
    }
}

export var ApiService = (url: string, metadata?: IApiServiceMetadata) => target => {
    Reflection.makeDecorator(new ApiServiceMetadata(url, metadata), target);
    systemServices.push(target);
};

