import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
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

  // ControlValueAccessor implementation
  _value: any = '';
  private _onChange = (value: any) => {};
  private _onTouched = () => {};
  disabled = false;

  constructor(private controlContainer: ControlContainer) {}

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this._value = value ?? '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value = value;
    this._onChange(value);
  }

  onInputBlur(): void {
    this._onTouched();
    this.markTouched();
  }

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
}

