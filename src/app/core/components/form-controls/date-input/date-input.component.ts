import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;
  @Input() placeholder: string = 'MM/DD/YYYY';
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;

  private errorMessageService = inject(ErrorMessageService);

  get errorMessage(): string | null {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        return this.errorMessageService.getErrorMessage(firstKey, { ...errors[firstKey], label: this.label });
      }
    }
    return null;
  }
}
