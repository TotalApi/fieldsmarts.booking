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
import {SurfaceOption} from '../models/Surface';

@Injectable()
@ApiService("")
export class SurfacesService extends UssApiService {

    public getSurfaces(): Surface[] {
        return [
            { name: 'brick', description: 'Brick', options: [{ name: 'ok', description: 'Normal' }, { name: 'rusted', description: 'Rusted' }, { name: 'wood', description: 'Wood' }, {name: 'repainted', description: 'Repainted' }] as SurfaceOption[] } as Surface, 
            { name: 'windows', description: 'Windows', options: [{ name: 'ok', description: 'Normal' },{ name: 'rusted', description: 'Rusted' }, { name: 'wood', description: 'Wood' }, {name: 'repainted', description: 'Repainted' }] as SurfaceOption[] } as Surface, 
            { name: 'soffits', description: 'Soffits', options: [] as SurfaceOption[] } as Surface, 
            { name: 'stucco', description: 'Stucco', options: [{ name: 'ok', description: 'Normal' },{ name: 'rusted', description: 'Rusted' }, { name: 'wood', description: 'Wood' }, {name: 'repainted', description: 'Repainted' }] as SurfaceOption[] } as Surface, 

            { name: 'not_listed', description: 'My exterior not listed' } as Surface,

        ];
    }
    
}