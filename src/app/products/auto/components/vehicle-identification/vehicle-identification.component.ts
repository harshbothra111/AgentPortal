import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { MockValidationService } from '../../../../core/services/mock-validation.service';
import { TextInputComponent } from '../../../../core/components/form-controls/text-input/text-input.component';
import { SelectInputComponent } from '../../../../core/components/form-controls/select-input/select-input.component';
import { LookupOption } from '../../../../core/models/journey.model';

@Component({
  selector: 'app-vehicle-identification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, SelectInputComponent],
  templateUrl: './vehicle-identification.component.html',
  styleUrl: './vehicle-identification.component.scss'
})
export class VehicleIdentificationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private journeyService = inject(JourneyService);
  private validationService = inject(MockValidationService);

  form!: FormGroup;
  
  // Lookups
  makeOptions: LookupOption[] = [];
  modelOptions: LookupOption[] = [];
  yearOptions: LookupOption[] = [];
  
  private allModels: LookupOption[] = [];

  ngOnInit() {
    this.loadLookups();
    this.initForm();
    this.patchData();
  }

  private initForm() {
    this.form = this.fb.group({
      registrationNumber: ['', [Validators.required], [this.validationService.uniqueRegistrationValidator()]],
      make: ['', Validators.required],
      model: [{ value: '', disabled: true }, Validators.required],
      variant: [''], // Optional for now
      registrationYear: ['', Validators.required]
    });

    // Handle cascading dropdown
    this.form.get('make')?.valueChanges.subscribe(make => {
      this.onMakeChange(make);
    });
  }

  private patchData() {
    // Patch values if available from server
    const step = this.journeyService.currentStep();
    if (step && step.fields) {
      const values: any = {};
      step.fields.forEach(field => {
        if (field.value !== undefined && field.value !== null) {
          values[field.key] = field.value;
        }
      });
      if (Object.keys(values).length > 0) {
        this.form.patchValue(values);
        // Trigger change detection logic manually if needed (e.g. make change)
        if (values['make']) {
           this.onMakeChange(values['make']);
           // Re-patch model since onMakeChange might reset it
           if (values['model']) {
             this.form.get('model')?.setValue(values['model']);
           }
        }
      }
    }
  }

  private loadLookups() {
    const workflow = this.journeyService.currentWorkflow();
    if (workflow && workflow.lookups) {
      this.makeOptions = workflow.lookups['make'] || [];
      this.yearOptions = workflow.lookups['registrationYear'] || [];
      this.allModels = workflow.lookups['model'] || [];
    }
  }

  private onMakeChange(make: string) {
    const modelControl = this.form.get('model');
    modelControl?.reset();
    
    if (make) {
      modelControl?.enable();
      this.modelOptions = this.allModels.filter(m => m['make'] === make);
      
      if (this.modelOptions.length === 0) {
         this.modelOptions = [{ code: 'OTH', label: 'Other' }];
      }
    } else {
      modelControl?.disable();
      this.modelOptions = [];
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.journeyService.submitCurrentStep(this.form.value).subscribe({
        next: (response) => {
          const nextStepId = response.journeyContext.currentStepId;
          const currentWorkflow = response.workflows.find(w => w.workflowId === response.journeyContext.currentWorkflowId);
          const nextStep = currentWorkflow?.steps?.find(s => s.stepId === nextStepId);
          if (nextStep && nextStep.route) {
             this.router.navigate(['journey', 'auto', nextStep.route]);
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
