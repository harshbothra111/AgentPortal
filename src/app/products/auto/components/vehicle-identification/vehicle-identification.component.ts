import { Component, OnInit, inject, ChangeDetectorRef, Injector, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JourneyService } from '../../../../core/services/journey.service';
import { ApiService } from '../../../../core/services/api.service';
import { DynamicFormService } from '../../../../core/services/dynamic-form.service';
import { DynamicFormComponent } from '../../../../core/components/dynamic-form/dynamic-form.component';
import { LookupOption, FieldMetadata } from '../../../../core/models/journey.model';
import { API_ENDPOINTS } from '../../../../core/config/api-endpoints';

@Component({
  selector: 'app-vehicle-identification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, DynamicFormComponent],
  templateUrl: './vehicle-identification.component.html',
  styleUrl: './vehicle-identification.component.scss'
})
export class VehicleIdentificationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private journeyService = inject(JourneyService);
  private apiService = inject(ApiService);
  private dynamicFormService = inject(DynamicFormService);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  form: FormGroup = new FormGroup({});
  fields: FieldMetadata[] = [];
  lookups: { [key: string]: LookupOption[] } = {};
  
  private allModels: LookupOption[] = [];
  private initialRegistrationNumber: string | null = null;

  ngOnInit() {
    // Use an effect to react to changes in the current step (which includes merged UI config)
    effect(() => {
      const step = this.journeyService.currentStep();
      if (step && step.fields && step.fields.length > 0) {
        // Only initialize if fields are present (UI config loaded)
        this.fields = step.fields;
        this.loadLookups();
        this.initForm();
        this.patchData();
        this.cdr.detectChanges();
      }
    }, { injector: this.injector });
  }

  private initForm() {
    this.form = this.dynamicFormService.createFormGroup(this.fields);

    // Add custom async validator
    const regControl = this.form.get('registrationNumber');
    if (regControl) {
      regControl.setAsyncValidators(this.uniqueRegistrationValidator());
      // Note: updateOn is already set to 'blur' via config/service
    }

    // Handle cascading dropdown
    this.form.get('make')?.valueChanges.subscribe(make => {
      this.onMakeChange(make);
    });
  }

  // Simulate a server check for unique registration number
  private uniqueRegistrationValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // If the value hasn't changed from what we loaded, don't re-validate
      if (this.initialRegistrationNumber && control.value === this.initialRegistrationNumber) {
        return of(null);
      }
      
      return new Observable((observer) => {
        this.apiService.get<{ isTaken: boolean }>(API_ENDPOINTS.VALIDATION.REGISTRATION(control.value))
          .subscribe((response) => {
            observer.next(response.isTaken ? { uniqueRegistration: true } : null);
            observer.complete();
          });
      });
    };
  }

  private patchData() {
    // Patch values from submission data
    const submission = this.journeyService.submission();
    if (submission && submission.vehicle) {
      const values = submission.vehicle;
      
      if (values['registrationNumber']) {
        this.initialRegistrationNumber = values['registrationNumber'];
      }
      
      this.form.patchValue(values);
      
      // Trigger change detection logic manually if needed
      if (values['make']) {
         this.onMakeChange(values['make']);
         // Re-patch model since onMakeChange might reset it
         if (values['model']) {
           this.form.get('model')?.setValue(values['model']);
         }
      }
    }
  }

  private loadLookups() {
    const workflow = this.journeyService.currentWorkflow();
    if (workflow && workflow.lookups) {
      this.lookups = { ...workflow.lookups };
      this.allModels = workflow.lookups['model'] || [];
      // Initialize model lookup as empty until make is selected
      this.lookups['model'] = [];
    }
  }

  private onMakeChange(make: string) {
    const modelControl = this.form.get('model');
    modelControl?.setValue('');
    
    if (make) {
      modelControl?.enable();
      const filteredModels = this.allModels.filter(m => m['make'] === make);
      
      this.lookups = {
        ...this.lookups,
        model: filteredModels.length > 0 ? filteredModels : [{ code: 'OTH', label: 'Other' }]
      };
    } else {
      modelControl?.disable();
      this.lookups = {
        ...this.lookups,
        model: []
      };
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const currentSubmission = this.journeyService.submission() || {};
      const updatedSubmission = JSON.parse(JSON.stringify(currentSubmission));
      
      // Update vehicle details
      updatedSubmission.vehicle = { ...updatedSubmission.vehicle, ...this.form.value };
      
      this.journeyService.submitStep(updatedSubmission);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
