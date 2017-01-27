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
@AppRoute({ path: 'surface-options/:surfaceName' })
export class AppSurfacesOptionsPage implements ng.OnInit, ng.OnDestroy, ng.OnChanges {

    private surface: Surface;
    private sub: any;

    private initialOptions: SurfaceOption[];

    constructor(public sales: SalesService,
        public wizard: AppWizardService, public router: Router, private route: ActivatedRoute) { }

    private cancel() {
        this.surface.options = this.initialOptions;
        return this.router.navigate(['wizard-surfaces']);
    }

    private ifAnyChecked() {
        let s = this.surface.options as SurfaceOption[];
        return s.any(x => x.isSelected);
    }

    private done() {
        if (this.surface.name !== 'isOther') {
            this.surface.isSelected = this.ifAnyChecked();
        } else {
            this.surface.isSelected = this.surface.options && (this.surface.options as string).length > 0;
        }
        return this.router.navigate(['wizard-surfaces']);
    }

    private modelChanged(option: SurfaceOption) {
        let opts = this.surface.options as SurfaceOption[];

        if (option.name === 'none' && option.isSelected) {
            opts.where(x => x.name !== 'none').forEach(x => {
                x.isSelected = false;
            });
        }

        if (opts.where(x => x.name !== 'none').any(x => x.isSelected)) {
            opts.find(x => x.name === 'none').isSelected = false;
        }
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.surface = this.wizard.data.surfaces.first(x => x.name === params['surfaceName']);
            this.initialOptions = Json.clone(this.surface.options) as SurfaceOption[];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    ngOnChanges(changes: Object): void {
        
    }
}
