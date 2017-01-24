export class SurfaceOption {
    name: string;
    description: string;
    isSelected: boolean;
}

export class Surface {
    name: string;
    description: string;
    isSelected?: boolean;
    options?: Array<SurfaceOption> | string;
}