import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { JourneyResponse, Workflow, WorkflowStep, JourneySubmitRequest } from '../models/journey.model';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // State signals
  private _journey = signal<JourneyResponse | null>(null);
  private _submission = signal<any>(null); // Store generic domain model
  
  public readonly journey = this._journey.asReadonly();
  public readonly submission = this._submission.asReadonly();
  
  public readonly currentWorkflow = computed(() => {
    const j = this._journey();
    if (!j) return null;
    return j.workflows.find(w => w.workflowId === j.journeyContext.currentWorkflowId) || null;
  });

  public readonly currentStep = computed(() => {
    const wf = this.currentWorkflow();
    const j = this._journey();
    if (!wf || !j) return null;
    return wf.steps?.find(s => s.stepId === j.journeyContext.currentStepId) || null;
  });

  public readonly progress = computed(() => {
    const j = this._journey();
    if (!j) return 0;

    const totalWorkflows = j.workflows.length;
    if (totalWorkflows === 0) return 0;

    const currentWorkflowIndex = j.workflows.findIndex(w => w.workflowId === j.journeyContext.currentWorkflowId);
    if (currentWorkflowIndex === -1) return 0;
    
    let completedCount = currentWorkflowIndex;

    // Check if current workflow requires input (has editable fields)
    const currentWf = j.workflows[currentWorkflowIndex];
    const requiresInput = currentWf.steps?.some(step => 
      (step.fields?.length ?? 0) > 0 && step.metadata?.isEditable !== false
    ) ?? false;

    // If no input is required (e.g. summary/review), count it as completed
    if (!requiresInput) {
      completedCount++;
    }
    
    return Math.round((completedCount / totalWorkflows) * 100);
  });

  // updateAnswers removed as we use centralized submission data now

  getJourney(productId: string): Observable<JourneyResponse> {
    // Call the mock API endpoint
    return this.http.get<JourneyResponse>(`/api/journey/${productId}`).pipe(
      tap(response => {
        console.log('getJourney response:', response);
        this._journey.set(response);
        if (response.submissionData) {
          console.log('Setting submission data from getJourney:', response.submissionData);
          this._submission.set(response.submissionData);
        } else {
          console.warn('No submissionData in getJourney response');
        }
      })
    );
  }

  submitCurrentStep(updatedSubmissionData: any): Observable<JourneyResponse> {
    const currentJourney = this._journey();
    
    const payload: JourneySubmitRequest = {
      submissionData: updatedSubmissionData,
      stepId: currentJourney?.journeyContext.currentStepId
    };

    console.log('Submitting step with payload:', payload);

    return this.http.post<JourneyResponse>(`/api/journey/submit`, payload).pipe(
      tap(response => {
        console.log('Submit response:', response);
        this._journey.set(response);
        if (response.submissionData) {
             console.log('Updating submission data from submit response:', response.submissionData);
             this._submission.set(response.submissionData);
        }
      })
    );
  }

  navigateBack(): Observable<JourneyResponse> {
    const currentJourney = this._journey();
    if (!currentJourney) return new Observable();

    // Calculate previous step locally
    const allSteps = currentJourney.workflows.flatMap(w => w.steps || []);
    const currentIndex = allSteps.findIndex(s => s.stepId === currentJourney.journeyContext.currentStepId);
    
    if (currentIndex > 0) {
      const previousStep = allSteps[currentIndex - 1];
      const previousWorkflow = currentJourney.workflows.find(w => w.steps?.some(s => s.stepId === previousStep.stepId));

      // Create a new journey state object (immutable update)
      const updatedJourney = JSON.parse(JSON.stringify(currentJourney));
      updatedJourney.journeyContext.currentStepId = previousStep.stepId;
      if (previousWorkflow) {
        updatedJourney.journeyContext.currentWorkflowId = previousWorkflow.workflowId;
      }
      
      // Update navigation flags
      updatedJourney.navigation.canGoNext = true;
      updatedJourney.navigation.canGoBack = currentIndex > 1; // If index was 1, prev is 0, so canGoBack becomes false? 
      // Actually, let's check if there is a step before the previous one
      updatedJourney.navigation.previousStepId = currentIndex > 1 ? allSteps[currentIndex - 2].stepId : null;

      // Update the signal
      this._journey.set(updatedJourney);
      
      // Return the updated journey as an observable
      return new Observable(observer => {
        observer.next(updatedJourney);
        observer.complete();
      });
    }

    return new Observable(observer => {
      observer.next(currentJourney);
      observer.complete();
    });
  }

  // Removed updateStep and proceedToNextStep as they are now handled by the backend/interceptor

  // Helper to handle navigation based on response
  private handleNavigation(response: JourneyResponse) {
    const nextStepId = response.journeyContext.currentStepId;
    const currentWorkflow = response.workflows.find(w => w.workflowId === response.journeyContext.currentWorkflowId);
    const nextStep = currentWorkflow?.steps?.find(s => s.stepId === nextStepId);
    
    if (nextStep && nextStep.route) {
      // Extract product route from current URL to ensure we stay in the same product context
      // URL format: /journey/{product}/{step}
      const urlSegments = this.router.url.split('/');
      const productRoute = urlSegments[2] || 'auto'; // Fallback to 'auto' if structure doesn't match
      
      this.router.navigate(['journey', productRoute, nextStep.route]);
    }
  }

  goBack() {
    this.navigateBack().subscribe(response => {
      this.handleNavigation(response);
    });
  }

  submitStep(data: any) {
    this.submitCurrentStep(data).subscribe(response => {
      this.handleNavigation(response);
    });
  }
}
