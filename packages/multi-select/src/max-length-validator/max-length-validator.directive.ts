import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { maxLengthValidator } from '../validators';

@Directive({
  selector: '[n9MaxLength]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxLengthValidatorDirective), multi: true }
  ]
})
export class MaxLengthValidatorDirective implements Validator {

  @Input('n9MaxLength') maxLength = 0;

  validate(c: AbstractControl): ValidationErrors | any {
    return maxLengthValidator(this.maxLength)(c);
  }

}
