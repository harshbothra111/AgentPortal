import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  private router = inject(Router);
  private journeyService = inject(JourneyService);

  answers = this.journeyService.answers;

  // Computed signals for easy access to step data
  vehicleInfo = computed(() => this.answers()['step_vehicle_identification']);
  vehicleUsage = computed(() => this.answers()['step_vehicle_usage']);
  primaryDriver = computed(() => this.answers()['step_primary_driver']);
  additionalDrivers = computed(() => this.answers()['step_additional_drivers']);
  plan = computed(() => this.answers()['step_select_plan']);

  ngOnInit() {
    this.journeyService.updateStep('wf_review', 'step_summary');
  }

  onBack() {
    this.router.navigate(['journey', 'auto', 'select-plan']);
  }

  onSubmit() {
    console.log('Final Submission:', this.answers());
    alert('Application Submitted Successfully!');
    this.router.navigate(['/']);
  }
}
