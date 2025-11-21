import { Routes } from '@angular/router';
import { JourneyComponent } from '../../core/components/journey-layout/journey.component';
import { VehicleIdentificationComponent } from './components/vehicle-identification/vehicle-identification.component';
import { VehicleUsageComponent } from './components/vehicle-usage/vehicle-usage.component';
import { PrimaryDriverComponent } from './components/primary-driver/primary-driver.component';
import { AdditionalDriversComponent } from './components/additional-drivers/additional-drivers.component';
import { SelectPlanComponent } from './components/select-plan/select-plan.component';
import { SummaryComponent } from './components/summary/summary.component';

export const AUTO_ROUTES: Routes = [
  {
    path: '',
    component: JourneyComponent,
    data: { productId: 'PROD_AUTO_001' },
    children: [
      { path: '', redirectTo: 'vehicle-identification', pathMatch: 'full' },
      { path: 'vehicle-identification', component: VehicleIdentificationComponent },
      { path: 'vehicle-usage', component: VehicleUsageComponent },
      { path: 'primary-driver', component: PrimaryDriverComponent },
      { path: 'additional-drivers', component: AdditionalDriversComponent },
      { path: 'select-plan', component: SelectPlanComponent },
      { path: 'summary', component: SummaryComponent }
    ]
  }
];

