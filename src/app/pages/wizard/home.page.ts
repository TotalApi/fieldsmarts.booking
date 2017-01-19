import { Component } from '@angular/core';
import { AppRoute } from 'src/app/app.routes';

@Component({
    templateUrl: './wizard.page.html'
})
@AppRoute({ menuPath: 'wizard' })
export class AppWizardPage {
}
