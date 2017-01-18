/*
    Angular
*/
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HttpModule } from '@angular/http';

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

@
NgModule({
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
        system.UssComponentsModule
    ],
    providers: [
        system.appServices,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: ng2Translate.TranslateLoader,
            useFactory: (http: Http) => new ng2Translate.TranslateStaticLoader(http, 'api/i18n', '.json'),
            deps: [Http]
        },
        {
            provide: ng2Translate.MissingTranslationHandler,
            useFactory: (http: Http) => {
                return {
                    handle: (params: ng2Translate.MissingTranslationHandlerParams) => `[${params.key}]`
                };
            },
            deps: [Http]
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(private translate: ng2Translate.TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('ru');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('ru');
    }

}
