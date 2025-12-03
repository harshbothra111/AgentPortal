import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JourneyService } from '../../../../core/services/journey.service';
import { RadioInputComponent } from '../../../../core/components/form-controls/radio-input/radio-input.component';
import { LookupOption, FieldMetadata } from '../../../../core/models/journey.model';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, RadioInputComponent],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.scss'
})
export class SelectPlanComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private journeyService = inject(JourneyService);

  form!: FormGroup;

  planOptions: LookupOption[] = [];

  ngOnInit() {
    this.loadLookups();
    this.initForm();
    this.patchData();
  }

  private loadLookups() {
    const workflow = this.journeyService.currentWorkflow();
    if (workflow && workflow.lookups) {
      this.planOptions = workflow.lookups['planType'] || [];
    }
  }

  private initForm() {
    this.form = this.fb.group({
      planType: ['', Validators.required]
    });
  }

  private patchData() {
    // Patch values from submission data
    const submission = this.journeyService.submission();
    if (submission && submission.coverage) {
      this.form.patchValue(submission.coverage);
    }
  }

  onBack() {
    this.journeyService.goBack();
  }

  onSubmit() {
    if (this.form.valid) {
      const currentSubmission = this.journeyService.submission() || {};
      const updatedSubmission = JSON.parse(JSON.stringify(currentSubmission));
      
      updatedSubmission.coverage = { ...updatedSubmission.coverage, ...this.form.value };
      
      this.journeyService.submitStep(updatedSubmission);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
