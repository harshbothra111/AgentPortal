import { Routes } from '@angular/router';
import { Demo } from './demo/demo';
import { ProductSelectionComponent } from './products/product-selection/product-selection.component';

export const routes: Routes = [
  { path: '', component: ProductSelectionComponent },
  { 
    path: 'journey/auto', 
    loadChildren: () => import('./products/auto/auto.routes').then(m => m.AUTO_ROUTES)
  },
  { path: 'demo', component: Demo }
];
