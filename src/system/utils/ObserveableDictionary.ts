
export interface IObserveableDictionary<T> {
    on(event: string, callback: (key, T) => void): IObserveableDictionary<T>;
    add(key, newItem: T): void;
    addRange(newItems: { [id: string]: T }): void;
    update(key, item: T): void;
    remove(key): void;
    getDictionary(): { [id: string]: T };
    getValues(): Array<T>;
}

/**
    * Observeable collection service as evented array
    **/
export class ObserveableDictionary<T> implements IObserveableDictionary<T> {

    private _items: { [id: string]: T } = {};
    private _listeners: { [id: string]: any } = {
        "add": Array<(T) => void>(),
        "addRange": Array<(arr: Array<T>) => void>(),
        "remove": Array<(T) => void>(),
        "update": Array<(T) => void>(),
        "collectionChanged": Array<(T) => void>()
    };

    constructor(items?: { [id: string]: any }) {
        if(items)
            this._items = items;
    }

    public on(callback: (event: string, T) => void): IObserveableDictionary<T>;
    public on(event: string, callback: (key, T) => void): IObserveableDictionary<T>;
    public on(p1, p2?): IObserveableDictionary<T>
    {
        if (p1 && p2) {
            if (!this._listeners[p1]) throw Error("Cannot listen for event " + p1);
            this._listeners[p1].push(p2);
        } else if(p1) {
            if (!this._listeners["collectionChanged"]) throw Error("Cannot listen for event " + event);
            this._listeners["collectionChanged"].push(p1);
        }
        return this;
    }

    private _collectionChanged(event: string) {
        this._listeners["collectionChanged"].forEach((callback: (event: string, arr: { [id: string]: T }) => void) => {
            callback(event, this.getDictionary());
        });
    }

    public add(key, newItem: T): void {
        this._items[key] = newItem;
        this._listeners["add"].forEach((callback: (key, T) => void) => {
            callback(key, newItem);
        });
        this._collectionChanged("add");
    }

    public addRange(newItems: { [id: string]: T }): void {
        var keys = Object.keys(newItems);
        for (var i = 0; i < keys.length; i++) {
            this._items[keys[i]] = newItems[keys[i]];
        }
        this._listeners["addRange"].forEach((callback: (arr: { [id: string]: T }) => void) => {
            callback(newItems);
        });
        this._collectionChanged("addRange");
    }

    public update(key, item: T): void {
        this._items[key] = item;

        this._listeners["update"].forEach((callback: (key, T) => void) => {
            callback(key, item);
        });
        this._collectionChanged("update");
    }

    public remove(key): void {
        var item = this._items[key];
        delete this._items[key];

        this._listeners["remove"].forEach((callback: (key, T) => void) => {
            callback(key, item);
        });
        this._collectionChanged("remove");
    }

    public getValues(): Array<T> {
        return Enumerable.from(this._items).select((kv, i) => {
            return kv.value;
        }).toArray();
    }

    public getDictionary(): { [id: string]: T } {
        return this._items;
    }
}
