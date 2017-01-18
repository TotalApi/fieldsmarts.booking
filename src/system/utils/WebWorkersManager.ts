import {TypedEventEmitter} from './TypedEventEmitter';

export interface IWebWorkerMessage {
    type: string;
    message: Object;
}

export interface IWebWorker {
    fromMainThread(messageType: string, workers?: Worker[]): TypedEventEmitter<any>;
    toMainThread(messageType: string, workers?: Worker[]): TypedEventEmitter<any>;
}

export class WebWorkersManager implements IWebWorker {

    public static Instance = new WebWorkersManager();

    public static $fromMain<T>(messageType: string, workers?: Worker[]): TypedEventEmitter<T> {
        return WebWorkersManager.Instance.fromMainThread<T>(messageType, workers);
    }

    public static $toMain<T>(messageType: string, workers?: Worker[]): TypedEventEmitter<T> {
        return WebWorkersManager.Instance.toMainThread<T>(messageType, workers);
    }

    public fromMainThread<T>(messageType: string, workers?: Worker[]): TypedEventEmitter<T> {
        if (!this._fromMainThread[messageType]) {
            this._fromMainThread[messageType] = new TypedEventEmitter<IWebWorkerMessage>();

            if (workers) {
                for (var worker of workers) {
                    if (worker) {
                        ((w) => { this._fromMainThread[messageType].subscribe((e) => {
                            w.postMessage({ type: messageType, message: e });
                        })})(worker);
                    }
                }
            } else {
                onmessage = (e) => {
                    this._fromMainThread[e.data.type].emit(e.data.message);
                }
            }
        }

        return <TypedEventEmitter<T>>this._fromMainThread[messageType];
    }

    public toMainThread<T>(messageType: string, workers?: Worker[]): TypedEventEmitter<T> {
        if (!this._toMainThread[messageType]) {
            this._toMainThread[messageType] = new TypedEventEmitter<IWebWorkerMessage>();
            if (workers) {
                for (var worker of workers) {
                    worker.onmessage = (e) => {
                        this._toMainThread[e.data.type].emit(e.data.message);
                    }
                }
            } else {
                this._toMainThread[messageType].subscribe((e) => {
                    (<any>postMessage)({ type: messageType, message: e });
                });
            }
        }
        return <TypedEventEmitter<T>>this._toMainThread[messageType];
    }

    public get fromMainThreadAll(): Array<TypedEventEmitter<any>> {
        return Object.keys(this._fromMainThread).map((key) => {
            return this._fromMainThread[key];
        });
    }

    public get toMainThreadAll(): Array<TypedEventEmitter<any>> {
        return Object.keys(this._toMainThread).map((key) => {
            return this._toMainThread[key];
        });
    }

    private _fromMainThread: { [type: string]: TypedEventEmitter<any> } = {};
    private _toMainThread: { [type: string]: TypedEventEmitter<any> } = {};
}

