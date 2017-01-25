import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AppService } from "src/system";
import * as ng2Translate from 'ng2-translate';

@Injectable()
@AppService()
export class AppTranslateService {

    constructor(private translate: ng2Translate.TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        translate.onLangChange.subscribe(e => this.langChanged(e));
    }

    langChanged(e: ng2Translate.LangChangeEvent) {
    }

    init() {
    }
}

export class AppTranslateLoader extends ng2Translate.TranslateStaticLoader {

    constructor(private _http: Http, private _prefix?: string, private _suffix?: string) {
        super(_http, _prefix, _suffix);
    }

    getTranslation(lang: string): Observable<any> {
        if (lang !== 'en' && lang !== 'fr')
            lang = 'en';
        return super.getTranslation(`lang_${lang}`);
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
    }
}


export class AppMissingTranslationHandler extends ng2Translate.MissingTranslationHandler {
    constructor(private http: Http) {
        super();
    }    

    handle(params: ng2Translate.MissingTranslationHandlerParams) {
        //return `[${params.key}]`;
        return params.key;
    }
}