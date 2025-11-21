import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { TextInputComponent } from '../../../../core/components/form-controls/text-input/text-input.component';

@Component({
  selector: 'app-primary-driver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './primary-driver.component.html',
  styleUrl: './primary-driver.component.scss'
})
export class PrimaryDriverComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private journeyService = inject(JourneyService);

  form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      licenseNumber: ['', Validators.required]
    });

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
    this.journeyService.navigateBack().subscribe({
      next: (response) => {
        const nextStepId = response.journeyContext.currentStepId;
        const currentWorkflow = response.workflows.find(w => w.workflowId === response.journeyContext.currentWorkflowId);
        const nextStep = currentWorkflow?.steps?.find(s => s.stepId === nextStepId);
        if (nextStep && nextStep.route) {
           this.router.navigate(['journey', 'auto', nextStep.route]);
        }
      }
    });
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
