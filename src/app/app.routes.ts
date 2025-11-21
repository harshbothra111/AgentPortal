import { Routes } from '@angular/router';
import { Demo } from './demo/demo';
import { ProductSelectionComponent } from './features/product-selection/product-selection.component';

export const routes: Routes = [
  { path: '', component: ProductSelectionComponent },
  { 
    path: 'journey/:productId', 
    loadComponent: () => import('./features/journey/journey.component').then(m => m.JourneyComponent),
    loadChildren: () => import('./features/journey/journey.routes').then(m => m.journeyRoutes)
  },
  { path: 'demo', component: Demo }
];
