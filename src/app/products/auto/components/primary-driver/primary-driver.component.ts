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
import { DateInputComponent } from '../../../../core/components/form-controls/date-input/date-input.component';

@Component({
  selector: 'app-primary-driver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, TextInputComponent, DateInputComponent],
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

    // Patch values from submission data
    const submission = this.journeyService.submission();
    if (submission && submission.drivers) {
      const primaryDriver = submission.drivers.find((d: any) => d.isPrimary);
      if (primaryDriver) {
        this.form.patchValue(primaryDriver);
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
      
      if (!updatedSubmission.drivers) {
        updatedSubmission.drivers = [];
      }

      const primaryDriverIndex = updatedSubmission.drivers.findIndex((d: any) => d.isPrimary);
      const driverData = { ...this.form.value, isPrimary: true };

      if (primaryDriverIndex >= 0) {
        updatedSubmission.drivers[primaryDriverIndex] = { ...updatedSubmission.drivers[primaryDriverIndex], ...driverData };
      } else {
        updatedSubmission.drivers.push(driverData);
      }

      this.journeyService.submitStep(updatedSubmission);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
