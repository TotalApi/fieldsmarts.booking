import { Injector } from '@angular/core'

export var AppInjector: Injector;

export function setInjector(injector: Injector) {
    AppInjector = injector;
}

export class Reflection {
    public static Injector: Injector;

    public static get(token: any, notFoundValue?: any): any {
        if (Reflection.Injector)
            return Reflection.Injector.get(token, notFoundValue);
        else
            return undefined;
    }

    public static makeDecorator(annotationInstance: any, target: Function) {
        const annotations = Reflect.getOwnMetadata('annotations', target) || [];
        annotations.push(annotationInstance);
        Reflect.defineMetadata('annotations', annotations, target);

    }

    public static makePropDecorator(decoratorInstance: any, target: Object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) {
        const meta = Reflect.getOwnMetadata('propMetadata', target.constructor) || {};
        meta[propertyKey] = meta[propertyKey] || [];
        meta[propertyKey].unshift(decoratorInstance);
        Reflect.defineMetadata('propMetadata', meta, target.constructor);
    }

    public static makeParamDecorator(decoratorInstance: any, target: Object, index: number) {
        const parameters = Reflect.getMetadata('parameters', target) || [];
        // there might be gaps if some in between parameters do not have annotations.
        // we pad with nulls.
        while (parameters.length <= index) {
            parameters.push(null);
        }
        parameters[index] = parameters[index] || [];
        const annotationsForParam = parameters[index];
        annotationsForParam.push(decoratorInstance);
        Reflect.defineMetadata('parameters', parameters, target);
    }

    public static getMetadata(name: string, target: any, own: boolean = false): any[] {
        return own ? (<any>Reflect).getOwnMetadata(name, target.constructor) : (<any>Reflect).getMetadata(name, target.constructor);
    }
    public static annotations(target: any, own: boolean = false): any[] {
        return Reflection.getMetadata('annotations', target, own);
    }
    public static propAnnotations(target: any, own: boolean = false): any[] {
        return Reflection.getMetadata('propMetadata', target, own);
    }

    public static classMetadata(target: any, metadataType: Function, own: boolean = false): any {
        return (this.annotations(target) || []).firstOrDefault(x => x instanceof metadataType);
    }

    public static memberMetadata(target: any, memberName: string, metadataType: Function, own: boolean = false): any {
        return ((this.propAnnotations(target) || {})[memberName] || []).firstOrDefault(x => x instanceof metadataType);
    }

}
