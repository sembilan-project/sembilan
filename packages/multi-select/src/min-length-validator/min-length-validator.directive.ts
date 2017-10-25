import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { minLengthValidator } from '../validators';

@Directive({
  selector: '[n9MinLength]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MinLengthValidatorDirective), multi: true }
  ]
})
export class MinLengthValidatorDirective implements Validator {

  @Input('n9MinLength') minLength = 0;

  validate(c: AbstractControl): ValidationErrors | any {
    return minLengthValidator(this.minLength)(c);
  }

}
