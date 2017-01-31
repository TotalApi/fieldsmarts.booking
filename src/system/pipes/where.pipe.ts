import {Pipe, Injectable,PipeTransform} from '@angular/core';
import {SystemComponent} from '../decorators/system-component.decorator';
import {isArray} from '../utils/utils';

/**
* Sample 1:
* "person in people | ussWhere: { '!name': $select.search, age: $select.search}"
* performs a AND between 'person.name !== $select.search' and 'person.age == $select.search'.
*
* Sample 2:
* "person in people | ussWhere: 'selected'"
* performs '!!person.selected'.
*
* Sample 3:
* "person in people | ussWhere: '!selected'"
* performs '!person.selected'.
*/
@Pipe({
    name: 'ussWhere',
    pure: false
})
@SystemComponent()
export class UssWherePipe implements PipeTransform {
    transform(items: any[], condition: any): any {
        let res: any = items;
        if (condition && isArray(items)) {
            if (typeof condition === "object") {
                return items.where(item => {
                    let itemMatches = false;

                    const keys = Object.keys(condition);
                    for (let i = 0; i < keys.length; i++) {
                        let not = false;
                        let prop = keys[i];
                        if (prop.startsWith('!')) {
                            prop = prop.substring(1);
                            not = true;
                        } 

                        let condValue = condition[prop];
                        let propValue = item[prop];
                        // If checking value is not set we should support comparing the following cases
                        // null == undefined
                        // 0 == undefined
                        // false == undefined
                        // '' == undefined
                        if (propValue === undefined && condValue !== undefined) {
                            if (condValue === null) propValue = null;
                            else if (condValue === 0) propValue = 0;
                            else if (condValue === false) propValue = false;
                            else if (condValue === '') propValue = '';
                        }
                        itemMatches = propValue === condValue;
                        if (not)
                            itemMatches = !itemMatches;
                        if (!itemMatches)
                            break;
                    }
                    return itemMatches;
                }).toArray();
            } else {
                if (condition.startsWith('!')) {
                    condition = condition.substring(1);
                    res = items.filter(item => !item[condition]);
                } else {
                    res = items.filter(item => !!item[condition]);
                }
            }
        } 
        return res;
    }
}
