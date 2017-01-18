import {WebWorkersManager} from './WebWorkersManager';
import {TypedEventEmitter} from './TypedEventEmitter';
import {ObserveableEventType} from './ObserveableEventType';

export class EventedWorker {

    private workers: Worker[];    
    private channel: string;    

    constructor(channel: string, workers: Worker[]) {
        this.workers = workers;
        this.channel = channel;
    }

    public send<T>(type: string, value: any) {
        WebWorkersManager.$fromMain<T>(type, this.workers).emit(value);
    }

    public receive<T>(type: string): TypedEventEmitter<T> {
        return WebWorkersManager.$toMain<T>(type, this.workers);
    }

    public add<T>(value: any) {
        WebWorkersManager.$fromMain<T>(`${this.channel}_${ObserveableEventType.Add}`, this.workers).emit(value);
    }

    public addRange<T>(value: any) {
        WebWorkersManager.$fromMain<T>(`${this.channel}_${ObserveableEventType.AddRange}`, this.workers).emit(value);
    }

    public remove<T>(value: any) {
        WebWorkersManager.$fromMain<T>(`${this.channel}_${ObserveableEventType.Remove}`, this.workers).emit(value);
    }

    public update<T>(value: any) {
        WebWorkersManager.$fromMain<T>(`${this.channel}_${ObserveableEventType.Update}`, this.workers).emit(value);
    }

    public terminate() {
        this.workers.forEach((w) => w.terminate());
    }
}