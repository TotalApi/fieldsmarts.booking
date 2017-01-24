import {Injectable} from '@angular/core';
import * as system from 'src/system';
import {AppService} from 'src/system';
import {AvailableTimeSlots} from '../models/Sales';
import {UssApiService} from '../../system/services/api.service';
import {ApiMethod} from '../../system/decorators/api-method.decorator';
import {ApiService} from '../../system/decorators/api-service.decorator';
import {Http} from '@angular/http';
import {SalesConsultant} from '../models/Sales';
import {Sales} from '../models/Sales';
import {PostBooking} from '../models/Sales';
import {PostCodeAssignment} from '../models/Sales';
import {Surface} from '../models/Surface';

@Injectable()
@ApiService("")
export class SurfacesService extends UssApiService {
    constructor(http: Http) { super(http); }

    public getSurfaces(): Surface[] {
        return [
            <Surface>{ name: 'Brick', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            <Surface>{ name: 'Windows', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            <Surface>{ name: 'Soffits', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] },
            <Surface>{ name: 'Stucco', options: [{ description: 'Rusted' }, { description: 'Wood' }, { description: 'None' }] }
        ];
    }
    
}