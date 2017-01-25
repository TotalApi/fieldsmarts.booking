"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = require("rxjs/Subject");
var TypedEventEmitter = (function (_super) {
    __extends(TypedEventEmitter, _super);
    function TypedEventEmitter() {
        return _super.call(this) || this;
    }
    TypedEventEmitter.prototype.emit = function (value) {
        _super.prototype.next.call(this, value);
    };
    return TypedEventEmitter;
}(Subject_1.Subject));
exports.TypedEventEmitter = TypedEventEmitter;
//# sourceMappingURL=TypedEventEmitter.js.map