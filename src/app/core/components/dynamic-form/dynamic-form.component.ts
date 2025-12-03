import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldMetadata, LookupOption } from '../../models/journey.model';
import { TextInputComponent } from '../form-controls/text-input/text-input.component';
import { SelectInputComponent } from '../form-controls/select-input/select-input.component';
import { DateInputComponent } from '../form-controls/date-input/date-input.component';
import { RadioInputComponent } from '../form-controls/radio-input/radio-input.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    SelectInputComponent,
    DateInputComponent,
    RadioInputComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnChanges {
  @Input({ required: true }) fields: FieldMetadata[] = [];
  @Input({ required: true }) form!: FormGroup;
  @Input() lookups: { [key: string]: LookupOption[] } = {};

  sortedFields: FieldMetadata[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.sortedFields = [...this.fields].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  }

  getOptions(field: FieldMetadata): LookupOption[] {
    if (field.options) {
      return field.options;
    }
    if (field.lookupKey && this.lookups[field.lookupKey]) {
      return this.lookups[field.lookupKey];
    }
    return [];
  }
}
