"use strict";
var core_1 = require("@angular/core");
var SuiSearchService = (function () {
    function SuiSearchService() {
        this.searchDelay = 200;
        this.loading = false;
        this.onSearchCompleted = new core_1.EventEmitter();
        this._options = [];
        this.allowEmptyQuery = false;
        this._query = "";
        this._results = [];
        this._resultsCache = {};
    }
    Object.defineProperty(SuiSearchService.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            if (typeof (value) == "function") {
                this._optionsLookup = value;
                return;
            }
            this._options = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiSearchService.prototype, "query", {
        get: function () {
            return this._query;
        },
        enumerable: true,
        configurable: true
    });
    SuiSearchService.prototype.updateQuery = function (value, search) {
        var _this = this;
        if (search === void 0) { search = true; }
        this._query = value;
        if (search) {
            if (this.searchDelay > 0) {
                clearTimeout(this._queryTimer);
                if (value || this.allowEmptyQuery) {
                    this._queryTimer = setTimeout(function () { return _this.search(); }, this.searchDelay);
                    return;
                }
            }
            if (value || this.allowEmptyQuery) {
                this.search();
            }
        }
    };
    Object.defineProperty(SuiSearchService.prototype, "results", {
        get: function () {
            return this._results;
        },
        enumerable: true,
        configurable: true
    });
    SuiSearchService.prototype.search = function () {
        var _this = this;
        if (this._optionsLookup) {
            this.loading = true;
            if (this._resultsCache[this._query]) {
                this.loading = false;
                this._results = this._resultsCache[this._query];
                this.onSearchCompleted.emit(this.results);
                return;
            }
            this._optionsLookup(this._query).then(function (results) {
                _this.loading = false;
                _this._resultsCache[_this._query] = results;
                _this._results = results;
                _this.onSearchCompleted.emit(_this.results);
            });
            return;
        }
        this._results = this.options.filter(function (o) { return _this.readValue(o).toString().slice(0, _this.query.length).toLowerCase() == _this.query.toLowerCase(); });
        this.onSearchCompleted.emit(this.results);
    };
    //noinspection JSMethodCanBeStatic
    SuiSearchService.prototype.deepValue = function (object, path) {
        if (!object) {
            return;
        }
        if (!path) {
            return object;
        }
        for (var i = 0, p = path.split('.'), len = p.length; i < len; i++) {
            object = object[p[i]];
        }
        return object;
    };
    SuiSearchService.prototype.readValue = function (object) {
        return this.deepValue(object, this.optionsField);
    };
    return SuiSearchService;
}());
exports.SuiSearchService = SuiSearchService;
//# sourceMappingURL=search.service.js.map