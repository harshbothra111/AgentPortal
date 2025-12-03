import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JourneyService } from '../../../../core/services/journey.service';
import { FieldMetadata } from '../../../../core/models/journey.model';
import { TextInputComponent } from '../../../../core/components/form-controls/text-input/text-input.component';
import { RadioInputComponent } from '../../../../core/components/form-controls/radio-input/radio-input.component';
import { LookupOption } from '../../../../core/models/journey.model';

@Component({
  selector: 'app-vehicle-usage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, TextInputComponent, RadioInputComponent],
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
    // Patch values from submission data
    const submission = this.journeyService.submission();
    if (submission && submission.vehicle) {
      this.form.patchValue(submission.vehicle);
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
