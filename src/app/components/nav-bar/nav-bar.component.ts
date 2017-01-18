import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import * as system from 'src/system';
import { AppComponent } from 'src/system';
import { Subscription } from 'rxjs/Subscription';
import { AppRoutes } from 'src/app/app.routes';
import { TranslateService } from 'ng2-translate/ng2-translate';

interface IMenuItem {
    hrefs: string[];
    title: string;
    isVisible: boolean;
    isActive: boolean;
}

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
@AppComponent()
export class AppNavBarComponent implements OnInit {
    public menuItems: IMenuItem[] = [];
    public loggedUser: App.User;
    public isLoggedIn: boolean;

    private ss: Subscription;

    constructor(
        public auth: system.UssAuthService,
        private router: Router,
        private location: Location,
        public translate: TranslateService    
    ) {
        this.menuItems = this.getMenuItems();
    }
    
    ngOnInit() {
        this.ss = this.auth.onAuthEvent.subscribe((e: system.UssAuthServiceEvent) => {
            switch (e.action) {
                case system.auth.Event.loggedIn:
                    this.loggedUser = e.user;
                    this.isLoggedIn = true;
                    this.updateMenuItems();
                    break;
                case system.auth.Event.loggedOut:
                    this.loggedUser = null;
                    this.isLoggedIn = false;
                    this.menuItems = this.getMenuItems();
                    this.router.navigate(['login']);
                    break;
            }
        });

        this.subscribeOnRouteChange();
    }

    private subscribeOnRouteChange() {
        this.router.events
            .filter(e => e instanceof NavigationEnd)
            .subscribe(e => this.setActiveRoute(e.url));
    }

    private setActiveRoute(currentUrl: string) {
        let currBaseUrl = currentUrl.split('/').firstOrDefault(p => p.length > 1);
        let currMenuItem = currBaseUrl && this.menuItems
            .firstOrDefault(i => {
                return i.hrefs[0].startsWith(`/${currBaseUrl}`)
                    || i.hrefs[0].startsWith(`${currBaseUrl}`);
            });

        if (currMenuItem) {
            this.menuItems.forEach(i => i.isActive = false);
            currMenuItem.isActive = true;
        }
    }

    private updateMenuItems() {
        this.menuItems = this.getMenuItems();
        this.setActiveRoute(this.location.path());
    }
    
    private getMenuItems(): IMenuItem[] {
        let result: IMenuItem[] = [];
        let item: IMenuItem;
        let existedItem: IMenuItem;

        this.router.config
            .where(r => !!r['settings'] && r['settings'].routerLink && r['settings'].menuPath)
            .forEach(r => {
                item = {
                    hrefs: AppRoutes.routeLink2Hrefs(r['settings'].routerLink),
                    title: r['settings'].menuPath.split('/')[0],
                    isVisible: AppRoutes.getVisibility(r['settings'].access),
                    isActive: false
                };

                item['_withGuard'] = r.canActivate && r.canActivate.length;

                existedItem = result.firstOrDefault(r => r.title === item.title);

                if (!this.auth.IsLoggedIn
                    && existedItem && existedItem['_withGuard']
                    && !item['_withGuard']
                ) {
                    result.splice(result.indexOf(existedItem));
                    result.push(item);
                } else {
                    result.push(item);
                }
            });

        result.forEach(r => delete r['_withGuard']);
        return result.where(r => r.isVisible).distinct(r => r.title).toArray();
    }

    public getReadableRole(): string {
        if (!this.isLoggedIn) return '';

        switch (this.loggedUser.UserRole) {
            case App.UserRole.User:
                return 'User';
            case App.UserRole.Admin:
                return 'Administrator';
            default:
                return '';
        }
    }

    public editAccount() {
        alert('might be soon...');
    }

    public changeStatus() {
        if (this.isLoggedIn) {
            this.auth.Logout();
        } else {
            this.router.navigate(['login']);
        }
    }
}
