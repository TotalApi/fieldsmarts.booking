"use strict";
var TypedEventEmitter_1 = require("./TypedEventEmitter");
var WebWorkersManager = (function () {
    function WebWorkersManager() {
        this._fromMainThread = {};
        this._toMainThread = {};
    }
    WebWorkersManager.$fromMain = function (messageType, workers) {
        return WebWorkersManager.Instance.fromMainThread(messageType, workers);
    };
    WebWorkersManager.$toMain = function (messageType, workers) {
        return WebWorkersManager.Instance.toMainThread(messageType, workers);
    };
    WebWorkersManager.prototype.fromMainThread = function (messageType, workers) {
        var _this = this;
        if (!this._fromMainThread[messageType]) {
            this._fromMainThread[messageType] = new TypedEventEmitter_1.TypedEventEmitter();
            if (workers) {
                for (var _i = 0, workers_1 = workers; _i < workers_1.length; _i++) {
                    var worker = workers_1[_i];
                    if (worker) {
                        (function (w) {
                            _this._fromMainThread[messageType].subscribe(function (e) {
                                w.postMessage({ type: messageType, message: e });
                            });
                        })(worker);
                    }
                }
            }
            else {
                onmessage = function (e) {
                    _this._fromMainThread[e.data.type].emit(e.data.message);
                };
            }
        }
        return this._fromMainThread[messageType];
    };
    WebWorkersManager.prototype.toMainThread = function (messageType, workers) {
        var _this = this;
        if (!this._toMainThread[messageType]) {
            this._toMainThread[messageType] = new TypedEventEmitter_1.TypedEventEmitter();
            if (workers) {
                for (var _i = 0, workers_2 = workers; _i < workers_2.length; _i++) {
                    var worker = workers_2[_i];
                    worker.onmessage = function (e) {
                        _this._toMainThread[e.data.type].emit(e.data.message);
                    };
                }
            }
            else {
                this._toMainThread[messageType].subscribe(function (e) {
                    postMessage({ type: messageType, message: e });
                });
            }
        }
        return this._toMainThread[messageType];
    };
    Object.defineProperty(WebWorkersManager.prototype, "fromMainThreadAll", {
        get: function () {
            var _this = this;
            return Object.keys(this._fromMainThread).map(function (key) {
                return _this._fromMainThread[key];
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebWorkersManager.prototype, "toMainThreadAll", {
        get: function () {
            var _this = this;
            return Object.keys(this._toMainThread).map(function (key) {
                return _this._toMainThread[key];
            });
        },
        enumerable: true,
        configurable: true
    });
    return WebWorkersManager;
}());
WebWorkersManager.Instance = new WebWorkersManager();
exports.WebWorkersManager = WebWorkersManager;
//# sourceMappingURL=WebWorkersManager.js.map