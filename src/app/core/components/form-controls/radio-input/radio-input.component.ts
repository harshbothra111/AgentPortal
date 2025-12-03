import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { LookupOption } from '../../../models/journey.model';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-radio-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule],
  templateUrl: './radio-input.component.html',
  styleUrl: './radio-input.component.scss'
})
export class RadioInputComponent extends BaseInputComponent {
  @Input() options: LookupOption[] = [];
}
