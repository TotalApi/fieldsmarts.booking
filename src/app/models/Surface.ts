//declare type TSurfaceType = 'Admin' | 'SalesConsultant' | 'FranchisePartner';

export type TSurfaceType =
    'isAluminiumSiding' |
    'isVinylSiding' |
    'isStucco' |
    'isAggregate' |
    'isBrick' |
    'isFrontDoor' |
    'isGarageDoor' |
    'isWindows' |
    'isSoffits' |
    'isOther';

export type TSurfaceCondition = 'isRusted' | 'isWood' | 'isPainted' | 'none';


export class SurfaceOption {
    name: TSurfaceCondition;
    description: string;
    isSelected?: boolean;
}

export class Surface {
    name: TSurfaceType;
    isSelected?: boolean;
    options?: Array<SurfaceOption> | string;
}