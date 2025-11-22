import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env['PORT'] || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from Angular build
const distPath = path.join(process.cwd(), 'dist/AgentPortal/browser');
app.use(express.static(distPath));

// Load initial data
const dataPath = path.join(process.cwd(), 'src/assets/data/auto-insurance-journey.json');
let journeyState: any = null;

// Domain Model State
let submissionData: any = {
    vehicle: {},
    drivers: [],
    coverage: {}
};

try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    journeyState = JSON.parse(rawData);
} catch (err) {
    console.error('Error reading journey data:', err);
}

// Helper: Map step input to domain model
function updateSubmissionData(stepId: string, input: any) {
    switch (stepId) {
        case 'step_vehicle_identification':
            submissionData.vehicle = { ...submissionData.vehicle, ...input };
            break;
        case 'step_vehicle_usage':
            submissionData.vehicle = { ...submissionData.vehicle, ...input };
            break;
        case 'step_primary_driver':
            // Upsert primary driver
            const primaryIndex = submissionData.drivers.findIndex((d: any) => d.isPrimary);
            const primaryDriver = { ...input, isPrimary: true };
            if (primaryIndex >= 0) {
                submissionData.drivers[primaryIndex] = primaryDriver;
            } else {
                submissionData.drivers.push(primaryDriver);
            }
            break;
        case 'step_additional_drivers':
            // Replace all non-primary drivers or append? 
            // For simplicity, let's assume input.drivers is the full list of additional drivers
            if (input.drivers && Array.isArray(input.drivers)) {
                // Remove existing additional drivers
                submissionData.drivers = submissionData.drivers.filter((d: any) => d.isPrimary);
                // Add new ones
                const additionalDrivers = input.drivers.map((d: any) => ({ ...d, isPrimary: false }));
                submissionData.drivers.push(...additionalDrivers);
            }
            break;
        case 'step_plans': // step_select_plan in some contexts, check JSON
        case 'step_select_plan':
            submissionData.coverage = { ...submissionData.coverage, ...input };
            break;
    }
}

// Helper: Map domain model back to step fields for UI binding
function getStepData(stepId: string): any {
    switch (stepId) {
        case 'step_vehicle_identification':
            return {
                registrationNumber: submissionData.vehicle.registrationNumber,
                make: submissionData.vehicle.make,
                model: submissionData.vehicle.model,
                variant: submissionData.vehicle.variant,
                registrationYear: submissionData.vehicle.registrationYear
            };
        case 'step_vehicle_usage':
            return {
                primaryUse: submissionData.vehicle.primaryUse,
                annualMileage: submissionData.vehicle.annualMileage,
                isFinanced: submissionData.vehicle.isFinanced
            };
        case 'step_primary_driver':
            return submissionData.drivers.find((d: any) => d.isPrimary) || {};
        case 'step_additional_drivers':
            return {
                drivers: submissionData.drivers.filter((d: any) => !d.isPrimary)
            };
        case 'step_plans':
        case 'step_select_plan':
            return submissionData.coverage;
        default:
            return {};
    }
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
    
    // Attach domain model
    view.submissionData = submissionData;

    // Return full journey structure with populated values
    view.workflows.forEach((wf: any) => {
        // Populate values for all steps
        wf.steps = wf.steps?.map((s: any) => {
            const stepData = getStepData(s.stepId);
            s.data = stepData; // For complex components
            s.fields = s.fields?.map((f: any) => ({
                ...f,
                value: stepData[f.key] || null
            }));
            return s;
        });
    });
    return view;
}

// Routes
app.get('/api/journey/:productId', (req: Request, res: Response) => {
    if (!journeyState) {
        res.status(500).json({ error: 'Journey data not loaded' });
        return;
    }
    
    // Re-read file to reset state
    try {
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        journeyState = JSON.parse(rawData);
        // Reset domain model
        submissionData = {
            vehicle: {},
            drivers: [],
            coverage: {}
        };
    } catch (err) {
        res.status(500).json({ error: 'Error reloading journey data' });
        return;
    }

    const response = createResponseView();
    setTimeout(() => res.json(response), 500); // Simulate delay
});

app.post('/api/journey/submit', (req: Request, res: Response) => {
    const { userInput, submissionData: clientSubmissionData, stepId } = req.body;

    if (!journeyState) {
        res.status(500).json({ error: 'Journey data not loaded' });
        return;
    }

    // Optional: Sync server state with client state if provided (for stateless behavior simulation)
    if (clientSubmissionData) {
        console.log('Restoring submission state from client');
        // Merge client state, but ensure we don't lose existing server state if client sends partial data (though usually client has full state)
        // For this mock, we'll trust the client's state as the source of truth if provided, to handle server restarts/statelessness
        submissionData = { ...submissionData, ...clientSubmissionData };
        
        // Ensure arrays are initialized
        if (!submissionData.drivers) submissionData.drivers = [];
        if (!submissionData.vehicle) submissionData.vehicle = {};
        if (!submissionData.coverage) submissionData.coverage = {};
    }

    // Use the stepId from the request if available, otherwise fallback to server state
    // This fixes the issue where client-side back navigation desyncs the server state
    const currentStepId = stepId || journeyState.journeyContext.currentStepId;

    // 1. Update Domain Model
    // Since client now sends updated submissionData, we might not need to map userInput manually if the client did it.
    // However, for robustness, if userInput is present, we map it. If not, we assume submissionData is already updated.
    if (userInput) {
        updateSubmissionData(currentStepId, userInput);
    } else {
        console.log('No userInput provided, assuming submissionData contains all updates.');
    }
    
    // 2. Determine next step
    const nextStepId = calculateNextStep(currentStepId);

    // 3. Update Journey Context
    if (nextStepId) {
        // Update previous step before changing current
        journeyState.navigation.previousStepId = currentStepId;
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
        const v = submissionData.vehicle || {};
        response.extraData = {
            message: "Vehicle identified successfully",
            vehicleSummary: `${v.make} ${v.model} (${v.registrationYear})`
        };
    }

    setTimeout(() => res.json(response), 500);
});

app.post('/api/journey/back', (req: Request, res: Response) => {
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

app.get('/api/validate/registration/:regNo', (req: Request, res: Response) => {
    const regNo = req.params['regNo'];
    // Mock logic: 'TAKEN123' is taken
    const isTaken = regNo.toUpperCase() === 'TAKEN123';
    
    res.json({ isTaken });
});

// Fallback to Angular index.html for non-API routes
app.get(/.*/, (req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'API endpoint not found' });
        return;
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Mock backend server running at http://localhost:${port}`);
});
