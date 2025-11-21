import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { JourneyResponse, Workflow, WorkflowStep } from '../models/journey.model';

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
    return wf.steps.find(s => s.stepId === j.journeyContext.currentStepId) || null;
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
    const requiresInput = currentWf.steps.some(step => 
      step.fields?.length > 0 && step.metadata?.isEditable !== false
    );

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
    // In a real app, productId would determine the endpoint
    return this.http.get<JourneyResponse>('assets/data/auto-insurance-journey.json').pipe(
      tap(response => this._journey.set(response))
    );
  }

  updateStep(workflowId: string, stepId: string) {
    const currentJourney = this._journey();
    if (currentJourney) {
      // Update the journey context
      const updatedJourney = {
        ...currentJourney,
        journeyContext: {
          ...currentJourney.journeyContext,
          currentWorkflowId: workflowId,
          currentStepId: stepId
        }
      };
      this._journey.set(updatedJourney);
    }
  }



  // Helper to find next step logic (simplified for demo)
  proceedToNextStep() {
    const j = this._journey();
    if (!j || !j.navigation.nextStepId) return;

    // Find where the next step lives
    let nextWorkflowId = j.journeyContext.currentWorkflowId;
    let found = false;

    // Search in current workflow
    const currentWf = j.workflows.find(w => w.workflowId === nextWorkflowId);
    if (currentWf?.steps.some(s => s.stepId === j.navigation.nextStepId)) {
        found = true;
    } else {
        // Search other workflows
        for (const wf of j.workflows) {
            if (wf.steps.some(s => s.stepId === j.navigation.nextStepId)) {
                nextWorkflowId = wf.workflowId;
                found = true;
                break;
            }
        }
    }

    if (found) {
        this.updateStep(nextWorkflowId, j.navigation.nextStepId!);
    }
  }
}
