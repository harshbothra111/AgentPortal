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

    const submission = this.journeyService.submission();
    if (submission && submission.drivers && Array.isArray(submission.drivers)) {
      const additionalDrivers = submission.drivers.filter((d: any) => !d.isPrimary);
      additionalDrivers.forEach((driver: any) => {
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
    this.journeyService.goBack();
  }

  onSubmit() {
    if (this.form.valid) {
      const currentSubmission = this.journeyService.submission() || {};
      const updatedSubmission = JSON.parse(JSON.stringify(currentSubmission));
      
      const existingDrivers = updatedSubmission.drivers || [];
      
      // Preserve existing primary drivers
      const primaryDrivers = existingDrivers.filter((d: any) => d.isPrimary);
      
      // Process additional drivers from the form
      const additionalDrivers = this.form.value.drivers.map((d: any) => ({
        ...d,
        isPrimary: false // Ensure additional drivers are not marked as primary
      }));
      
      // Combine primary and additional drivers
      updatedSubmission.drivers = [...primaryDrivers, ...additionalDrivers];

      this.journeyService.submitStep(updatedSubmission);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
