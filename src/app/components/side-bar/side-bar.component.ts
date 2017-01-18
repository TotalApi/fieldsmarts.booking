import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, Route, NavigationEnd } from '@angular/router';
import { AppComponent } from 'src/system';
import * as system from 'src/system';
import { AppRoutes } from 'src/app/app.routes';

interface IRoute extends Route {
    settings?: {
        routerLink: string[];
        menuPath: string;
        access?: {
            needAuth: boolean;
            forRoles?: App.UserRole[];
            alwaysVisible?: boolean;
        };
    }
}

interface IMenuItem {
    parent?: {
        title: string;
        subMenu: IMenuItem[];
        showSubMenu?: boolean;
    };
    hrefs?: string[];
    title?: string;
    isVisible: boolean;
}

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
@AppComponent()
export class AppSideBarComponent implements OnInit {
    @Output() onVisibilityChanged = new EventEmitter<boolean>();

    public sidebarVisibility = false;
    public menuItems: IMenuItem[] = [];

    private previousBaseUrl: string;

    constructor(
        private router: Router,
        private auth: system.UssAuthService
    ) {}

    ngOnInit() {
        this.subscribeOnRouteChange();
    }

    set _sidebarVisibility(value: boolean) {
        this.sidebarVisibility = value;
        this.onVisibilityChanged.emit(value);
    }

    public isParentHidden(menuItemParent) {
        return !menuItemParent.subMenu
            || !menuItemParent.subMenu.length
            || menuItemParent.subMenu.all(i => !i.isVisible);
    }

    private subscribeOnRouteChange() {
        let prevUrl: string;
        let currentUrl: string;

        this.router.events
            .filter(e => e instanceof NavigationEnd)
            .do(e => currentUrl = (<any>e).url)
            .filter(() => prevUrl !== currentUrl)
            .do(() => prevUrl = currentUrl)
            .map(() => this.router.config.where(r => this.isSubMenuConfig(r)).toArray())
            .map(subRoutesConfig => this.getSubMenuForCurrentRootMenu(subRoutesConfig , currentUrl))
            .subscribe(subRoutesConfig => {
                this._sidebarVisibility = !!subRoutesConfig.length;

                if (this.previousBaseUrl === this.getBaseUrl(currentUrl)) return;

                this.previousBaseUrl = this.getBaseUrl(currentUrl);
                this.updateMenuItems(subRoutesConfig, currentUrl);
            });
    }

    private updateMenuItems(routesConfig: IRoute[], currentUrl: string) {
        this.menuItems = [];
        let menuPathAsArray: string[];
        let menuItem: IMenuItem;

        routesConfig.where(r => !!r.settings && !!r.settings.menuPath).forEach(r => {
            menuPathAsArray = r.settings.menuPath.split('/').skip(1).toArray();
            if (menuPathAsArray.length > 1) {
                menuItem = {
                    parent: {
                        title: menuPathAsArray[0],
                        showSubMenu: this.needToShowSubMenu(r.settings.menuPath),
                        subMenu: [
                            {
                                hrefs: AppRoutes.routeLink2Hrefs(r.settings.routerLink),
                                title: menuPathAsArray.last(),
                                isVisible: AppRoutes.getVisibility(r.settings.access)
                            }
                        ]
                    },
                    isVisible: AppRoutes.getVisibility(r.settings.access)
                };
            } else {
                menuItem = {
                    hrefs: AppRoutes.routeLink2Hrefs(r.settings.routerLink),
                    title: menuPathAsArray[0],
                    isVisible: AppRoutes.getVisibility(r.settings.access)
                };
            }

            if (this.menuItems.length && menuItem.parent) {
                // the same parent already exist
                const existedParent = this.menuItems
                    .firstOrDefault(i => i.parent && i.parent.title === menuItem.parent.title);

                if (existedParent) {
                    existedParent.parent.subMenu.push(...menuItem.parent.subMenu);
                } else {
                    this.menuItems.push(menuItem);
                }
            } else {
                this.menuItems.push(menuItem);
            }
        });
    }

    private needToShowSubMenu(menuPath: string): boolean {
        // show sub menu if menu path contains 3 or more parts
        return menuPath.split('/').where(p => !!p.length).toArray().length >= 3;
    }

    private getBaseUrl(currentUrl: string): string {
        return currentUrl.split('/').takeExceptLast().toArray().join('/');
    }

    private isSubMenuConfig(routeConfig: IRoute): boolean {
        return routeConfig.settings && routeConfig.settings.menuPath && routeConfig.settings.menuPath.split('/').length > 1;
    }

    private getSubMenuForCurrentRootMenu(routesConfig: IRoute[], currentUrl: string): IRoute[] {
        const currentRootMenu = currentUrl.split('/').firstOrDefault(p => !!p.length) + '/';
        return routesConfig.where(r => !!r.settings && r.path.startsWith(currentRootMenu)).toArray();
    }
}
