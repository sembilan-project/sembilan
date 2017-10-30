import {AbstractControl, ValidatorFn} from '@angular/forms';

export function minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const {value} = control;
        if (value && value.length >= minLength) {
            return null;
        } else {
            return {'minLength': minLength};
        }
    };
}

export function maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const {value} = control;
        if (value && value.length <= maxLength) {
            return null;
        } else {
            return {'maxLength': maxLength};
        }
    };
}
