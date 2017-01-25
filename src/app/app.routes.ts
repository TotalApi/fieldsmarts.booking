import { Type } from '@angular/core';
import { Route } from '@angular/router';
import { AppAuthGuard } from 'src/app/services/auth-guard.service';
import * as system from 'src/system';
import {AppWizardHomePage} from './pages/wizard-home/wizard-home.page';

export var AppRoute = (route?: Route) => target => {
    route = route || {};
    route.component = route.component || target;
    route.path = route.path || route.component.name;
    AppRoutes.config.push(route);
    if (!AppRoutes.components.contains(route.component))
        AppRoutes.components.push(route.component);
}

export class AppRoutes {

    public static components: Type<any>[] = [];

    public static config: Route[] = [
        {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
        }
    ];
}


