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
    this.initForm();
    this.journeyService.updateStep('wf_vehicle_details', 'step_vehicle_usage');
    this.loadLookups();
  }

  private loadLookups() {
    const step = this.journeyService.currentStep();
    if (step && step.lookups) {
      this.usageOptions = step.lookups['primaryUse'] || [];
    }
  }

  private initForm() {
    this.form = this.fb.group({
      primaryUse: ['', Validators.required],
      annualMileage: ['', [Validators.required, Validators.min(0)]],
      isFinanced: [false]
    });
  }

  onBack() {
    this.router.navigate(['journey', 'auto', 'vehicle-identification']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.journeyService.updateAnswers('step_vehicle_usage', this.form.value);
      this.router.navigate(['journey', 'auto', 'primary-driver']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
