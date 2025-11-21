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
    this.journeyService.updateStep('wf_driver_details', 'step_additional_drivers');
  }

  private initForm() {
    this.form = this.fb.group({
      drivers: this.fb.array([])
    });
  }

  addDriver() {
    const driverForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      licenseNumber: ['', Validators.required]
    });
    this.drivers.push(driverForm);
  }

  removeDriver(index: number) {
    this.drivers.removeAt(index);
  }

  onBack() {
    this.router.navigate(['journey', 'auto', 'primary-driver']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.journeyService.updateAnswers('step_additional_drivers', this.form.value);
      this.router.navigate(['journey', 'auto', 'select-plan']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
