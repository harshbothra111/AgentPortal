import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { JourneyResponse, Workflow, WorkflowStep, JourneySubmitRequest } from '../models/journey.model';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private http = inject(HttpClient);
  
  // State signals
  private _journey = signal<JourneyResponse | null>(null);
  private _answers = signal<Record<string, any>>({}); // Store answers by stepId or key
  
  public readonly journey = this._journey.asReadonly();
  public readonly answers = this._answers.asReadonly();
  
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

  updateAnswers(stepId: string, data: any) {
    this._answers.update(current => ({
      ...current,
      [stepId]: data
    }));
  }

  getJourney(productId: string): Observable<JourneyResponse> {
    // Call the mock API endpoint
    return this.http.get<JourneyResponse>(`/api/journey/${productId}`).pipe(
      tap(response => this._journey.set(response))
    );
  }

  submitCurrentStep(data: any): Observable<JourneyResponse> {
    const currentJourney = this._journey();
    const currentStepId = this.currentStep()?.stepId;
    
    const payload: JourneySubmitRequest = {
      lastJourneyResponse: currentJourney!,
      userInput: data
    };

    return this.http.post<JourneyResponse>(`/api/journey/submit`, payload).pipe(
      tap(response => {
        // Update answers locally for summary view
        if (currentStepId) {
             this.updateAnswers(currentStepId, data);
        }
        this._journey.set(response);
      })
    );
  }

  navigateBack(): Observable<JourneyResponse> {
    const currentJourney = this._journey();
    
    const payload = {
      lastJourneyResponse: currentJourney
    };

    return this.http.post<JourneyResponse>(`/api/journey/back`, payload).pipe(
      tap(response => {
        this._journey.set(response);
      })
    );
  }

  // Removed updateStep and proceedToNextStep as they are now handled by the backend/interceptor
}
