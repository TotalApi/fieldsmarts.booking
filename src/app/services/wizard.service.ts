import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AppService } from "src/system";
import {Surface} from '../models/Surface';

@Injectable()
@AppService()
export class AppWizardService {

    public data = {
        franchise: '',
        salesNumber: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        postalCode: '',
        address: '',
        wantSpam: false,
        callMe: false,
        bookTime: undefined,
        surfaces: undefined
    }

    public state = {
        currentStep: 0,
        totalSteps: 1,
    }

    public get current(): string {
        let res = this.router.url;
        if (res && res.startsWith('/'))
            res = res.substr(1);
        return res;
    }

    constructor(public router: Router) {
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
        this.state.totalSteps = this.data.callMe ? 4 : 6;
        switch (this.current) {
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
            case 'wizard-calendar':
                this.state.currentStep = 6;
                break;
        }
    }

    public getNext(current?: string): string {
        current = current || this.current;
        switch (current) {
            case 'home': return 'wizard-name';
            case 'wizard-name': return 'wizard-phone';
            case 'wizard-phone': return 'wizard-email';
            case 'wizard-email': return this.data.callMe ? 'wizard-postcode' : 'wizard-location';
            case 'wizard-location': return 'wizard-postcode';
            case 'wizard-postcode': return 'wizard-calendar';

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
            case 'wizard-calendar': return 'wizard-postcode';

            default: return current;
        }
    }

}
