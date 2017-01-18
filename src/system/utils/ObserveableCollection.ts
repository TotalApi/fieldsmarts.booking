import {TypedEventEmitter} from './TypedEventEmitter';
import {ObserveableEventType} from './ObserveableEventType';
//var linq = require('linq');

export interface IObserveableCollection<T extends Object> {
    On(event: string): TypedEventEmitter<T | Array<T>>;
    Add(newItem: T): T;
    AddOrUpdate(item: T): T;
    AddOrRemove(item: T): T;
    AddRange(newItems: Array<T>): Array<T>;
    Update(item: T, prop?: string): T;
    Remove(item: T | string | number | ((T) => boolean)): void;
    Clear(): void;
    Count(): number;
    Find(value: any, prop?: string | ((item: T) => string)): Array<ISearchResult<T>> | ISearchResult<T>;
    Dispose(): void;

    sourceData: Array<T>;
}
    
export interface ISearchResult<T> {
    index: number;
    object: T;
}

export interface IValuedEvent<T> {
    event: ObserveableEventType;
    items: Array<T>;
}

/**
* Observeable collection service as evented array
**/
export class ObserveableCollection<T extends Object> implements IObserveableCollection<T> {

    private _uniqueProperty: string | ((item: T) => string) = "Id";

    private _items = new Array<T>();

    private add: TypedEventEmitter<T> = new TypedEventEmitter<T>();
    private addRange: TypedEventEmitter<Array<T>> = new TypedEventEmitter<Array<T>>();
    private remove: TypedEventEmitter<T> = new TypedEventEmitter<T>();
    private update: TypedEventEmitter<T> = new TypedEventEmitter<T>();
    private collectionChanged: TypedEventEmitter<IValuedEvent<T>> = new TypedEventEmitter<IValuedEvent<T>>();

    constructor(items?: Array<T>, uniqueProperty?: string | ((item: T) => string)) {
        if(items)
            this._items = items;

        if (uniqueProperty) {
            if (typeof uniqueProperty === "string" && this._items.length > 0 && this._items.any(x => !x.hasOwnProperty(uniqueProperty)))
                throw new Error("Unique key is not present in all of collection items");

            this._uniqueProperty = uniqueProperty;
        }
    }

    get sourceData(): Array<T> {
        return this._items;
    }
        
    On(event: string): TypedEventEmitter<T | Array<T>> {
        return this[event];
    }

    Add(newItem: T): T {
        this._items.push(newItem);
        this.add.emit(newItem);
        this.collectionChanged.emit({event: ObserveableEventType.Add, items: this._items});
            
        return newItem;
    }

    AddOrUpdate(item: T): T {
        if (!this._uniqueProperty)
            throw new Error("Unique property should be set");

        var obj = this.Find(item);

        if (obj) {
            return this.Update(item);
        } else {
            return this.Add(item);
        }
    }

    AddOrRemove(item: T): T {
        if (!this._uniqueProperty)
            throw new Error("Unique property should be set");

        var obj = this.Find(item);

        if (obj) {
            this.Remove(item);

            return null;
        } else {
            return this.Add(item);
        }
    }

    AddRange(newItems: Array<T>): Array<T> {
        for (var i = 0; i < newItems.length; i++) {
            this._items.push(newItems[i]);
        }

        this.addRange.emit(newItems);
        this.collectionChanged.emit({event: ObserveableEventType.AddRange, items: this._items});
            
        return newItems;
    }

    /**
        * Updates the object. Object is searched by property name
        * @param prop Property used for object searching
        * @param item Object to be updated
        * @returns {} Updated object
        */
    Update(item: T, prop?: string): T {
        var p = prop || this._uniqueProperty;
        var obj = this.Find(item, p);

        if (obj) {
            var index = obj[0].index;

            let value = this._items[index];
            for (var x in value) {
                if (value.hasOwnProperty(x)) {
                    item[x] && (value[x] = item[x]);
                }
            }

            this.update.emit(value);
            this.collectionChanged.emit({event: ObserveableEventType.Update, items: this._items});

            return value;
        }

        return null;
    }

    UpdateExact(originalItem: T, overridingItem: T): T {
        var index = this._items.indexOf(originalItem);

        if (index === -1)
            return null;

        this._items[index] = overridingItem;

        this.update.emit(this._items[index]);
        this.collectionChanged.emit({event: ObserveableEventType.Update, items: this._items});
            
        return overridingItem;
    }

    Remove(item: T | string | number | ((T) => boolean)): void {
        if (typeof item === "object") {
            var index = -1;
            var fi = this.Find(<T>item);

            if (fi) {
                if (fi instanceof Array)
                    index = fi[0].index;
                else
                    index = fi.index;
            }

            if (index > -1) {
                this.remove.emit(this._items[index]);
                this.collectionChanged.emit({event: ObserveableEventType.Remove, items: this._items});

                this._items.splice(index, 1);
            }
        } else {
            if (typeof item !== "function") {
                var key = item;

                if (typeof this._uniqueProperty === 'string')
                    item = x => x[<any>this._uniqueProperty] === key;
                else
                    item = x => (<any>this._uniqueProperty)(x) === key;
            }

            var foundItems = this._items.where(<any>item).toArray();
            for (var i = 0; i < foundItems.length; i++) {
                this.Remove(foundItems[i]);
            }
        }
    }

    Clear(): void {
        this.sourceData.length = 0;
    }

    Find(item: T, prop?: string | ((item: T) => string)): Array<ISearchResult<T>> | ISearchResult<T> {
        var result = [];

        if (!prop && !this._uniqueProperty) {
            var index = this._items.indexOf(item);
            if (index === -1)
                return null;
            else
                return {
                    object: this._items[index],
                    index: index
                };
        } else {
            var p: any = prop || this._uniqueProperty;

            var val;
            var selector: (item: T) => any;

            if (typeof p === "string") {
                val = item[<any>p];
                selector = (item: T) => item[<any>p];
            } else {
                val = (<((item: T) => string)>this._uniqueProperty)(item);
                selector = (item: T) => (<((item: T) => string)>p)(item);
            }

            for (var i = 0; i < this._items.length; i++) {
                if (selector(this._items[i]) === val) {
                    result.push({
                        index: i,
                        object: this._items[i]
                    });
                }
            }    
        }
            
        return result.length > 0 ? result : null;
    }

    FindAll(value: any, prop?: string | ((item: T) => string)): Array<ISearchResult<T>> | ISearchResult<T> {
        var result = [];

        if (!prop && !this._uniqueProperty) {
            var index = this._items.indexOf(value);
            if (index === -1)
                return null;
            else
                return {
                    object: this._items[index],
                    index: index
                };
        } else {
            var p = prop || this._uniqueProperty;

            var selector: (item: T) => any;

            if (typeof p === "string") {
                selector = (item: T) => item[<any>p];
            } else {
                selector = (item: T) => (<any>p)(item);
            }

            for (var i = 0; i < this._items.length; i++) {
                if (selector(this._items[i]) === value) {
                    result.push({
                        index: i,
                        object: this._items[i]
                    });
                }
            }
        }

        return result.length > 0 ? result : null;
    }

    Count(): number {
        return this._items.length;
    }

    Dispose() {
        this.add.unsubscribe();
        this.addRange.unsubscribe();
        this.update.unsubscribe();
        this.remove.unsubscribe();
        this.collectionChanged.unsubscribe();

        this._items = null;
    }
}
