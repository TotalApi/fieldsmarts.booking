import * as ng from '@angular/core';
import { AppRoute } from 'src/app/app.routes';
import {AppWizardService} from "../../services/wizard.service";
import {Sales} from '../../models/Sales';
import {SalesService} from '../../services/sales.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Surface} from '../../models/Surface';
import {SurfaceOption} from '../../models/Surface';
import {Json} from '../../../system/utils/Json';

@ng.Component({
    styleUrls: ['./surface-options.page.scss'],
    templateUrl: './surface-options.page.html',
    encapsulation: ng.ViewEncapsulation.None
})
@AppRoute({ routerLink: 'surface-options/:surfaceName' })
export class AppSurfacesOptionsPage implements ng.OnInit, ng.OnDestroy {

    private surface: Surface;
    private sub: any;

    private initialOptions: SurfaceOption[];

    constructor(public sales: SalesService,
        public wizard: AppWizardService, public router: Router, private route: ActivatedRoute) { }

    private cancel() {
        this.surface.options = this.initialOptions;
        return this.router.navigate(['wizard-surfaces']);
    }

    private done() {
        return this.router.navigate(['wizard-surfaces']);
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.surface = this.wizard.data.surfaces.first(x => x.name === params['surfaceName']);
            this.initialOptions = Json.clone(this.surface.options);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
