export class Option {
    name: string;
    description: string;
    isSelected: boolean;
}

export class Surface {
    name: string;
    isSelected: boolean;
    options: Array<Option>;
}