/*
    Angular
*/
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core'
import { RouterModule, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { AgmCoreModule} from 'angular2-google-maps/core';

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
import {AppSettingsResolver} from './services/settings.service';

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
            libraries: ["places"]
        })
    ],
    providers: [
        system.appServices,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: ng2Translate.TranslateLoader,
            useFactory: (http: Http) => new AppTranslateLoader(http),
            deps: [Http]
        },
        {
            provide: ng2Translate.MissingTranslationHandler,
            useFactory: (http: Http) => new AppMissingTranslationHandler(http),
            deps: [Http]
        },
        AppSettingsResolver
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(private translate: AppTranslateService, private auth: system.UssAuthService) {
        translate.init();
        //auth.Login('lionsoft@ukr.net', 'P@ssw0rd');
    }

}
