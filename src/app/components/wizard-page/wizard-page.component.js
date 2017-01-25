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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ng = require("@angular/core");
var ngForms = require("@angular/forms");
var rx = require("rxjs");
var app_component_decorator_1 = require("src/system/decorators/app-component.decorator");
var wizard_service_1 = require("../../services/wizard.service");
var WizardPageComponent = (function () {
    function WizardPageComponent(wizard) {
        this.wizard = wizard;
        this.loading = false;
    }
    WizardPageComponent.prototype.ngOnInit = function () {
        this.id = this.id || this.wizard.current;
        this.class = this.class || '';
        if (typeof this.back === 'boolean') {
            this.back = { isHidden: !this.back };
        }
        if (typeof this.next === 'boolean') {
            this.next = { isHidden: !this.next };
        }
        this.back = this.back || { isHidden: false };
        this.next = this.next || { isHidden: false };
        if (typeof this.back === 'string') {
            this.back = { caption: this.back };
        }
        if (typeof this.next === 'string') {
            this.next = { caption: this.next };
        }
        if (!this.back.isHidden && !this.back.caption) {
            this.back.caption = 'BACK';
        }
        if (!this.next.isHidden && !this.next.caption) {
            this.next.caption = 'NEXT ->';
        }
        this.wizard.updateState();
    };
    WizardPageComponent.prototype.execute = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loading = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, this.execute$(command)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.loading = false;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WizardPageComponent.prototype.execute$ = function (command, ignoreRoute) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.wizard.updateState();
                        if (!command)
                            return [3 /*break*/, 6];
                        if (!(command.action && !ignoreRoute))
                            return [3 /*break*/, 5];
                        res = command.action(command);
                        if (!(res instanceof rx.Observable || res instanceof Promise))
                            return [3 /*break*/, 2];
                        if (res instanceof rx.Observable) {
                            res = res.toPromise();
                        }
                        return [4 /*yield*/, res];
                    case 1:
                        res = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!res)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.execute$(command, true)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (command.route) {
                            this.wizard.go(command.route);
                        }
                        else if (command === this.back) {
                            this.wizard.back(this.id);
                        }
                        else if (command === this.next) {
                            this.wizard.next(this.id);
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return WizardPageComponent;
}());
__decorate([
    ng.Input('id'),
    __metadata("design:type", String)
], WizardPageComponent.prototype, "id", void 0);
__decorate([
    ng.Input('class'),
    __metadata("design:type", String)
], WizardPageComponent.prototype, "class", void 0);
__decorate([
    ng.Input('title'),
    __metadata("design:type", String)
], WizardPageComponent.prototype, "title", void 0);
__decorate([
    ng.Input('description'),
    __metadata("design:type", String)
], WizardPageComponent.prototype, "description", void 0);
__decorate([
    ng.Input('back'),
    __metadata("design:type", Object)
], WizardPageComponent.prototype, "back", void 0);
__decorate([
    ng.Input('next'),
    __metadata("design:type", Object)
], WizardPageComponent.prototype, "next", void 0);
__decorate([
    ng.Input('error'),
    __metadata("design:type", String)
], WizardPageComponent.prototype, "error", void 0);
__decorate([
    ng.ViewChild('ussForm'),
    __metadata("design:type", ngForms.NgForm)
], WizardPageComponent.prototype, "ussForm", void 0);
WizardPageComponent = __decorate([
    ng.Component({
        selector: 'wizard-page',
        styleUrls: ['./wizard-page.component.scss'],
        templateUrl: './wizard-page.component.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_component_decorator_1.AppComponent(),
    __metadata("design:paramtypes", [wizard_service_1.AppWizardService])
], WizardPageComponent);
exports.WizardPageComponent = WizardPageComponent;
//# sourceMappingURL=wizard-page.component.js.map