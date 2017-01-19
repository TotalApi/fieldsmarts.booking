import { Type } from '@angular/core';
import { Route } from '@angular/router';
import { AppAuthGuard } from 'src/app/services/auth-guard.service';
import * as system from 'src/system';

/* ------------------------------------------------------------------------------------------------- */
declare type TRouteSettings = {
    id?: string;
    before?: string;
    after?: string;
    first?: boolean;
    routerLink?: string | string[];
    menuPath?: string;
    access?: {
        needAuth?: boolean;
        forRoles?: TUserRole[];
        alwaysVisible?: boolean;
    };
}

interface IRoute extends Route {
    settings?: TRouteSettings;
}

export var AppRoute = (routeSettings?: TRouteSettings) => target => {
    AppRoutes.config.push({ component: target, settings: routeSettings });
}

export class AppRoutes {

    public static updateRoutes() {

        // Заполняем незаполненные поля роут-конфига
        for (let i = 0; i < this.config.length; i++) {
            const route = this.config[i];
            route.settings = route.settings || {};
            if (!route.path && route.settings.routerLink)
                route.path = this.routeLink2Path(route.settings.routerLink);
            if (route.settings.menuPath && !route.settings.routerLink) {
                route.settings.routerLink = route.path;
            }
            if (!route.path && route.settings.menuPath) {
                route.path = system.urlRusLat(route.settings.menuPath);
                route.settings.routerLink = route.path;
            }
            if (route.settings.access) {
                if (route.settings.access.forRoles && route.settings.access.forRoles.length > 0)
                    route.settings.access.needAuth = true;
                if (route.settings.access.needAuth && !route.canActivate)
                    route.canActivate = [AppAuthGuard];
            }
            if (!route.settings.id)
                route.settings.id = route.path;
        }

        // сортируем. // ToDo: нужно реализовать полностью, включая вложенные пункты
        this.config.orderBy(r => r.settings ? (r.settings.first ? '0' : "1") + r.settings.id : '1').select((x, i) => this.config[i] = x).toArray();
    }


    public static routeLink2Hrefs(routeLink: string | string[]): string[] {
        return (typeof routeLink === "string") ? [routeLink] : routeLink;
    }

    public static routeLink2Path(routeLink: string | string[]): string {
        if (!routeLink) return undefined;
        let res = (typeof routeLink === "string") ? routeLink : routeLink.join('/');
        if (res.StartsWith('/'))
            res = res.substr(1);

        return res;

    }

    private static appendComponents(routes: Route[], components: Type<any>[]) {
        if (!routes) return;
        for (let i = 0; i < routes.length; i++) {
            const r = routes[i];
            if (r.component && !components.contains(r.component))
                components.push(r.component);
            if (r.children)
                this.appendComponents(r.children, components);
        }
    }

    public static get components(): Type<any>[] {
        const res = system.appComponents.toArray();
        this.appendComponents(this.config, res);
        return res;
    }

    public static getVisibility(accessSettings/* add type */): boolean {
        if (!accessSettings || accessSettings.alwaysVisible) return true;

        if (accessSettings.needAuth) {
            return accessSettings.forRoles
                ? system.auth.IsLoggedIn && this.isSuitableUserRole(accessSettings.forRoles)
                : system.auth.IsLoggedIn;
        }

        return true;
    }

    private static isSuitableUserRole(roles: TUserRole[]): boolean {
        return roles.contains(system.auth.LoggedUser.role);
    }

    public static config: IRoute[] = [
        {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
        }
    ];
}


