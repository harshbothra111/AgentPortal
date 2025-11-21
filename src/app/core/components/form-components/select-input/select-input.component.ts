import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LookupOption } from '../../../models/journey.model';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) id!: string;
  @Input() options: LookupOption[] = [];
}
