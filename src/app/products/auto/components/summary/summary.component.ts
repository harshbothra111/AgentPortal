import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../core/services/journey.service';
import { AutoSubmission } from '../../models/auto-submission.model';

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

  submission = computed(() => this.journeyService.submission() as AutoSubmission);

  // Computed signals for easy access to domain data
  vehicleInfo = computed(() => this.submission()?.vehicle);
  primaryDriver = computed(() => this.submission()?.drivers?.find(d => d.isPrimary));
  additionalDrivers = computed(() => this.submission()?.drivers?.filter(d => !d.isPrimary));
  plan = computed(() => this.submission()?.coverage);

  ngOnInit() {
  }

  onBack() {
    this.journeyService.goBack();
  }

  onSubmit() {
    alert('Application Submitted Successfully!');
    this.router.navigate(['/']);
  }
}
