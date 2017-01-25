"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SaleBase = (function () {
    function SaleBase() {
    }
    return SaleBase;
}());
exports.SaleBase = SaleBase;
var AvailableTimeSlots = (function (_super) {
    __extends(AvailableTimeSlots, _super);
    function AvailableTimeSlots() {
        var _this = _super.apply(this, arguments) || this;
        _this.availableTimeSlots = new Array();
        return _this;
    }
    return AvailableTimeSlots;
}(SaleBase));
exports.AvailableTimeSlots = AvailableTimeSlots;
var SalesSchedule = (function () {
    function SalesSchedule(dayOfTheWeek) {
        this.dayOfTheWeek = dayOfTheWeek;
        this.times = new Array();
    }
    return SalesSchedule;
}());
exports.SalesSchedule = SalesSchedule;
var SalesConsultant = (function () {
    function SalesConsultant() {
    }
    return SalesConsultant;
}());
exports.SalesConsultant = SalesConsultant;
var Sales = (function (_super) {
    __extends(Sales, _super);
    function Sales() {
        var _this = _super.call(this) || this;
        _this.validateContactFirstName = function (value, model) {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTFIRSTNAMEREQUIRED";
            }
            return '';
        };
        _this.validateContactLastName = function (value, model) {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTLASTNAMEREQUIRED";
            }
            return '';
        };
        _this.validateContactPhone = function (value, model) {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTPHONEREQUIRED";
            } /*else if (!Util.IsValidPhoneNumber(value)) {
                return 'INVLIDPHONENUMBBER';
            }*/
            else {
                return '';
            }
        };
        _this.validateContactEmail = function (value, model) {
            if (!value || value.toString().trim().length == 0) {
                return "CONTACTEMAILREQUIRED";
            } /*else if (!Util.IsValidEmail(value)) {
                return 'INVLIDEMAIL';
            }*/
            else {
                return '';
            }
        };
        _this.franchisee = null;
        _this.salesNumber = null;
        _this.isOther = false;
        _this.isCommercial = false;
        _this.address1 = "";
        _this.address2 = "";
        _this.city = "";
        _this.state = "";
        _this.country = "";
        _this.preferredMethodOfContact = "EMAIL";
        _this.preferredLanguage = "English";
        _this.isOutOfBounds = false;
        _this.lockedBy = null;
        _this.lockedDate = null;
        _this.isRepaintedSurface = false;
        _this.isRustedSurface = false;
        _this.isWoodSurface = false;
        _this.isQualifiedLead = true;
        return _this;
    }
    return Sales;
}(SaleBase));
exports.Sales = Sales;
var PostBooking = (function () {
    function PostBooking() {
    }
    return PostBooking;
}());
exports.PostBooking = PostBooking;
var PostCodeAssignment = (function () {
    function PostCodeAssignment() {
    }
    return PostCodeAssignment;
}());
exports.PostCodeAssignment = PostCodeAssignment;
//# sourceMappingURL=Sales.js.map