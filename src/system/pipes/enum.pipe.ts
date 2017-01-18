import {Pipe, Injectable,PipeTransform} from '@angular/core';
import * as moment from 'moment';
import { SystemComponent } from '../decorators/system-component.decorator';
import { isArray } from '../utils';

@Pipe({
    name: 'ussEnumDescription',
    pure: true
})
@SystemComponent()
export class UssEnumDescriptionPipe implements PipeTransform {
    transform(value: number, metadata: App.PropertyMetadata | App.EnumerableItemMetadata[]): string {
        value = value || 0;
        if (metadata && !isArray(metadata)) {
            metadata = (<App.PropertyMetadata>metadata).EnumerableMetadata;
            if (metadata && !isArray(metadata)) metadata = null;
        }
        return metadata
            ? (<App.EnumerableItemMetadata[]>metadata).where(x => x.Value === value).select(x => x.Description || x.Name).firstOrDefault()
            : '';
    }
}

@Pipe({
    name: 'ussEnumName',
    pure: true
})
@SystemComponent()   
export class UssEnumNamePipe implements PipeTransform {
    transform(value: number, metadata: App.PropertyMetadata | App.EnumerableItemMetadata[]): string {
        value = value || 0;
        if (metadata && !isArray(metadata)) {
            metadata = (<App.PropertyMetadata>metadata).EnumerableMetadata;
            if (metadata && !isArray(metadata)) metadata = null;
        }
        return metadata
            ? (<App.EnumerableItemMetadata[]>metadata).where(x => x.Value === value).select(x => x.Name).firstOrDefault()
            : '';
    }
}