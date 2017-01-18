import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {isDevMode, enableProdMode} from '@angular/core';
import * as system from './system';
import { AppModule } from './app/app.module';
import { AppRoutes } from './app/app.routes';

if (NODE_ENV === 'production') {
    enableProdMode();
}

AppRoutes.updateRoutes();

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => system.UssMessagesService.error(err));
