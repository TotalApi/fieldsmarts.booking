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
        callMe: false
    }

    constructor(public router: Router) {
    }

    public go(url: string): Promise<boolean> {
        return this.router.navigate([url]);
    }

    public next(current: string): Promise<boolean> {
        return this.go(this.getNext(current));
    }

    public back(current: string): Promise<boolean> {
        return this.go(this.getBack(current));
    }

    public getNext(current: string): string {
        switch (current) {
            case 'home': return 'wizard-name';
            case 'wizard-name': return 'wizard-phone';
            default: return current;
        }
    }

    public getBack(current: string): string {
        switch (current) {
            case 'wizard-name': return 'home';
            case 'wizard-phone': return 'wizard-name';
            default: return current;
        }
    }

}
