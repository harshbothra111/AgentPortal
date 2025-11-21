# Design Tokens Prompt

1. Centralize all brand colors, typography, spacing, and elevation values in `src/design-tokens`.
2. Expose tokens as CSS variables and TypeScript maps so both stylesheets and runtime logic share the same source of truth.
3. When adding a new token file, document the token namespace, expected usage, and any fallback values.
4. Update consuming components to reference tokens via `var(--token-name)` (SCSS) or the exported constants (TypeScript) rather than hard-coded literals.
5. Run visual regression checks or Storybook snapshots after changing tokens to catch unintended UI shifts.
6. Revise this prompt whenever the token authoring workflow changes (e.g., adding build tooling or design handoff steps).

