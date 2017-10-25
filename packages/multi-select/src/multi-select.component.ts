import {
  Component,
  ContentChild,
  ExistingProvider,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionDirective } from './option.directive';
import { SelectionDirective } from './selection.directive';
import unionWith from 'lodash-es/unionWith';
import isEqual from 'lodash-es/isEqual';
import dropRight from 'lodash-es/dropRight';

export const MULTI_SELECT_VALUE_ACCESSOR_PROVIDER: ExistingProvider = {
  multi: true,
  useExisting: forwardRef(() => MultiSelectComponent),
  provide: NG_VALUE_ACCESSOR
};

export type FocusState = 'focus' | '';

@Component({
  selector: 'n9-multi-select',
  template: `
    <div class="n9-container"
         [ngClass]="focusState">
      <div class="n9-selection-list">
        <ng-container *ngFor="let value of values">
          <ng-container *ngTemplateOutlet="selectionTemplate; context: { $implicit: value }"></ng-container>
        </ng-container>
        <input [(ngModel)]="inputValue"
               [placeholder]="inputPlaceholder"
               (keydown)="onKeyDown($event);"/>
      </div>
      <div class="n9-clear-selection"
           (click)="onClearSelection()">&times;
      </div>
    </div>

    <div class="n9-option-list"
         [hidden]="!isOptionsShown">
      <ng-container *ngFor="let option of options">
        <ng-container *ngTemplateOutlet="optionTemplate; context: { $implicit: option }"></ng-container>
      </ng-container>
    </div>

    <ng-template #defaultSelectionTemplate let-value>
      <span class="n9-selection-item">
        <a class="n9-remove-selection" [n9Remove]="value">&times;</a><span>{{ value }}</span>
      </span>
    </ng-template>

    <ng-template #defaultOptionTemplate let-option>
      <div class="n9-option-item" [n9Toggle]="option">
        <span>{{ option }}</span>
      </div>
    </ng-template>
  `,
  providers: [
    MULTI_SELECT_VALUE_ACCESSOR_PROVIDER
  ]
})
export class MultiSelectComponent<T> implements ControlValueAccessor, OnInit {

  @ViewChild('defaultOptionTemplate', { read: TemplateRef }) defaultOptionTemplate: TemplateRef<{ $implicit: T }>;

  @ContentChild(OptionDirective, { read: TemplateRef }) optionTemplate: TemplateRef<{ $implicit: T }>;

  @ViewChild('defaultSelectionTemplate') defaultSelectionTemplate: TemplateRef<{ $implicit: T }>;

  @ContentChild(SelectionDirective, { read: TemplateRef }) selectionTemplate: TemplateRef<{ $implicit: T }>;

  isOptionsShown = false;

  @Input() placeholder = '';

  inputPlaceholder = this.placeholder;

  inputValue = '';

  focusState: FocusState = '';

  @HostBinding('class.ng-valid') validClass: boolean;

  @HostBinding('class.ng-invalid') invalidClass: boolean;

  @HostBinding('class.ng-dirty') dirtyClass: boolean;

  onChange: (value?: any) => void;

  onTouched: (value?: any) => void;

  private clickedInside = false;

  private _options: T[] = [];

  @Input()
  set options(options: T[]) {
    if (!!options && Array.isArray(options)) {
      this._options = options;
    } else {
      throw new Error('"options" must be an array');
    }
  }

  get options() {
    return this._options;
  }

  private _values: T[] = [];

  set values(values: T[]) {
    if (!!values && Array.isArray(values)) {
      this._values = values;
      this.onChange(values);
      this.handlePlaceholder();
    }
  }

  get values() {
    return this._values;
  }

  private _comparator = (a1: string, a2: T) => a1 === `${a2}`;

  @Input()
  set comparator(fn: (a1: string, a2: T) => boolean) {
    if (typeof fn === 'function') {
      this._comparator = fn;
    } else {
      throw new Error('"comparator" must be a function');
    }
  }

  get comparator() {
    return this._comparator;
  }

  constructor() {
  }

  writeValue(obj: T[] | null): void {
    if (!!obj && Array.isArray(obj)) {
      this._values = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    if (!this.selectionTemplate) {
      this.selectionTemplate = this.defaultSelectionTemplate;
    }
    if (!this.optionTemplate) {
      this.optionTemplate = this.defaultOptionTemplate;
    }
  }

  @HostListener('document:click')
  onClickDocument() {
    if (!this.clickedInside) {
      this.setBlur();
      this.hideOptions();
    }
    this.clickedInside = false;
  }

  @HostListener('click')
  onClickComponent() {
    this.clickedInside = true;
    this.onTouched();
    this.setFocus();
    this.showOptions();
  }

  onClearSelection() {
    this.values = [];
  }

  showOptions() {
    this.isOptionsShown = true;
  }

  hideOptions() {
    this.isOptionsShown = false;
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'Backspace': {
        if (!this.inputValue.length) {
          this.values = dropRight(this.values);
        }
        break;
      }
      case 'Enter': {
        if (!!this.inputValue.trim().length) {

          const foundOption = this.options.find((option) => this.comparator(this.inputValue, option));

          if (!!foundOption) {
            console.log('Value', this.inputValue, ' matched with', foundOption);
            this.values = unionWith(this.values, [ foundOption ], isEqual);
            this.inputValue = '';
            this.setValid();
          } else {
            console.log('No matching value');
            this.setInvalid();
          }
        }
        break;
      }
    }
  }

  handlePlaceholder() {
    if (!!this.values.length) {
      this.inputPlaceholder = '';
    } else {
      this.inputPlaceholder = this.placeholder;
    }
  }

  setFocus() {
    this.focusState = 'focus';
  }

  setBlur() {
    this.focusState = '';
  }

  setInvalid() {
    this.validClass = false;
    this.invalidClass = true;
    this.dirtyClass = true;
  }

  setValid() {
    this.validClass = true;
    this.invalidClass = false;
    this.dirtyClass = true;
  }

}
