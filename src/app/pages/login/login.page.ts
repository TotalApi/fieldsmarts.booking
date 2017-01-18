import {Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import * as system from 'src/system';
import { AppRoute } from 'src/app/app.routes';

@Component({
    styleUrls: ['./login.page.scss'],
    templateUrl: './login.page.html'
})
@AppRoute({
    routerLink: 'login'
})
export class AppLoginPage  {
    public form: FormGroup;
    public formSubmiting: boolean = false;

    constructor(
        private auth: system.UssAuthService,
        private fb: FormBuilder,
        private router: Router,
        private location: Location
    ) {
        this.form = fb.group({
            login: ['1', Validators.compose([Validators.required])],
            password: ['1', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        
    }

    public async login() {
        try {
            await this.auth.Login(this.form.value.login, this.form.value.password);
            if (history.length <= 2) {
                // the previous route is empty
                this.router.navigate(['home']);
            } else {
                this.location.back();
            }
        } catch (e) {
            console.log(e);
        } 
/*
        return this.auth.Login(this.form.value.login, this.form.value.password)
            .then(() => {
                if (history.length <= 2) {
                    // the previous route is empty
                    this.router.navigate(['home']);
                } else {
                    this.location.back();
                }
            });
*/
    }

    public logout() {
        this.auth.Logout();
    }
}
