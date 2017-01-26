/*
    Angular
*/
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

/*
    3rd party
*/
import * as ng2Translate from 'ng2-translate';

/*
    App
*/
import * as system from 'src/system';

import './pages';
import './components';
import './services';

import { AppComponent } from './app';

import { AppRoutes } from "src/app/app.routes";

import { AppTranslateService, AppTranslateLoader, AppMissingTranslationHandler } from './services/translate.service';
import {AppSettings} from './services/settings.service';

@NgModule({
    declarations: [
        AppComponent,
        system.appComponents,
        AppRoutes.components
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes.config),
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
            useFactory: () => new AppTranslateLoader(),
            deps: []
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
