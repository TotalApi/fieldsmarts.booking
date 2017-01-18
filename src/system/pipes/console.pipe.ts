import * as ng from '@angular/core';
import * as moment from 'moment';
import {SystemComponent} from '../decorators/system-component.decorator';
import {isArray} from '../utils/utils';

@ng.Pipe({
    name: 'console',
    pure: true
})
@SystemComponent()
export class UssConsolePipe implements ng.PipeTransform {
    transform(value: any, groupName?: string): any {
        if (ng.isDevMode) {
            if (groupName) {
                console.group(groupName);
            }
            if (isArray(value)) {
                console.table(value);
            } else {
                console.log(value);
            }
            if (groupName) {
                console.groupEnd();
            }
        }
        return value;
    }
}