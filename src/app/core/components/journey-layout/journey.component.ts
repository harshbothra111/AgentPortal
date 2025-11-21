import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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

  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get('productId');
    
    if (!productId) {
      productId = this.route.snapshot.data['productId'];
    }

    if (productId) {
      this.journeyService.getJourney(productId).subscribe();
    }
  }
}
