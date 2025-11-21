## Prompt: Angular 20 Clean Architecture Baseline

**Goal**
Stand up or refactor an Angular 20 project named pnc-ui-accelerator with clean architecture, standalone components, signals, SSR, zoneless change detection, and Material 3 (or custom tokens).

**Key Requirements**
- Angular CLI latest; strict mode, SCSS, routing, standalone, SSR.
- Remove zone.js; provide zoneless change detection via provideZoneChangeDetection and @angular/core/rxjs-interop.
- Use Angular Signals for shared state; prefer injectable signal stores.
- Enforce clean architecture folders:
  `
  src/app/core/{guards,interceptors,services,layout}
  src/app/programs/products/{auto,home,...}
  src/common/{components,directives,pipes}
  src/design-tokens
  `
- Integrate Bootstrap or custom SCSS design tokens (/design-tokens).
- Ensure universal files (main.server.ts, server.ts) are wired; maintain dev:ssr script.
- Configure ESLint + Prettier; include scripts lint, lint:fix, ormat.

**Deliverables**
- CLI commands or manual steps with explanations.
- Config snippets (ngular.json, 	sconfig*.json, main.ts, etc.) demonstrating zoneless bootstrap and signals usage.
- Example directory scaffolding commands or scripts.
- Recommended state service template using signals.
- Notes on testing (Jest/Jasmine) with zoneless TestBed, and SSR verification commands.

**Tone & Output**
- Provide concise, actionable instructions with command/code blocks.
- Highlight optional vs. mandatory steps.
- Include verification steps (
pm run build, 
pm run dev:ssr).
- Mention any known pitfalls or breaking changes in Angular 20.
