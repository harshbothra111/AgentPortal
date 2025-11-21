## Prompt: Common Components Library (Angular 20, Signals)

**Goal**
Create or enhance a reusable common components library under src/common/components for the pnc-ui-accelerator Angular 20 project. Components serve Property & Casualty insurance flows (quote, bind, issue).

**Requirements**
- Standalone components only; changeDetection: ChangeDetectionStrategy.OnPush.
- Zoneless setup (provideZoneChangeDetection) respected; avoid direct Zone.js usage.
- Manage internal state with Angular Signals (signal, computed, effect).
- SCSS styles consume design tokens from src/design-tokens.
- Accessibility: ARIA roles, keyboard navigation, focus management, i18n-ready text.
- Support $localize or translation keys for all strings.
- Component inventory: layout shell (header/footer/sidebar/navbar), tab-nav, stepper, card, notification/toast, select & multi-select dropdowns, date-picker, search-box, accordion, modal/dialog, popup, auto-fill suggestions, input masking, buttons (primary/secondary/icon/loading), text field, text area, input variants, radio/checkbox groups, file upload, image/video carousels, sliders, progress indicators, multi-step progress bar, tooltip.

**Deliverables**
- Directory scaffolding commands (
g g component …) or manual file tree.
- Implementation snippets: TypeScript, template, SCSS with tokens, signal-based state.
- Guidance on shared utilities (e.g., base signal component, form helpers, i18n mixins).
- Testing patterns: TestBed with zoneless providers, a11y verifications.
- Integration notes: how to consume in feature modules, register in Storybook or docs.

**Output Style**
- Structured sections: scaffold, core utilities, per-component guidelines, testing, accessibility, i18n.
- Use fenced code blocks for commands and key snippets.
- Distinguish mandatory vs optional features (e.g., advanced carousel lightbox).
- Include validation steps (
pm run lint, 
pm run test, 
pm run build).
