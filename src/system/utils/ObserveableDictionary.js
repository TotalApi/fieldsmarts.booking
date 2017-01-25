"use strict";
/**
    * Observeable collection service as evented array
    **/
var ObserveableDictionary = (function () {
    function ObserveableDictionary(items) {
        this._items = {};
        this._listeners = {
            "add": Array(),
            "addRange": Array(),
            "remove": Array(),
            "update": Array(),
            "collectionChanged": Array()
        };
        if (items)
            this._items = items;
    }
    ObserveableDictionary.prototype.on = function (p1, p2) {
        if (p1 && p2) {
            if (!this._listeners[p1])
                throw Error("Cannot listen for event " + p1);
            this._listeners[p1].push(p2);
        }
        else if (p1) {
            if (!this._listeners["collectionChanged"])
                throw Error("Cannot listen for event " + event);
            this._listeners["collectionChanged"].push(p1);
        }
        return this;
    };
    ObserveableDictionary.prototype._collectionChanged = function (event) {
        var _this = this;
        this._listeners["collectionChanged"].forEach(function (callback) {
            callback(event, _this.getDictionary());
        });
    };
    ObserveableDictionary.prototype.add = function (key, newItem) {
        this._items[key] = newItem;
        this._listeners["add"].forEach(function (callback) {
            callback(key, newItem);
        });
        this._collectionChanged("add");
    };
    ObserveableDictionary.prototype.addRange = function (newItems) {
        var keys = Object.keys(newItems);
        for (var i = 0; i < keys.length; i++) {
            this._items[keys[i]] = newItems[keys[i]];
        }
        this._listeners["addRange"].forEach(function (callback) {
            callback(newItems);
        });
        this._collectionChanged("addRange");
    };
    ObserveableDictionary.prototype.update = function (key, item) {
        this._items[key] = item;
        this._listeners["update"].forEach(function (callback) {
            callback(key, item);
        });
        this._collectionChanged("update");
    };
    ObserveableDictionary.prototype.remove = function (key) {
        var item = this._items[key];
        delete this._items[key];
        this._listeners["remove"].forEach(function (callback) {
            callback(key, item);
        });
        this._collectionChanged("remove");
    };
    ObserveableDictionary.prototype.getValues = function () {
        return Enumerable.from(this._items).select(function (kv, i) {
            return kv.value;
        }).toArray();
    };
    ObserveableDictionary.prototype.getDictionary = function () {
        return this._items;
    };
    return ObserveableDictionary;
}());
exports.ObserveableDictionary = ObserveableDictionary;
//# sourceMappingURL=ObserveableDictionary.js.map