## Prompt: Standalone Component Blueprint

**Use When**
Creating a reusable UI component for src/common/components.

**Requirements**
- standalone: true, changeDetection: signal (if applicable).
- Inputs/outputs strictly typed; leverage Angular signals or 	oSignal for observable sources.
- Styles in SCSS; use design tokens from src/design-tokens.
- Accessibility (ARIA) and theming via Material tokens or custom tokens.
- Provide Storybook-like usage notes if helpful.

**Deliverables**
- Generation command (
g g component common/components/<name> --standalone).
- TypeScript snippet showing signal-based internal state.
- Template snippet demonstrating Material 3 components or tokenized styles.
- SCSS example referencing token variables.
- Unit test outline with TestBed in zoneless mode.
- Notes on how to expose the component (barrel export, module federation if any).

**Formatting**
- Keep sections short with fenced code blocks.
- Call out extensibility points (content projection, variants, inputs).
- Mention lint/test commands to run after creation.
