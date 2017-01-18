import { Subject } from 'rxjs/Subject';

export class TypedEventEmitter<T> extends Subject<T> {
     constructor() {
        super();
    }

    emit(value: T) {
        super.next(value);
    }
}