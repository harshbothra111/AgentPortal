import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LookupOption } from '../../../models/journey.model';

@Component({
  selector: 'app-radio-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio-input.component.html',
  styleUrl: './radio-input.component.scss'
})
export class RadioInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;
  @Input() options: LookupOption[] = [];
}
