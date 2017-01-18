import { Component, Input, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import {SystemComponent} from '../../decorators/system-component.decorator';

/**
 * Implementation of Menu component
 *
 * @link http://semantic-ui.com/collections/menu.html
 * @link http://semantic-ui.com/elements/icon.html
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "sm-menu",
    template: `<div class="ui menu {{class}}" #innerElement>
<a href="#/" *ngIf="logo" class="header item">
    <img class="{{logoClass}}" alt="{{title}}" src="{{logo}}">
</a>
<a href="#/" *ngIf="title && !logo" class="header item">
    {{title}}
</a>
<ng-content></ng-content>
</div>
`
})
@SystemComponent(true)
export class SemanticMenuComponent implements AfterViewInit {
    @Input() logo: string;
    @Input() class: string;
    @Input() logoClass: string = "logo";
    @Input() title: string;
    @ViewChild("innerElement") innerElement: ElementRef;

    ngAfterViewInit() {
        Array.from(this.innerElement.nativeElement.childNodes)
            .filter((element: Element) => element.nodeName === "SM-MENU")
            .map((element: Element) => element.firstElementChild.classList.remove("ui"));
    }
}

/**
 * Implementation of Item view
 *
 * @link http://semantic-ui.com/views/item.html
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "a[sm-item], sm-item",
    template: `<i *ngIf="icon" class="{{icon}} icon"></i>
<img *ngIf="image" class="ui avatar image" src="{{image}}">
<div class="content" #innerItemElement>
  <div *ngIf="header" class="header">
    {{header}}
  </div>
  <ng-content></ng-content>
</div>`
})
@SystemComponent(true)
export class SemanticItemComponent implements AfterViewInit {
    @Input() icon: string;
    @Input() header: string;
    @Input() image: string;

    @ViewChild("innerItemElement") innerItemElement: ElementRef;

    ngAfterViewInit() {
        this.innerItemElement.nativeElement.parentElement.classList.add("item");
    }
}

/**
 * Implementation of Loader element
 *
 * @link http://semantic-ui.com/elements/loader.html
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "sm-loader",
    template: `<div *ngIf="!complete" class="ui active dimmer {{class}}">
    <div [ngClass]="{text: text}" class="ui loader">{{text}}</div>
  </div>`
})
@SystemComponent(true)
export class SemanticLoaderComponent {
    @Input("class") class: string;
    @Input("text") text: string;
    @Input("complete") complete: boolean = false;
}