import './';
import { UssSystemModule } from '../system.module';

/*
    Angular
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/*
    3rd party
*/
//import * as ng2Translate from 'ng2-translate/ng2-translate';
//import * as primeng from 'primeng/primeng';

/*
    App
*/
import { componentModuleComponents, systemComponents } from '../decorators/system-component.decorator';
import { componentModuleServices } from '../decorators/system-service.decorator';

@NgModule({
    declarations: [componentModuleComponents],
    exports: [componentModuleComponents],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
//        ng2Translate.TranslateModule.forRoot(),
//        primeng.ButtonModule, primeng.DataTableModule, primeng.InputTextModule, 
        UssSystemModule
    ],
    providers: [
        componentModuleServices
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UssComponentsModule { }
