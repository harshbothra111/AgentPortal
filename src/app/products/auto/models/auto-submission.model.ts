export interface AutoSubmission {
  submissionId?: string;
  vehicle: VehicleDetails;
  drivers: DriverDetails[];
  coverage: CoverageDetails;
  quote?: QuoteDetails;
}

export interface VehicleDetails {
  registrationNumber?: string;
  make?: string;
  model?: string;
  variant?: string;
  registrationYear?: string;
  primaryUse?: string;
  annualMileage?: number;
  isFinanced?: boolean;
}

export interface DriverDetails {
  isPrimary: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  licenseNumber: string;
}

export interface CoverageDetails {
  planType?: string;
}

export interface QuoteDetails {
  premium: number;
  currency: string;
}
