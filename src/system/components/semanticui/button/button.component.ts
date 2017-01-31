import * as ng from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {SystemComponent} from '../../../decorators/system-component.decorator';
export declare type UssButtonType = 'ok' | 'cancel' | 'yes' | 'no' | 'close' | 'save' | 'empty';
export declare type UssButtonSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

@ng.Component({
    selector: 'uss-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ng.ViewEncapsulation.None
})
@SystemComponent(true)
export class UssButtonComponent implements ng.OnChanges {
    @ng.Input("class") inputClass: string;
    public class: string;
    public ngClass: Object;

    @ng.Input() type: UssButtonType;
    @ng.Input() size: UssButtonSize;
    @ng.Input() icon: string;

    @ng.Input("loading") inputLoading: boolean = false;
    public loading: number = 0;

    @ng.Input("disabled") inputDisabled: boolean = false;
    public disabled: number = 0;

    @ng.ViewChild("content") content;
    public defaultContent: string;

    ngOnChanges(changes) {
        this.updateLayout();
    }

    updateLayout(): void {
        this.defaultContent = '';
        let res = (this.inputClass || '') + ' uss-button';
        switch (this.type) {
            case 'ok':
                res += ' primary uss-system-button';
                this.defaultContent = 'OK';
                break;
            case 'cancel':
                res += ' normal uss-system-button';
                this.defaultContent = 'CANCEL';
                break;
            case 'yes':
                res += ' positive uss-system-button';
                this.defaultContent = 'YES';
                break;
            case 'save':
                res += ' positive uss-system-button';
                this.defaultContent = 'SAVE_CHANGES';
                break;
            case 'no':
                res += ' negative uss-system-button';
                this.defaultContent = 'NO';
                break;
            case 'close':
                res += ' normal uss-system-button';
                this.defaultContent = 'CLOSE';
                break;
            case 'empty':
                res += ' basic';
                break;
            default :
                res += ' normal';
                break;
        }

        res += this.size ? ` ${this.size}` : '';
        if (this.inputLoading || this.loading)
            res += ' loading';

        this.ngClass = {};
        for (let cls of res.split(' ')) {
            if (cls)
                this.ngClass[cls] = true;
        }
        this.class = res;
    }

    private loadingTimeout;

    setLoading(loading: boolean) {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        } else if (!loading) {
            this.loading--;
        }
        if (loading) 
            this.disabled++;
        else
            this.disabled--;
            
        if (this.disabled) {
            this.loadingTimeout = setTimeout(() => {
                this.loadingTimeout = null;
                if (this.disabled) {
                    this.loading++;
                    this.updateLayout();
                }
            }, 50);
        }

        this.updateLayout();
    }

    @ng.HostListener("click", ['$event'])
    onClick($event) {
        if (this.disabled || this.inputDisabled || this.loading || this.inputLoading) {
            $event.stopPropagation();
            $event.preventDefault();
            return false;
        }
        return true;
    }

    /**
     * Calls the method.
     * If method returns <i>Promise</i> or <i>Observable</i>,
     * button will be disabled and animation will be visible until promise is resolved.
     * @param fn - calling method.
     */
    public execute(fn: () => Promise<any> | Observable<any> | any, context?: Object): Promise<any> | Observable<any> | any {
        if (this.disabled || this.inputDisabled || this.loading || this.inputLoading) return () => { };
        const args = [];
        for (let i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        fn = fn.bind(context || this, ...args);
        const res = fn();
        if (res instanceof Observable || res instanceof Promise) {
            this.setLoading(true);
            if (res instanceof Observable) {
                res.subscribe(
                    () => this.setLoading(false),
                    () => this.setLoading(false)
                );
            }
            else if (res instanceof Promise) {
                res.then(
                    () => this.setLoading(false),
                    () => this.setLoading(false)
                );
            }
        }
        return res;
    }
}

