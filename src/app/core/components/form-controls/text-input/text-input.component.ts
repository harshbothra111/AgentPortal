import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

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
