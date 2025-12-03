import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LookupOption } from '../../../models/journey.model';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;
  @Input() options: LookupOption[] = [];

  private errorMessageService = inject(ErrorMessageService);

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
