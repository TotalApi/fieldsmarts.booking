import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AppService, Json } from "src/system";
import * as ng2Translate from 'ng2-translate';

@Injectable()
@AppService()
export class AppTranslateService {

    constructor(public translate: ng2Translate.TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        translate.onLangChange.subscribe(e => this.langChanged(e));
    }

    init() {
    }

    use(lang: string): Observable<any> {
        return this.translate.use(lang);
    }

    getBrowserLang(): string {
        return this.translate.getBrowserLang();
    }

    get currentLang() {
        return this.translate.currentLang;
    }

    get currentCulture() {
        switch (this.currentLang) {
            case 'en': return 'en_US';
            case 'fr': return 'fr_FR';
            default: return `${this.currentLang}_${this.currentLang.toUpperCase()}`;
        }
    }

    langChanged(e: ng2Translate.LangChangeEvent) {
        moment.locale(e.lang);
    }
}

export class AppTranslateLoader extends ng2Translate.TranslateLoader {

    getTranslation(lang: string): Observable<any> {
/*
        if (lang !== 'en' && lang !== 'fr')
            lang = 'en';
*/
        let translation = {};
        try {
            translation = require(`../../assets/i18n/${lang}.json`);
        } catch (e) {
        } 
        return Observable.fromPromise(Promise.resolve(translation));
    }
}


export class AppMissingTranslationHandler extends ng2Translate.MissingTranslationHandler {
    private _testMode: boolean;

    constructor(private http: Http) {
        super();
    }    

    handle(params: ng2Translate.MissingTranslationHandlerParams) {
        if (this._testMode) return '';
        const pair = params.key.split('|');
        let value = pair[0];
        if (pair.length > 1) {
            this._testMode = true;
            value = params.translateService.instant(pair[0]);
            if (!value) {
                value = `[${pair[1] || pair[0]}]`;
            }
            this._testMode = false;
        } else if (isDevMode) {
            value = `[[${value}]]`;
        }
        return value;
    }
}