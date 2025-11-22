import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { JourneyService } from '../../services/journey.service';

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.scss'
})
export class JourneyComponent implements OnInit {
  journeyService = inject(JourneyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get('productId');
    
    if (!productId) {
      productId = this.route.snapshot.data['productId'];
    }

    if (productId) {
      this.journeyService.getJourney(productId, (response) => {
        const currentStepId = response.journeyContext.currentStepId;
        const workflow = response.workflows.find(w => w.steps?.some(s => s.stepId === currentStepId));
        const step = workflow?.steps?.find(s => s.stepId === currentStepId);

        if (step && step.route) {
          this.router.navigate([step.route], { relativeTo: this.route });
        }
      });
    }
  }
}
