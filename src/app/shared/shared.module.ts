import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent } from './ui/form-input/form-input.component';

@NgModule({
  declarations: [FormInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormInputComponent]
})
export class SharedModule {}

