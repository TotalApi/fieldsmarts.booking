import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AppService, Json } from "src/system";
import { Surface } from '../models/Surface';
import * as ng2Translate from 'ng2-translate';
import {AppTranslateService} from './translate.service';

@Injectable()
@AppService()
export class AppWizardService {

    public data = {
        language: '',
        franchise: '',
        salesNumber: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        postalCode: '',
        address: '',
        wantSpam: false,
        agreedForBook: false,
        callMe: undefined,
        bookTime: undefined,
        surfaces: undefined,
        isQualifiedLead: true
    }

    public state = {
        currentStep: 0,
        totalSteps: 1,
    }

    public get current(): string {
        let res = this.router.url;
        if (res && res.startsWith('/'))
            res = res.substr(1);
        return res.split('/')[0];
    }

    constructor(public router: Router, public translate: AppTranslateService) {
        try {
            const data = (sessionStorage.getItem("@wizard.service.data") || '').FromJson();
            if (data) {
                _.defaults(data, this.data);
                this.data = data;
            }
        } catch (e) {
        } 
    }

    public go(url: string): Promise<boolean> {
        return this.router.navigate([url]).then((res) => {
            this.updateState();
            return res;
        });
    }

    public next(current?: string): Promise<boolean> {
        return this.go(this.getNext(current));
    }

    public back(current?: string): Promise<boolean> {
        return this.go(this.getBack(current));
    }

    public updateState() {
        this.translate.use(this.data.language || this.translate.getBrowserLang());
        if (this.data.callMe === undefined && this.current !== 'home') {
            this.go('home');
            return;
        }

        this.state.totalSteps = this.data.callMe ? 4 : 8;
        switch (this.current) {
            case 'home':
                this.state.currentStep = 0;
                break;
            case 'wizard-name':
                this.state.currentStep = 1;
                break;
            case 'wizard-phone':
                this.state.currentStep = 2;
                break;
            case 'wizard-email':
                this.state.currentStep = 3;
                break;
            case 'wizard-location':
                this.state.currentStep = 4;
                break;
            case 'wizard-postcode':
                this.state.currentStep = this.data.callMe ? 4 : 5;
                break;
            case 'wizard-surfaces':
                this.state.currentStep = 6;
                break;
            case 'wizard-calendar':
                this.state.currentStep = 7;
                break;
            case 'wizard-validate':
                this.state.currentStep = 8;
                break;
            default:
                this.state.currentStep = 0;
                break;
        }
        sessionStorage.setItem("@wizard.service.data", Json.toJson(this.data));
    }

    public getNext(current?: string): string {
        current = current || this.current;
        switch (current) {
            case 'home': return 'wizard-name';
            case 'wizard-name': return 'wizard-phone';
            case 'wizard-phone': return 'wizard-email';
            case 'wizard-email': return this.data.callMe ? 'wizard-postcode' : 'wizard-location';
            case 'wizard-location': return 'wizard-postcode';
            case 'wizard-postcode': return this.data.callMe ? 'wizard-done' : 'wizard-surfaces';
            case 'wizard-surfaces': return 'wizard-calendar';
            case 'wizard-calendar': return 'wizard-validate';
            case 'wizard-validate': return 'wizard-done';

            default: return current;
        }
    }

    public getBack(current?: string): string {
        current = current || this.current;
        switch (current) {
            case 'wizard-name': return 'home';
            case 'wizard-phone': return 'wizard-name';
            case 'wizard-email': return 'wizard-phone';
            case 'wizard-location': return 'wizard-email';
            case 'wizard-postcode': return this.data.callMe ? 'wizard-email' : 'wizard-location';
            case 'wizard-calendar': return 'wizard-surfaces';
            case 'wizard-surfaces': return 'wizard-postcode';
            case 'wizard-validate': return 'wizard-calendar';

            default: return current;
        }
    }

}
