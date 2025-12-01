import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
}
