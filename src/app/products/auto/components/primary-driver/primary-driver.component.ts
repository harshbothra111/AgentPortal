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
    this.journeyService.updateStep('wf_driver_details', 'step_primary_driver');
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      licenseNumber: ['', Validators.required]
    });
  }

  onBack() {
    this.router.navigate(['journey', 'auto', 'vehicle-usage']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.journeyService.updateAnswers('step_primary_driver', this.form.value);
      this.router.navigate(['journey', 'auto', 'additional-drivers']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
