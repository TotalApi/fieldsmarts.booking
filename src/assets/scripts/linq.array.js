// extension for Array
(function () {
    var linq = require('linq');
    if (!linq) {
        throw new Error("can't find Enumerable. linq.array.js must load after linq.js");
    }
    linq.Utils.extendTo(Array);
    window['linq'] = linq;
})(this);

