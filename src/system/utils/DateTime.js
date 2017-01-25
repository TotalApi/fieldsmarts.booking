"use strict";
var DateTime;
(function (DateTime) {
    /**
        * Преобразует строковое представление Newton.Json и Asp.Net даты в Date.
        */
    function ToDate(obj) {
        var res = obj;
        if (obj.length >= 19
            && obj[4] === "-"
            && obj[7] === "-"
            && obj[10] === "T"
            && obj[13] === ":"
            && obj[16] === ":")
            try {
                res = new Date(obj);
            }
            catch (e) { }
        else if (obj.indexOf("/Date(") === 0)
            try {
                res = new Date(parseInt(obj.substr(6)));
            }
            catch (e) { }
        return res;
    }
    DateTime.ToDate = ToDate;
})(DateTime = exports.DateTime || (exports.DateTime = {}));
//# sourceMappingURL=DateTime.js.map