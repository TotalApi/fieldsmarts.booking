import {Pipe, Injectable,PipeTransform} from '@angular/core';
import * as moment from 'moment';
import {SystemComponent} from '../decorators/system-component.decorator';

@Pipe({
    name: 'ussFormatDateTime',
    pure: false
})
@SystemComponent()
export class UssFormatDateTimePipe implements PipeTransform {
    transform(date: DateTime, format: string): string {
        return date ? moment(date).format(format) : '';
    }
}