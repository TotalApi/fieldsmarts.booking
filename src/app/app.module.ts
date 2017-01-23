/*
    Angular
*/
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { AppTranslateService, AppTranslateLoader, AppMissingTranslationHandler } from './services/translate.service';
import { AgmCoreModule } from 'angular2-google-maps/core';

/*
    3rd party
*/
import * as ng2Translate from 'ng2-translate';
//import * as primeng from 'primeng/primeng';
/*
    App
*/
import * as system from 'src/system';

import './pages';
import './components';
import './services';

import { AppComponent } from './app';

import { AppRoutes } from "src/app/app.routes";


@NgModule({
    declarations: [
        AppComponent,
        AppRoutes.components
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes.config),
//        primeng.ButtonModule, primeng.DataTableModule, primeng.InputTextModule, primeng.ProgressBarModule, primeng.FileUploadModule,
        ng2Translate.TranslateModule.forRoot(),
        system.UssSystemModule,
        system.UssComponentsModule,
        AgmCoreModule.forRoot({
          libraries: ["places"],
          apiKey: 'AIzaSyASScrTpFyyeEruSLIaOyg_GLmPwXoHLgA'
        })
    ],
    providers: [
        system.appServices,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: ng2Translate.TranslateLoader,
            useFactory: (http: Http) => new AppTranslateLoader(http, 'http://192.168.3.202:7202/locales', '.json'),
            deps: [Http]
        },
        {
            provide: ng2Translate.MissingTranslationHandler,
            useFactory: (http: Http) => new AppMissingTranslationHandler(http),
            deps: [Http]
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(private translate: AppTranslateService, private auth: system.UssAuthService) {
        translate.init();
        auth.Login('lionsoft@ukr.net', 'P@ssw0rd');
    }

}
