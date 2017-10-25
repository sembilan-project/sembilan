import { Directive, Host, HostListener, Input, Optional } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import xorWith from 'lodash-es/xorWith';
import isEqual from 'lodash-es/isEqual';

@Directive({
  selector: '[n9Toggle]'
})
export class ToggleDirective<T> {

  @Input() n9Toggle: T;

  constructor(@Optional() @Host() private host: MultiSelectComponent<T>) {
  }

  @HostListener('click')
  onClick() {
    if (!!this.host) {
      this.host.values = xorWith(this.host.values, [ this.n9Toggle ], isEqual);
    }
  }

}
