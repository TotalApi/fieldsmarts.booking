"use strict";
var TypedEventEmitter_1 = require("./TypedEventEmitter");
var ObserveableEventType_1 = require("./ObserveableEventType");
/**
* Observeable collection service as evented array
**/
var ObserveableCollection = (function () {
    function ObserveableCollection(items, uniqueProperty) {
        this._uniqueProperty = "Id";
        this._items = new Array();
        this.add = new TypedEventEmitter_1.TypedEventEmitter();
        this.addRange = new TypedEventEmitter_1.TypedEventEmitter();
        this.remove = new TypedEventEmitter_1.TypedEventEmitter();
        this.update = new TypedEventEmitter_1.TypedEventEmitter();
        this.collectionChanged = new TypedEventEmitter_1.TypedEventEmitter();
        if (items)
            this._items = items;
        if (uniqueProperty) {
            if (typeof uniqueProperty === "string" && this._items.length > 0 && this._items.any(function (x) { return !x.hasOwnProperty(uniqueProperty); }))
                throw new Error("Unique key is not present in all of collection items");
            this._uniqueProperty = uniqueProperty;
        }
    }
    Object.defineProperty(ObserveableCollection.prototype, "sourceData", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    ObserveableCollection.prototype.On = function (event) {
        return this[event];
    };
    ObserveableCollection.prototype.Add = function (newItem) {
        this._items.push(newItem);
        this.add.emit(newItem);
        this.collectionChanged.emit({ event: ObserveableEventType_1.ObserveableEventType.Add, items: this._items });
        return newItem;
    };
    ObserveableCollection.prototype.AddOrUpdate = function (item) {
        if (!this._uniqueProperty)
            throw new Error("Unique property should be set");
        var obj = this.Find(item);
        if (obj) {
            return this.Update(item);
        }
        else {
            return this.Add(item);
        }
    };
    ObserveableCollection.prototype.AddOrRemove = function (item) {
        if (!this._uniqueProperty)
            throw new Error("Unique property should be set");
        var obj = this.Find(item);
        if (obj) {
            this.Remove(item);
            return null;
        }
        else {
            return this.Add(item);
        }
    };
    ObserveableCollection.prototype.AddRange = function (newItems) {
        for (var i = 0; i < newItems.length; i++) {
            this._items.push(newItems[i]);
        }
        this.addRange.emit(newItems);
        this.collectionChanged.emit({ event: ObserveableEventType_1.ObserveableEventType.AddRange, items: this._items });
        return newItems;
    };
    /**
        * Updates the object. Object is searched by property name
        * @param prop Property used for object searching
        * @param item Object to be updated
        * @returns {} Updated object
        */
    ObserveableCollection.prototype.Update = function (item, prop) {
        var p = prop || this._uniqueProperty;
        var obj = this.Find(item, p);
        if (obj) {
            var index = obj[0].index;
            var value = this._items[index];
            for (var x in value) {
                if (value.hasOwnProperty(x)) {
                    item[x] && (value[x] = item[x]);
                }
            }
            this.update.emit(value);
            this.collectionChanged.emit({ event: ObserveableEventType_1.ObserveableEventType.Update, items: this._items });
            return value;
        }
        return null;
    };
    ObserveableCollection.prototype.UpdateExact = function (originalItem, overridingItem) {
        var index = this._items.indexOf(originalItem);
        if (index === -1)
            return null;
        this._items[index] = overridingItem;
        this.update.emit(this._items[index]);
        this.collectionChanged.emit({ event: ObserveableEventType_1.ObserveableEventType.Update, items: this._items });
        return overridingItem;
    };
    ObserveableCollection.prototype.Remove = function (item) {
        var _this = this;
        if (typeof item === "object") {
            var index = -1;
            var fi = this.Find(item);
            if (fi) {
                if (fi instanceof Array)
                    index = fi[0].index;
                else
                    index = fi.index;
            }
            if (index > -1) {
                this.remove.emit(this._items[index]);
                this.collectionChanged.emit({ event: ObserveableEventType_1.ObserveableEventType.Remove, items: this._items });
                this._items.splice(index, 1);
            }
        }
        else {
            if (typeof item !== "function") {
                var key = item;
                if (typeof this._uniqueProperty === 'string')
                    item = function (x) { return x[_this._uniqueProperty] === key; };
                else
                    item = function (x) { return _this._uniqueProperty(x) === key; };
            }
            var foundItems = this._items.where(item).toArray();
            for (var i = 0; i < foundItems.length; i++) {
                this.Remove(foundItems[i]);
            }
        }
    };
    ObserveableCollection.prototype.Clear = function () {
        this.sourceData.length = 0;
    };
    ObserveableCollection.prototype.Find = function (item, prop) {
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
        }
        else {
            var p = prop || this._uniqueProperty;
            var val;
            var selector;
            if (typeof p === "string") {
                val = item[p];
                selector = function (item) { return item[p]; };
            }
            else {
                val = this._uniqueProperty(item);
                selector = function (item) { return p(item); };
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
    };
    ObserveableCollection.prototype.FindAll = function (value, prop) {
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
        }
        else {
            var p = prop || this._uniqueProperty;
            var selector;
            if (typeof p === "string") {
                selector = function (item) { return item[p]; };
            }
            else {
                selector = function (item) { return p(item); };
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
    };
    ObserveableCollection.prototype.Count = function () {
        return this._items.length;
    };
    ObserveableCollection.prototype.Dispose = function () {
        this.add.unsubscribe();
        this.addRange.unsubscribe();
        this.update.unsubscribe();
        this.remove.unsubscribe();
        this.collectionChanged.unsubscribe();
        this._items = null;
    };
    return ObserveableCollection;
}());
exports.ObserveableCollection = ObserveableCollection;
//# sourceMappingURL=ObserveableCollection.js.map