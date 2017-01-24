export class SurfaceOption {
    name: string;
    description: string;
    isSelected: boolean;
}

export class Surface {
    name: string;
    isSelected: boolean;
    options: Array<SurfaceOption>;
}