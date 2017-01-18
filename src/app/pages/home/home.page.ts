import { Component } from '@angular/core';
import { AppRoute } from 'src/app/app.routes';

@Component({
    styleUrls: ['./home.page.scss'],
    templateUrl: './home.page.html'
})
@AppRoute({
    id: 'home',
    menuPath: 'Home',
    first: true
})
export class AppHomePage {
}
