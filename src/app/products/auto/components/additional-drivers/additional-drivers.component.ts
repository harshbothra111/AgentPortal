import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { TextInputComponent } from '../../../../core/components/form-controls/text-input/text-input.component';

@Component({
  selector: 'app-additional-drivers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './additional-drivers.component.html',
  styleUrl: './additional-drivers.component.scss'
})
export class AdditionalDriversComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private journeyService = inject(JourneyService);

  form!: FormGroup;

  get drivers(): FormArray {
    return this.form.get('drivers') as FormArray;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      drivers: this.fb.array([])
    });

    const step = this.journeyService.currentStep();
    if (step && step.data && step.data.drivers && Array.isArray(step.data.drivers)) {
      step.data.drivers.forEach((driver: any) => {
        this.addDriver(driver);
      });
    }
  }

  addDriver(driverData?: any) {
    const driverForm = this.fb.group({
      firstName: [driverData?.firstName || '', Validators.required],
      lastName: [driverData?.lastName || '', Validators.required],
      dob: [driverData?.dob || '', Validators.required],
      licenseNumber: [driverData?.licenseNumber || '', Validators.required]
    });
    this.drivers.push(driverForm);
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
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
