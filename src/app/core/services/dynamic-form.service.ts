import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FieldMetadata } from '../models/journey.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  private fb = inject(FormBuilder);

  createFormGroup(fields: FieldMetadata[]): FormGroup {
    const group: any = {};
    
    fields.forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      
      const control = this.fb.control(
        { value: field.value || '', disabled: !field.editable },
        { 
          validators, 
          updateOn: field.updateOn || 'change' 
        }
      );
      
      group[field.key] = control;
    });

    return this.fb.group(group);
  }
}
