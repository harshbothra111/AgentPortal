import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { MockValidationService } from '../../../../core/services/mock-validation.service';
import { TextInputComponent } from '../../../../common/components/text-input/text-input.component';
import { SelectInputComponent } from '../../../../common/components/select-input/select-input.component';
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
    this.initForm();
    this.loadLookups();
    
    // Update progress
    this.journeyService.updateStep('wf_vehicle_details', 'step_vehicle_identification');
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

  private loadLookups() {
    const step = this.journeyService.currentStep();
    if (step && step.lookups) {
      this.makeOptions = step.lookups['make'] || [];
      this.yearOptions = step.lookups['registrationYear'] || [];
      this.allModels = step.lookups['model'] || [];
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
      this.journeyService.updateAnswers('step_vehicle_identification', this.form.value);
      this.router.navigate(['journey', 'auto', 'vehicle-usage']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
