﻿import { Component, Directive, ElementRef, Input, Renderer, Sanitizer, SecurityContext, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService, TranslationChangeEvent, LangChangeEvent } from "ng2-translate";
import {SystemComponent} from '../decorators/system-component.decorator';

@Directive({
    selector: '[i18n], .i18n, [i18n-placeholder]',
    host: {
        '(click)': 'onClick()'
    }
})
@SystemComponent()
export class i18nDirective implements AfterViewInit, OnDestroy {

    @Input('i18n') key: string;

    private translateElements: HTMLElement[];
    private onTranslationChange;
    private onLangChange;
    private currentLang: string;

    constructor(private el: ElementRef, private renderer: Renderer, private translateService: TranslateService, private sanitizer: Sanitizer, private cdRef: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        // if there is a subscription to onLangChange, clean it
        this.dispose();
        this.translateElements = [];
        let _translateElements = this.el.nativeElement.querySelectorAll('[i18n], .i18n');
        if (!_translateElements || _translateElements.length === 0) {
            _translateElements = [this.el.nativeElement];
        }

        for (let i = 0; i < _translateElements.length; i++) {
            const el = _translateElements[i];
            const subElements = _.filter(el.querySelectorAll('[i18n-content], .i18n-content'), (x: HTMLElement) => x.innerHTML.trim() === x.innerText.trim());
            if (subElements && subElements.length > 0) {
                this.translateElements.push(...subElements);
            } else {
                if (el.children.length === 0) {
                    this.translateElements.push(el);                    
                }
            }
        }

        if (this.translate()) {
            // subscribe to onTranslationChange event, in case the translations change
            if (!this.onTranslationChange) {
                this.onTranslationChange = this.translateService.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
                    if (event.lang === this.translateService.currentLang) {
                        setTimeout(() => this.translate());
                    }
                });
            }

            // subscribe to onLangChange event, in case the language changes
            if (!this.onLangChange) {
                this.onLangChange = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
                    if (event.lang !== this.currentLang) {
                        setTimeout(() => this.translate());
                    }
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.dispose();
    }

    private dispose(): void {
        if (this.onTranslationChange) {
            this.onTranslationChange.unsubscribe();
            this.onTranslationChange = undefined;
        }
        if (this.onLangChange) {
            this.onLangChange.unsubscribe();
            this.onLangChange = undefined;
        }
    }

    private translate() {
        this.currentLang = this.translateService.currentLang;
        let res = false;
        for (let i = 0; i < this.translateElements.length; i++) {
            res = this.translateElement(this.translateElements[i]) || res;
        }
        if (this.el.nativeElement.hasAttribute('i18n-placeholder')) {
            this.translateElement(this.el.nativeElement, 'placeholder');
        }
            
        return res;
    }

    private translateElement(el: HTMLElement, attrName?: string) {
        attrName = attrName || '';
        let key = el['__i18n__key__' + attrName];
        if (!key) {
            key = this.key;
            const value = ((attrName ? el.getAttribute(attrName) : el.innerText) || '').trim();
            if (key) {
                key = `${key}|${value}`;
            } else {
                key = value;
            }
            el['__i18n__key__' + attrName] = key;
        }
        if (key) {
            const res = this.translateService.instant(key);
            if (res) {
                const value = this.sanitizer.sanitize(SecurityContext.HTML, res);
                if (attrName) {
                    el.setAttribute(attrName, value);
                } else {
                    el.innerHTML = value;
                }
                this.cdRef.markForCheck();
            }
        }
        return !!key;
    }

    onClick() {
        // just for sample
    }
}