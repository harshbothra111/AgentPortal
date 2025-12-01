import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

interface DemoStep {
  title: string;
  icon: string; // Material Icon name
  description: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatChipsModule, MatListModule],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo {
  private readonly allSteps: DemoStep[] = [
    { title: 'Quote', description: 'Initial product and vehicle basics.', icon: 'local_offer' },
    { title: 'Driver', description: 'Driver information & history.', icon: 'person' },
    { title: 'Coverage', description: 'Select coverages & deductible.', icon: 'shield' },
    { title: 'Payment', description: 'Provide payment details.', icon: 'credit_card' },
    { title: 'Review', description: 'Confirm & submit application.', icon: 'check_circle' }
  ];

  stepIndex = signal(0);
  steps = signal(this.allSteps);

  current = computed(() => this.steps()[this.stepIndex()]);
  isFirst = computed(() => this.stepIndex() === 0);
  isLast = computed(() => this.stepIndex() === this.steps().length - 1);
  progressPct = computed(() => ((this.stepIndex() + 1) / this.steps().length) * 100);

  next() {
    if (!this.isLast()) this.stepIndex.update(i => i + 1);
  }
  prev() {
    if (!this.isFirst()) this.stepIndex.update(i => i - 1);
  }
  goTo(i: number) {
    this.stepIndex.set(i);
  }
}
