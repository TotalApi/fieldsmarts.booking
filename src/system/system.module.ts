import './services';
import './decorators';
import './pipes';
import './directives';
import { NgModule, ErrorHandler as NgErrorHandler, Injector, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {Http, HttpModule, XHRBackend, RequestOptions} from "@angular/http";
import {ToastModule,ToastOptions} from "ng2-toastr";
import {ErrorHandler} from './services/error-handler';
import {Reflection} from './utils/Reflection';
import {systemComponents} from './decorators/system-component.decorator';
import {systemServices} from './decorators/system-service.decorator';
import {UssHttp} from './services/http.service';
import {UssMessagesService} from './services/messages.service';

@NgModule({
    declarations: [systemComponents],
    exports: [systemComponents],
    imports: [
        HttpModule,
        ToastModule.forRoot(new ToastOptions(
        {
            animate: "flyRight", 
            maxShown: 10, 
            positionClass: "toast-bottom-right", 
        }))
    ],
    providers: [
        { provide: NgErrorHandler, useClass: ErrorHandler},
        systemServices,
        {
            provide: Http,
            useFactory: (backend: XHRBackend, defaultOptions: RequestOptions, msg: UssMessagesService) => {
                var res = new UssHttp(backend, defaultOptions, msg);
                return res;
            },
            deps: [XHRBackend, RequestOptions, UssMessagesService]
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UssSystemModule {
    public static Injector: Injector;

    constructor(public injector: Injector) {
        Reflection.Injector = injector;
        UssSystemModule.Injector = injector;
        window.alert = msg => UssMessagesService.Instance.info(msg);
    }
}



