import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DemoStep {
  title: string;
  icon: string; // Font Awesome class string
  description: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo {
  private readonly allSteps: DemoStep[] = [
    { title: 'Quote', description: 'Initial product and vehicle basics.', icon: 'fa-regular fa-tags' },
    { title: 'Driver', description: 'Driver information & history.', icon: 'fa-regular fa-user' },
    { title: 'Coverage', description: 'Select coverages & deductible.', icon: 'fa-regular fa-shield' },
    { title: 'Payment', description: 'Provide payment details.', icon: 'fa-regular fa-credit-card' },
    { title: 'Review', description: 'Confirm & submit application.', icon: 'fa-regular fa-check-circle' }
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
