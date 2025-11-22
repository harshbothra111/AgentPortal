import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { TextInputComponent } from '../../../../core/components/form-controls/text-input/text-input.component';
import { RadioInputComponent } from '../../../../core/components/form-controls/radio-input/radio-input.component';
import { LookupOption } from '../../../../core/models/journey.model';

@Component({
  selector: 'app-vehicle-usage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, RadioInputComponent],
  templateUrl: './vehicle-usage.component.html',
  styleUrl: './vehicle-usage.component.scss'
})
export class VehicleUsageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private journeyService = inject(JourneyService);

  form!: FormGroup;
  
  usageOptions: LookupOption[] = [];

  ngOnInit() {
    this.loadLookups();
    this.initForm();
    this.patchData();
  }

  private loadLookups() {
    const workflow = this.journeyService.currentWorkflow();
    if (workflow && workflow.lookups) {
      this.usageOptions = workflow.lookups['primaryUse'] || [];
    }
  }

  private initForm() {
    this.form = this.fb.group({
      primaryUse: ['', Validators.required],
      annualMileage: ['', [Validators.required, Validators.min(0)]],
      isFinanced: [false]
    });
  }

  private patchData() {
    // Patch values
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
      }
    }
  }

  onBack() {
    this.journeyService.goBack();
  }

  onSubmit() {
    if (this.form.valid) {
      const currentSubmission = this.journeyService.submission() || {};
      const updatedSubmission = JSON.parse(JSON.stringify(currentSubmission));
      
      // Update vehicle usage details
      updatedSubmission.vehicle = { ...updatedSubmission.vehicle, ...this.form.value };
      
      this.journeyService.submitStep(updatedSubmission);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
