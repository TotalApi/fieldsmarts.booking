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
var app_routes_1 = require("src/app/app.routes");
var wizard_service_1 = require("../../services/wizard.service");
var Sales_1 = require("../../models/Sales");
var sales_service_1 = require("../../services/sales.service");
var account_service_1 = require("../../services/account.service");
var franchise_service_1 = require("../../services/franchise.service");
var AppWizardPostCodePage = (function () {
    function AppWizardPostCodePage(sales, wizard, account, franchise) {
        var _this = this;
        this.sales = sales;
        this.wizard = wizard;
        this.account = account;
        this.franchise = franchise;
        this.defaultBackAction = { action: function () { return _this.wizard.back(); }, caption: 'BACK' };
        this.defaultNextAction = { action: function () { return _this.checkPostCode(); }, caption: 'NEXT ->' };
        this.backAction = this.defaultBackAction;
        this.nextAction = this.defaultNextAction;
    }
    AppWizardPostCodePage.prototype.saveLead = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sale;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sale = new Sales_1.Sales();
                        sale.franchisee = this.wizard.data.franchise;
                        sale.address1 = this.wizard.data.address;
                        sale.contactEmail = this.wizard.data.email;
                        sale.contactFirstName = this.wizard.data.firstName;
                        sale.contactLastName = this.wizard.data.lastName;
                        sale.contactFirstName = this.wizard.data.firstName;
                        sale.contactPhone = this.wizard.data.phoneNumber;
                        sale.postCode = this.wizard.data.postalCode;
                        return [4 /*yield*/, this.sales.save(sale)];
                    case 1:
                        sale = _a.sent();
                        this.wizard.data.salesNumber = sale.salesNumber;
                        this.wizard.data.franchise = sale.franchisee;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AppWizardPostCodePage.prototype.checkPostCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var ass, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false)];
                    case 1:
                        ass = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.sales.getPostCodeAssignmentForSale(this.wizard.data.postalCode, false)];
                    case 3:
                        ass = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        this.errorState = 'invalid_code';
                        this.error = 'Unfortunatelly we do not serve your area';
                        this.nextAction = { caption: 'Alert me instead ->', action: function () { return alert('Alert!!!!!'); } };
                        this.backAction = { isHidden: true };
                        return [2 /*return*/, false];
                    case 5:
                        if (!ass.isOutOfBounds)
                            return [3 /*break*/, 7];
                        this.errorState = 'outbound_code';
                        this.error = 'You are a little outside our service area';
                        this.nextAction = {
                            caption: 'Go to SPRAY-NET.COM',
                            action: function () {
                                window.location.href = 'http://spray-net.com';
                            }
                        };
                        this.backAction = {
                            caption: 'BACK',
                            action: function () {
                                _this.errorState = '';
                                _this.error = '';
                                _this.backAction = _this.defaultBackAction;
                                _this.nextAction = _this.defaultNextAction;
                            }
                        };
                        _a = this;
                        return [4 /*yield*/, this.account.getUserInfo(ass.salesConsultant)];
                    case 6:
                        _a.consultant = _b.sent();
                        this.franchise.get(this.consultant.franchise, this.consultant.region).then(function (fran) {
                            if (fran) {
                                _this.consultant.franchise = fran.displayName;
                                _this.consultant.userName = _this.consultant.userName || fran.email;
                                _this.consultant.tel = _this.consultant.tel || fran.tel;
                            }
                        });
                        _b.label = 7;
                    case 7: 
                    //        return await this.saveLead();
                    return [2 /*return*/, true];
                }
            });
        });
    };
    return AppWizardPostCodePage;
}());
AppWizardPostCodePage = __decorate([
    ng.Component({
        styleUrls: ['./wizard-postcode.page.scss'],
        templateUrl: './wizard-postcode.page.html',
        encapsulation: ng.ViewEncapsulation.None
    }),
    app_routes_1.AppRoute({ path: 'wizard-postcode' }),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        wizard_service_1.AppWizardService,
        account_service_1.AccountService,
        franchise_service_1.FranchiseService])
], AppWizardPostCodePage);
exports.AppWizardPostCodePage = AppWizardPostCodePage;
//# sourceMappingURL=wizard-postcode.page.js.map