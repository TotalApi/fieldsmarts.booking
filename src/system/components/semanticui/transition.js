"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var SuiTransition = (function () {
    function SuiTransition(el, renderer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this._isAnimating = false;
        this._isVisible = null;
        this.queue = [];
        this.renderer.setElementClass(this.el.nativeElement, "transition", true);
        setTimeout(function () {
            var style = window.getComputedStyle(_this.el.nativeElement);
            if (_this.isVisible === null) {
                _this.isVisible = style.display !== 'none';
            }
        });
    }
    Object.defineProperty(SuiTransition.prototype, "isAnimating", {
        get: function () {
            return this._isAnimating;
        },
        set: function (value) {
            this._isAnimating = value;
            this.renderer.setElementClass(this.el.nativeElement, "animating", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiTransition.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = value;
            this.renderer.setElementClass(this.el.nativeElement, "visible", value);
            this.isHidden = this.isVisible !== null && !this.isVisible && !this.isAnimating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SuiTransition.prototype, "isHidden", {
        get: function () {
            return this._isHidden;
        },
        set: function (value) {
            this._isHidden = value;
            this.renderer.setElementClass(this.el.nativeElement, "hidden", value);
        },
        enumerable: true,
        configurable: true
    });
    SuiTransition.prototype.queueFirst = function () {
        return this.queue.slice(0, 1).pop();
    };
    SuiTransition.prototype.queueLast = function () {
        return this.queue.slice(-1).pop();
    };
    SuiTransition.prototype.animate = function (animation) {
        animation = Object.assign({}, animation);
        var anim = animation;
        anim.classes = animation.name.split(" ");
        if (!anim.duration) {
            anim.duration = 250;
        }
        if (!anim.display) {
            anim.display = 'block';
        }
        if (!anim.static) {
            anim.static = ["jiggle", "flash", "shake", "pulse", "tada", "bounce"].indexOf(anim.name) != -1;
        }
        if (!anim.direction) {
            anim.direction = this.isVisible ? "out" : "in";
            var queueLast = this.queueLast();
            if (queueLast) {
                anim.direction = queueLast.direction == "in" ? "out" : "in";
            }
        }
        this.queue.push(animation);
        this.performAnimation();
    };
    SuiTransition.prototype.performAnimation = function () {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        var animation = this.queue.slice(0, 1).pop();
        if (!animation) {
            return;
        }
        this.isAnimating = true;
        this.isVisible = true;
        this.isHidden = false;
        animation.classes.forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, true); });
        this.renderer.setElementClass(this.el.nativeElement, animation.direction, true);
        this.renderer.setElementStyle(this.el.nativeElement, "animationDuration", animation.duration + "ms");
        if (animation.direction == "in") {
            this.renderer.setElementStyle(this.el.nativeElement, "display", animation.display);
        }
        this.animationTimeout = setTimeout(function () { return _this.finishAnimation(animation); }, animation.duration);
    };
    SuiTransition.prototype.finishAnimation = function (animation) {
        var _this = this;
        this.isAnimating = false;
        animation.classes.forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, false); });
        this.renderer.setElementClass(this.el.nativeElement, animation.direction, false);
        this.renderer.setElementStyle(this.el.nativeElement, "animationDuration", null);
        this.renderer.setElementStyle(this.el.nativeElement, "display", null);
        this.isVisible = animation.direction == "in" ? true : false;
        if (animation.static) {
            this.isVisible = !this.isVisible;
        }
        if (animation.callback) {
            animation.callback();
        }
        this.queue.shift();
        this.performAnimation();
    };
    SuiTransition.prototype.stop = function () {
        if (this.isAnimating) {
            clearTimeout(this.animationTimeout);
            this.finishAnimation(this.queueFirst());
        }
    };
    SuiTransition.prototype.stopAll = function () {
        if (this.isAnimating) {
            clearTimeout(this.animationTimeout);
            this.finishAnimation(this.queueFirst());
        }
        this.clearQueue();
    };
    SuiTransition.prototype.clearQueue = function () {
        if (this.isAnimating) {
            this.queue = [this.queueFirst()];
            return;
        }
        this.queue = [];
    };
    return SuiTransition;
}());
SuiTransition = __decorate([
    core_1.Directive({
        selector: '[suiTransition]',
        exportAs: 'transition'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], SuiTransition);
exports.SuiTransition = SuiTransition;
exports.SUI_TRANSITION_DIRECTIVES = [SuiTransition];
//# sourceMappingURL=transition.js.map