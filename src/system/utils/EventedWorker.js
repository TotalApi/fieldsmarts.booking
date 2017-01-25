"use strict";
var WebWorkersManager_1 = require("./WebWorkersManager");
var ObserveableEventType_1 = require("./ObserveableEventType");
var EventedWorker = (function () {
    function EventedWorker(channel, workers) {
        this.workers = workers;
        this.channel = channel;
    }
    EventedWorker.prototype.send = function (type, value) {
        WebWorkersManager_1.WebWorkersManager.$fromMain(type, this.workers).emit(value);
    };
    EventedWorker.prototype.receive = function (type) {
        return WebWorkersManager_1.WebWorkersManager.$toMain(type, this.workers);
    };
    EventedWorker.prototype.add = function (value) {
        WebWorkersManager_1.WebWorkersManager.$fromMain(this.channel + "_" + ObserveableEventType_1.ObserveableEventType.Add, this.workers).emit(value);
    };
    EventedWorker.prototype.addRange = function (value) {
        WebWorkersManager_1.WebWorkersManager.$fromMain(this.channel + "_" + ObserveableEventType_1.ObserveableEventType.AddRange, this.workers).emit(value);
    };
    EventedWorker.prototype.remove = function (value) {
        WebWorkersManager_1.WebWorkersManager.$fromMain(this.channel + "_" + ObserveableEventType_1.ObserveableEventType.Remove, this.workers).emit(value);
    };
    EventedWorker.prototype.update = function (value) {
        WebWorkersManager_1.WebWorkersManager.$fromMain(this.channel + "_" + ObserveableEventType_1.ObserveableEventType.Update, this.workers).emit(value);
    };
    EventedWorker.prototype.terminate = function () {
        this.workers.forEach(function (w) { return w.terminate(); });
    };
    return EventedWorker;
}());
exports.EventedWorker = EventedWorker;
//# sourceMappingURL=EventedWorker.js.map