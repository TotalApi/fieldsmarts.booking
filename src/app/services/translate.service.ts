import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

    constructor(http: Http, prefix?: string, suffix?: string) {
        super(http, prefix, suffix);
    }

    getTranslation(lang: string): Observable<any> {
        return super.getTranslation(`lang_${lang}`);
    }
}
