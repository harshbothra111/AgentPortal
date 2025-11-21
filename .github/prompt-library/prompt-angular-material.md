# Angular Material Prompt

1. Integrate Material components using standalone imports (`MatButtonModule`, `MatFormFieldModule`, etc.) to stay compliant with Angular 20.
2. Theme all components through `src/design-tokens/material-theme.scss`; never rely on default palettes.
3. Prefer `mat-` form-field controls for accessibility & consistency; wrap shared components when exposing custom UI.
4. Keep icon usage consistent by loading the Material Icons font or registering SVG icons via `MatIconRegistry`.
5. Run `npm run build:ssr` after major Material upgrades to ensure styles compile correctly in Universal builds.
6. Document any custom Material extensions or overrides in this prompt to guide future contributors.

