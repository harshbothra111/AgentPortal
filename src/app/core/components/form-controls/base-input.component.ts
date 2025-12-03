import { Directive, Input, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';

@Directive()
export abstract class BaseInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;

  protected errorMessageService = inject(ErrorMessageService);

  get errorMessage(): string | null {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        return this.errorMessageService.getErrorMessage(firstKey, { ...errors[firstKey], label: this.label }, this.id);
      }
    }
    return null;
  }
}
