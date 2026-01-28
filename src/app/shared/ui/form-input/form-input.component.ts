import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormInputComponent {
  @Input() title = '';
  @Input() placeholder = '';
  @Input() isRequired = false;

  /** Name of the control in the parent FormGroup */
  @Input() formControlName!: string;

  /** Optional / common input customization */
  @Input() type: string = 'text';
  @Input() id?: string;
  @Input() autocomplete?: string;
  @Input() inputMode?: string;
  @Input() maxLength?: number;
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() step?: number | string;
  @Input() readonly = false;

  /** Styling hooks */
  @Input() containerClass = '';
  @Input() wrapperClass = '';
  @Input() labelClass = '';
  @Input() inputClass = '';

  /** Error handling */
  @Input() showErrors = true;
  @Input() errorMessages?: Record<string, string>;

  /** Optional event hooks (useful for special fields like autocomplete) */
  @Output() inputFocus = new EventEmitter<FocusEvent>();
  @Output() inputBlur = new EventEmitter<FocusEvent>();
  @Output() inputKeydown = new EventEmitter<KeyboardEvent>();

  constructor(private controlContainer: ControlContainer) {}

  get control(): AbstractControl | null {
    const c = this.controlContainer?.control;
    if (!c || !this.formControlName) return null;
    return c.get(this.formControlName);
  }

  get isInvalid(): boolean {
    const ctrl = this.control;
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  markTouched(): void {
    this.control?.markAsTouched();
  }

  get errorText(): string {
    const ctrl = this.control;
    const errors = ctrl?.errors;
    if (!errors) return '';

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return '';

    // Custom messages override defaults
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

