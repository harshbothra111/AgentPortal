import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Load initial data
const dataPath = path.join(process.cwd(), 'src/assets/data/auto-insurance-journey.json');
let journeyState: any = null;
let answers: Record<string, any> = {};

try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    journeyState = JSON.parse(rawData);
} catch (err) {
    console.error('Error reading journey data:', err);
}

// Helper functions
function calculateNextStep(currentStepId: string): string | null {
    if (!journeyState) return null;
    const allSteps = journeyState.workflows.flatMap((w: any) => w.steps || []);
    const currentIndex = allSteps.findIndex((s: any) => s.stepId === currentStepId);

    if (currentIndex !== -1 && currentIndex < allSteps.length - 1) {
        return allSteps[currentIndex + 1].stepId;
    }
    return null;
}

function calculatePreviousStep(currentStepId: string): string | null {
    if (!journeyState) return null;
    const allSteps = journeyState.workflows.flatMap((w: any) => w.steps || []);
    const currentIndex = allSteps.findIndex((s: any) => s.stepId === currentStepId);

    if (currentIndex > 0) {
        return allSteps[currentIndex - 1].stepId;
    }
    return null;
}

function createResponseView(): any {
    if (!journeyState) return null;
    const view = JSON.parse(JSON.stringify(journeyState));

    view.workflows.forEach((wf: any) => {
        if (wf.workflowId !== view.journeyContext.currentWorkflowId) {
            wf.lookups = {}; // Strip lookups for non-active workflows
            wf.steps = null; // Remove steps for non-active workflows
        } else {
            // Active workflow
            wf.steps = wf.steps?.map((s: any) => {
                if (s.stepId !== view.journeyContext.currentStepId) {
                    return { ...s, fields: [] };
                }
                // Populate values for the current step
                const stepAnswers = answers[s.stepId] || {};
                s.data = stepAnswers;
                s.fields = s.fields?.map((f: any) => ({
                    ...f,
                    value: stepAnswers[f.key] || null
                }));
                return s;
            });
        }
    });
    return view;
}

// Routes
app.get('/api/journey/:productId', (req, res) => {
    if (!journeyState) {
        res.status(500).json({ error: 'Journey data not loaded' });
        return;
    }
    
    // Re-read file to reset state
    try {
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        journeyState = JSON.parse(rawData);
        answers = {};
    } catch (err) {
        res.status(500).json({ error: 'Error reloading journey data' });
        return;
    }

    const response = createResponseView();
    setTimeout(() => res.json(response), 500); // Simulate delay
});

app.post('/api/journey/submit', (req, res) => {
    const { lastJourneyResponse, userInput } = req.body;

    if (!journeyState) {
        res.status(500).json({ error: 'Journey data not loaded' });
        return;
    }

    // Use the stepId from the context provided by client, or fallback to server state
    const currentStepId = lastJourneyResponse?.journeyContext?.currentStepId || journeyState.journeyContext.currentStepId;

    // 1. Save answers
    answers[currentStepId] = userInput;
    
    // 2. Determine next step
    const nextStepId = calculateNextStep(currentStepId);

    // 3. Update Journey Context
    if (nextStepId) {
        // Update previous step before changing current
        journeyState.navigation.previousStepId = journeyState.journeyContext.currentStepId;
        journeyState.navigation.canGoBack = true;

        journeyState.journeyContext.currentStepId = nextStepId;
        // journeyState.navigation.nextStepId = calculateNextStep(nextStepId); // Removed

        const nextStepWorkflow = journeyState.workflows.find((w: any) => w.steps?.some((s: any) => s.stepId === nextStepId));
        if (nextStepWorkflow) {
            journeyState.journeyContext.currentWorkflowId = nextStepWorkflow.workflowId;
        }
    }

    // 4. Return updated view
    const response = createResponseView();
    
    // Add extra data for display if needed (Simulation)
    if (currentStepId === 'step_vehicle_identification') {
        response.extraData = {
            message: "Vehicle identified successfully",
            vehicleSummary: `${userInput.make} ${userInput.model} (${userInput.registrationYear})`
        };
    }

    setTimeout(() => res.json(response), 500);
});

app.post('/api/journey/back', (req, res) => {
    if (!journeyState) {
        res.status(500).json({ error: 'Journey data not loaded' });
        return;
    }

    const currentStepId = journeyState.journeyContext.currentStepId;
    const previousStepId = calculatePreviousStep(currentStepId);

    if (previousStepId) {
        journeyState.journeyContext.currentStepId = previousStepId;
        
        // Update workflow if needed
        const prevStepWorkflow = journeyState.workflows.find((w: any) => w.steps?.some((s: any) => s.stepId === previousStepId));
        if (prevStepWorkflow) {
            journeyState.journeyContext.currentWorkflowId = prevStepWorkflow.workflowId;
        }
        
        // Update navigation flags
        journeyState.navigation.canGoNext = true;
        journeyState.navigation.previousStepId = calculatePreviousStep(previousStepId);
        journeyState.navigation.canGoBack = !!journeyState.navigation.previousStepId;
    }

    const response = createResponseView();
    setTimeout(() => res.json(response), 500);
});

app.listen(port, () => {
    console.log(`Mock backend server running at http://localhost:${port}`);
});
