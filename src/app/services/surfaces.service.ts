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
import {AppWizardService} from './wizard.service';

@Injectable()
@ApiService("")
export class SurfacesService extends UssApiService {

    constructor(http: Http, public wizard: AppWizardService) {
        super(http);
    }

    public getSurfaces(): Surface[] {

        const options: SurfaceOption[] = [
            { name: 'isRusted', description: 'Rusted' },
            { name: 'isWood', description: 'Wood' }, 
            { name: 'isPainted', description: 'Repainted' },
            { name: 'none', description: 'None of above' }
        ];

        return [
            { name: 'isAluminiumSiding', options: options } as Surface, 
            { name: 'isVinylSiding', options: options } as Surface, 
            { name: 'isStucco', options: options } as Surface, 
            { name: 'isAggregate', options: options } as Surface, 
            { name: 'isBrick', options: options } as Surface, 
            { name: 'isFrontDoor', options: options } as Surface, 
            { name: 'isGarageDoor', options: options } as Surface, 
            { name: 'isWindows', options: options } as Surface, 
            { name: 'isSoffits', options: options } as Surface, 

            { name: 'isOther', description: 'My exterior not listed' } as Surface

        ];
    }
    
    
}