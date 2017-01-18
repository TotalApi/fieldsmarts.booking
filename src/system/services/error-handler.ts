import * as angular from '@angular/core';
import {msg} from './messages.service';




@angular.Injectable()
export class ErrorHandler extends angular.ErrorHandler {

    constructor( @angular.Optional() rethrowError?: boolean) {
        super(rethrowError);
    }

    handleError(error: any): void {
        if (error.rejection)
            this.handleError(error.rejection);
        else {
            if (angular.isDevMode()) {
                setTimeout(() => msg.runtimeError(error));
            }
            super.handleError(error);
        }
    }
}
