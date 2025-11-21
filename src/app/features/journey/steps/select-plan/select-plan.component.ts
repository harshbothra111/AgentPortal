import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { RadioInputComponent } from '../../../../common/components/radio-input/radio-input.component';
import { LookupOption } from '../../../../core/models/journey.model';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioInputComponent],
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
    this.initForm();
    this.journeyService.updateStep('wf_coverage_selection', 'step_plans');
    this.loadLookups();
  }

  private loadLookups() {
    const step = this.journeyService.currentStep();
    if (step && step.lookups) {
      this.planOptions = step.lookups['planType'] || [];
    }
  }

  private initForm() {
    this.form = this.fb.group({
      plan: ['', Validators.required]
    });
  }

  onBack() {
    this.router.navigate(['journey', 'auto', 'additional-drivers']);
  }

  onSubmit() {
    if (this.form.valid) {
      this.journeyService.updateAnswers('step_select_plan', this.form.value);
      this.router.navigate(['journey', 'auto', 'summary']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
