import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import * as system from 'src/system';
import { AppComponent } from 'src/system';
import { Subscription } from 'rxjs/Subscription';
import { AppRoutes } from 'src/app/app.routes';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {SalesService} from '../../services/sales.service';
import {Sales} from '../../models/Sales';
import {AppWizardService} from '../../services/wizard.service';

@Component({
    selector: 'surfaces-list',
    templateUrl: './surfaces-list.component.html',
    styleUrls: ['./surfaces-list.component.scss']
})
@AppComponent()
export class SurfacesListComponent implements OnInit {

    private surfaces = [{ name: 'Brick', isSelected: false }, { name: 'Windows', isSelected: false }, { name: 'Soffits', isSelected: false }, { name: 'Stucco', isSelected: false } ];

    constructor(
        public sales: SalesService,
        private router: Router,
        private location: Location,
        public translate: TranslateService,
        public wizard: AppWizardService,

    ) {
    }

    ngOnInit() {
    }


    showOptions(surface) {
        
    }

}
