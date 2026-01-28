import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent } from './ui/form-input/form-input.component';
import { InputValidationComponent } from './ui/input-validation/input-validation.component';

@NgModule({
  declarations: [FormInputComponent, InputValidationComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormInputComponent, InputValidationComponent]
})
export class SharedModule {}

