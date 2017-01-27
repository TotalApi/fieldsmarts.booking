import { Injectable, isDevMode } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import * as system from "src/system";
import * as ng2Translate from 'ng2-translate';

@Injectable()
@system.AppService()
export class AppTranslateService {

    constructor(public translate: ng2Translate.TranslateService) {
        translate['appTranslateService'] = this;
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        translate.onLangChange.subscribe(e => this.langChanged(e));
    }

    translations: { [lang: string]: { [key: string]: any }} = {};

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

    addKey(key: string, value: string, lang?: string, addCurrentDictionary?: boolean) {
        lang = lang || this.translate.currentLang;
        if (addCurrentDictionary || !this.translations[`${lang}.${key}`]) {
            if (!this.translations[lang]) {
                try {
                    this.translations[lang] = localStorage.getItem(`_${lang}_translations`).FromJson() || {};
                } catch (e) {
                    this.translations[lang] = {};
                } 
                this.translate.currentLoader.getTranslation(lang).subscribe(loadedDictionary => {
                    for (let key in loadedDictionary) {
                        if (loadedDictionary.hasOwnProperty(key)) {
                            this.addKey(key, loadedDictionary[key], lang, true);
                        }
                    }
                });
            }
            let current = this.translations[lang];
            const keys = key.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            if (!addCurrentDictionary) {
                localStorage.setItem(`_${lang}_translations`, system.Json.toJson(this.translations[lang], true, true));
            }
        }
    }

    langChanged(e: ng2Translate.LangChangeEvent) {
        moment.locale(e.lang);
    }
}

export class AppTranslateLoader extends ng2Translate.TranslateLoader {

    constructor(private http: Http) { super(); }    

    getTranslation(lang: string): Observable<any> {
        let translation = {};
        try {
            translation = require(`../../assets/i18n/${lang}.json`);
        } catch (e) {
        } 
        return Observable.fromPromise(Promise.resolve(translation));
    }
}


export class AppMissingTranslationHandler extends ng2Translate.MissingTranslationHandler {

    constructor(private http: Http) { super(); }    

    private _testMode: boolean;

    handle(params: ng2Translate.MissingTranslationHandlerParams) {
        if (this._testMode) return '';
        const pair = params.key.split('|');
        const key = pair[0];
        let value = key;
        let res = value;
        if (pair.length > 1) {
            this._testMode = true;
            value = params.translateService.instant(key);
            if (!value) {
                value = pair[1] || pair[0];
                res = `[${value}]`;
            } else {
                res = value;
            }
            this._testMode = false;
        } else if (isDevMode) {
            res = `[[${value}]]`;
        }
        params.translateService['appTranslateService'].addKey(key, value);
        return res;
    }
}