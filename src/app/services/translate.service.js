"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var system_1 = require("src/system");
var ng2Translate = require("ng2-translate");
var AppTranslateService = (function () {
    function AppTranslateService(translate) {
        var _this = this;
        this.translate = translate;
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
        translate.onLangChange.subscribe(function (e) { return _this.langChanged(e); });
    }
    AppTranslateService.prototype.langChanged = function (e) {
    };
    AppTranslateService.prototype.init = function () {
    };
    return AppTranslateService;
}());
AppTranslateService = __decorate([
    core_1.Injectable(),
    system_1.AppService(),
    __metadata("design:paramtypes", [ng2Translate.TranslateService])
], AppTranslateService);
exports.AppTranslateService = AppTranslateService;
var AppTranslateLoader = (function (_super) {
    __extends(AppTranslateLoader, _super);
    function AppTranslateLoader(_http, _prefix, _suffix) {
        var _this = _super.call(this, _http, _prefix, _suffix) || this;
        _this._http = _http;
        _this._prefix = _prefix;
        _this._suffix = _suffix;
        return _this;
    }
    AppTranslateLoader.prototype.getTranslation = function (lang) {
        if (lang !== 'en' && lang !== 'fr')
            lang = 'en';
        return _super.prototype.getTranslation.call(this, "lang_" + lang);
        /*
                return this._http.get(this._prefix + "/" + `lang_${lang}` + this._suffix)
                    .map((res: Response) => {
                        try {
                            return res.json();
                        } catch (e) {
                            return undefined;
                        }
                    });
        */
    };
    return AppTranslateLoader;
}(ng2Translate.TranslateStaticLoader));
exports.AppTranslateLoader = AppTranslateLoader;
var AppMissingTranslationHandler = (function (_super) {
    __extends(AppMissingTranslationHandler, _super);
    function AppMissingTranslationHandler(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        return _this;
    }
    AppMissingTranslationHandler.prototype.handle = function (params) {
        //return `[${params.key}]`;
        return params.key;
    };
    return AppMissingTranslationHandler;
}(ng2Translate.MissingTranslationHandler));
exports.AppMissingTranslationHandler = AppMissingTranslationHandler;
//# sourceMappingURL=translate.service.js.map