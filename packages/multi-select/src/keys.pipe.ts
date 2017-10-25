import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'n9Keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: object, ...args: any[]): string[] {
    return Object.keys(value);
  }

}
