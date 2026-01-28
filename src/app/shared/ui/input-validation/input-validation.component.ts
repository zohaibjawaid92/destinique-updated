import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss']
})
export class InputValidationComponent {
  @Input() control: AbstractControl | null = null;
  @Input() title = '';
  @Input() show = true;
  @Input() errorMessages?: Record<string, string>;

  get isInvalid(): boolean {
    const c = this.control;
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get errorText(): string {
    if (!this.control?.errors) return '';
    const errors: ValidationErrors = this.control.errors;

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return '';

    if (this.errorMessages?.[firstKey]) return this.errorMessages[firstKey];

    switch (firstKey) {
      case 'required':
        return this.title ? `${this.title} is required` : 'This field is required';
      case 'email':
        return 'Please enter a valid email address';
      case 'minlength':
        return `Minimum ${errors['minlength']?.requiredLength ?? ''} characters required`;
      case 'maxlength':
        return `Maximum ${errors['maxlength']?.requiredLength ?? ''} characters allowed`;
      case 'pattern':
        return 'Invalid format';
      case 'min':
        return `Minimum value is ${errors['min']?.min ?? ''}`;
      case 'max':
        return `Maximum value is ${errors['max']?.max ?? ''}`;
      default:
        return 'Invalid value';
    }
  }
}

