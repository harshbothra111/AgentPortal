export interface JourneyResponse {
  meta: MetaData;
  product: ProductInfo;
  journeyContext: JourneyContext;
  navigation: NavigationControl;
  workflows: Workflow[];
}

export interface MetaData {
  transactionId: string;
  timestamp: string;
  apiVersion: string;
}

export interface ProductInfo {
  productId: string;
  productName: string;
  lineOfBusiness: string;
  subType: string;
}

export interface JourneyContext {
  journeyId: string;
  currentWorkflowId: string;
  currentStepId: string;
  journeyStatus: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  lastUpdated: string;
}

export interface NavigationControl {
  nextStepId: string | null;
  previousStepId: string | null;
  canGoBack: boolean;
  canGoNext: boolean;
  exitUrl?: string;
}

export interface Workflow {
  workflowId: string;
  label: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'LOCKED';
  order: number;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  stepId: string;
  label: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'LOCKED';
  order: number;
  metadata: StepMetadata;
  fields: FieldMetadata[];
  lookups: { [key: string]: LookupOption[] };
}

export interface StepMetadata {
  isEditable: boolean;
  isVisible: boolean;
  description?: string;
}

export interface FieldMetadata {
  key: string;
  id: string;
  type?: string; // Optional hint for UI renderer (text, select, radio, etc.)
  visible: boolean;
  editable: boolean;
  required?: boolean;
  order?: number;
  onChange?: 'refresh' | 'validate' | 'none';
}

export interface LookupOption {
  code: string;
  label: string;
  [key: string]: any; // Allow extra properties in lookup objects
}
