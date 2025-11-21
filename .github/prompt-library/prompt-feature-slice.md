## Prompt: Angular Feature Slice (Clean Architecture)

**Context**
We are adding or modifying a feature (e.g., policies, claims, submissions) within src/app/features.

**Constraints**
- Standalone components only (standalone: true).
- Feature-level routing via provideRouter child routes.
- Signals for local state; no NgRx unless requested.
- Reuse shared UI from src/common/components; styles in SCSS.
- API access through src/app/core/services; interceptors handle auth.

**What to Produce**
- Directory layout under src/app/features/<feature-name>.
- Component/service templates with signals, typed inputs/outputs.
- Guards or resolvers as needed, placed in core/guards with DI examples.
- Unit test skeletons mindful of zoneless change detection (provideZoneChangeDetection).
- Guidance on wiring JSON-driven pages (if applicable) via src/renderer.

**Output Style**
- Give command snippets (
g g component ...) plus manual adjustments.
- Provide TypeScript/HTML/SCSS snippets as needed.
- Document how the slice integrates with global routing and state.
- List validation steps (lint, test, build).
