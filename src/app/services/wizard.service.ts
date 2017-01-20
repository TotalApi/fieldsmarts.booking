import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AppService } from "src/system";

@Injectable()
@AppService()
export class AppWizardService {

    public data = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        postalCode: '',
        address: '',
        wantSpam: false,
        callMe: false
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

    public next(current: string): Promise<boolean> {
        return this.go(this.getNext(current));
    }

    public back(current: string): Promise<boolean> {
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
        }
    }

    public getNext(current: string): string {
        switch (current) {
            case 'home': return 'wizard-name';
            case 'wizard-name': return 'wizard-phone';
            case 'wizard-phone': return 'wizard-email';
            case 'wizard-email': return 'wizard-calendar';
            default: return current;
        }
    }

    public getBack(current: string): string {
        switch (current) {
            case 'wizard-name': return 'home';
            case 'wizard-phone': return 'wizard-name';
            case 'wizard-email': return 'wizard-phone';
            case 'wizard-calendar': return 'wizard-email';
            default: return current;
        }
    }

}
