import { Routes } from '@angular/router';
import { VehicleIdentificationComponent } from './steps/vehicle-identification/vehicle-identification.component';
import { VehicleUsageComponent } from './steps/vehicle-usage/vehicle-usage.component';
import { PrimaryDriverComponent } from './steps/primary-driver/primary-driver.component';
import { AdditionalDriversComponent } from './steps/additional-drivers/additional-drivers.component';
import { SelectPlanComponent } from './steps/select-plan/select-plan.component';
import { SummaryComponent } from './steps/summary/summary.component';

export const journeyRoutes: Routes = [
  { path: '', redirectTo: 'vehicle-identification', pathMatch: 'full' },
  { path: 'vehicle-identification', component: VehicleIdentificationComponent },
  { path: 'vehicle-usage', component: VehicleUsageComponent },
  { path: 'primary-driver', component: PrimaryDriverComponent },
  { path: 'additional-drivers', component: AdditionalDriversComponent },
  { path: 'select-plan', component: SelectPlanComponent },
  { path: 'summary', component: SummaryComponent }
];

