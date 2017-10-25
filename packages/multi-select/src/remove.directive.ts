import { Directive, Host, HostListener, Input, Optional } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import without from 'lodash-es/without';

@Directive({
  selector: '[n9Remove]'
})
export class RemoveDirective<T> {

  @Input() n9Remove: T;

  constructor(@Optional() @Host() private host: MultiSelectComponent<T>) {
  }

  @HostListener('click')
  onClick() {
    if (!!this.host) {
      this.host.values = without(this.host.values, this.n9Remove);
    }
  }

}
