import { Component, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import { AppModule } from './app.module';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app',
    styleUrls: ['./app.scss'],
    templateUrl: './app.html'
})
export class AppComponent implements OnInit {

    constructor(private appView: ViewContainerRef, private toastr: ToastsManager) {
        this.toastr.setRootViewContainerRef(appView);
    }

    public isSidebarVisible: boolean;

    public onSidebarVisibilityChanged(isVisible: boolean) {
        this.isSidebarVisible = isVisible;
    }

    ngOnInit(): void {
    }
}
