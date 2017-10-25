import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { OptionDirective } from './option.directive';
import { ToggleDirective } from './toggle.directive';
import { RemoveDirective } from './remove.directive';
import { SelectionDirective } from './selection.directive';
import { FormsModule } from '@angular/forms';
import { MinLengthValidatorDirective } from './min-length-validator/min-length-validator.directive';
import { MaxLengthValidatorDirective } from './max-length-validator/max-length-validator.directive';
import { KeysPipe } from './keys.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MultiSelectComponent,
    OptionDirective,
    ToggleDirective,
    SelectionDirective,
    RemoveDirective,
    MinLengthValidatorDirective,
    MaxLengthValidatorDirective,
    KeysPipe
  ],
  exports: [
    MultiSelectComponent,
    OptionDirective,
    ToggleDirective,
    SelectionDirective,
    RemoveDirective,
    MinLengthValidatorDirective,
    MaxLengthValidatorDirective,
    KeysPipe
  ]
})
export class MultiSelectModule {
}
