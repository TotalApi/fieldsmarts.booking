import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';
import * as system from 'src/system';
import {AppService} from 'src/system';


@Injectable()
@AppService()
export class AppAuthGuard implements CanActivate {
    constructor(
        private auth: system.UssAuthService,
        private router: Router,
        private messages: system.UssMessagesService
    ) {}

    canActivate({routeConfig}): boolean {
        let currRouteRoles = routeConfig['settings']
            && routeConfig['settings'].access
            && routeConfig['settings'].access.forRoles
            ? routeConfig['settings'].access.forRoles
            : null;

        let result = this.auth.IsLoggedIn;
        let msg = !result ? 'You should be an authorized user' : null;

        if (currRouteRoles) {
            result = this.auth.IsLoggedIn
                && currRouteRoles.contains(this.auth.LoggedUser.UserRole);
            
            msg = !result ? 'Access denied for your current role' : null;
        }

        if (!result) {
            msg && this.messages.warning(msg);
            this.router.navigate(['login']);
        }

        return result;
    }
}