export interface JourneyResponse<T = any> {
  meta: MetaData;
  product: ProductInfo;
  journeyContext: JourneyContext;
  navigation: NavigationControl;
  workflows: Workflow[];
  submissionData?: T; // Generic domain-centric data model
  extraData?: any; // Generic container for additional display data
}

export interface JourneySubmitRequest<T = any> {
  submissionData?: T;
  stepId?: string;
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
  lookups?: { [key: string]: LookupOption[] }; // Moved from Step to Workflow
  steps?: WorkflowStep[] | null; // Optional, only present if active or needed
}

export interface WorkflowStep {
  stepId: string;
  label: string;
  route: string; // Added for UI navigation
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'LOCKED';
  order: number;
  metadata: StepMetadata;
  fields?: FieldMetadata[]; // Optional, only present if active
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
  value?: any; // Value for binding
}

export interface LookupOption {
  code: string;
  label: string;
  [key: string]: any; // Allow extra properties in lookup objects
}
