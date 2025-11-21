<!-- .github/copilot-instructions.md: Guidance for AI coding agents working on this repo -->
# Repo summary

This is a small Angular (CLI) application generated with Angular 20.x. It uses the standalone-component pattern and Angular's zoneless bootstrap API.

Key entry points and files:

- `src/main.ts` — bootstraps the app via `bootstrapApplication(App, appConfig)`.
- `src/app/app.ts` — root standalone `App` component (uses `signal()` for local state).
- `src/app/app.config.ts` — central `ApplicationConfig` providers (router, zoneless change detection, global error listeners).
- `src/app/app.routes.ts` — application routes (currently an empty `Routes` array).
- `angular.json` — assets come from the `public/` folder and global styles are `src/styles.scss`.

# What to know before editing

- Standalone components: the app uses the standalone/component + `bootstrapApplication` pattern, not NgModules. Keep new components standalone unless there's a clear reason to use modules.
- Zoneless change detection: `provideZonelessChangeDetection()` is enabled in `app.config.ts`. Avoid relying on `Zone.js` side-effects; prefer explicit signals or `markForCheck` equivalents and use Angular signals for reactive state.
- Router setup: add routes in `src/app/app.routes.ts` and register any route-level providers in `app.config.ts`.
- Assets: static files should go into `public/` (see `angular.json` assets section).

# Developer workflows (exact commands)

- Install deps: `npm ci` (or `npm install`)
- Local dev server: `npm start` (runs `ng serve` — default host `http://localhost:4200/`)
- Build production: `npm run build` (runs `ng build`)
- Watch build: `npm run watch` (incremental dev build)
- Unit tests: `npm test` (Karma + Jasmine)

# Code patterns & conventions specific to this repo

- Styles: SCSS is the project-wide style language. Global styles: `src/styles.scss`. Component styles live alongside component files (e.g. `src/app/app.scss`).
- Templates: components use external templates (`templateUrl`) and external style file keys (see `App` component).
- Signals for state: small pieces of UI state use `signal()` (see `title` in `src/app/app.ts`). Follow this approach for local component state.
- Keep `app.routes.ts` small and declarative. Route registration is centralized in `app.config.ts`.

# Examples (how to add common things)

- Add a new standalone component and route:

  1. Create `src/app/foo/foo.ts` with `@Component({ standalone: true, imports: [...], templateUrl: './foo.html' })`.
  2. Add a route in `src/app/app.routes.ts`:

     ```ts
     import { Routes } from '@angular/router';
     import { Foo } from './foo/foo';

     export const routes: Routes = [ { path: 'foo', component: Foo } ];
     ```

    **Component creation rules**

    - **Template & styling files:** Keep the component TypeScript file lean — put the HTML template in a separate `*.html` file and styles in a separate `*.scss` file (use `templateUrl` and `styleUrls`). Example component metadata:

      ```ts
      @Component({
        standalone: true,
        imports: [...],
        templateUrl: './foo.html',
        styleUrls: ['./foo.scss']
      })
      ```

    - **Template directive policy:** This repository follows a custom policy to prefer the newer template syntax over legacy microsyntax. Do not use legacy microsyntax like `*ngIf` or `*ngFor`. Instead use the project's preferred forms such as `@if` and `@for` in templates (these are project conventions — ensure your templates follow the team's agreed parser/transform if present). If you are unsure whether a template transform exists in the build pipeline, ask the team before introducing these constructs.
      
      Example patterns (Angular v17+ control flow):
      
      ```html
      @if (isLoading()) {
        <app-spinner />
      } @else {
        <app-content />
      }
      
      @for (item of items(); track item.id; let i = $index) {
        <li (click)="select(item)">{{ i + 1 }}. {{ item.label }}</li>
      }
      ```
      
      Requirements for `@for`:
      - Always provide a `track` expression for stable identity (prefer a unique id or stable primitive).
      - Local loop context variables: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd` are available via `let var = $index` style.
      - Omit the `let` keyword before the iteration variable: `@for (user of users(); ...)` NOT `@for (let user of users(); ...)`.
      - Keep block braces `{ ... }` — they are required; no implicit closing like legacy microsyntax.
      
      Common mistakes to avoid:
      - Missing `track` → compile error.
      - Using `let` before the loop variable.
      - Forgetting braces or mixing with `*ngFor`.
      
      Migration tip: When converting `*ngFor="let s of steps; index as i"`, rewrite as:
      
      ```html
      @for (s of steps(); track s.id; let i = $index) {
        <!-- template body -->
      }
      ```

    - **Per-component folders:** Always create a component inside its own folder named after the component and include at minimum the component TypeScript file, the external template, and the external styles. Recommended layout for `src/app/foo/`:

      - `foo.ts` — component class (standalone)
      - `foo.html` — external template (`templateUrl`)
      - `foo.scss` — component styles (`styleUrls`)
      - `foo.spec.ts` — optional unit tests

      This keeps imports predictable (e.g., `import { Foo } from './foo/foo';`) and makes automated tooling and refactors simpler.


# Tests and CI notes

- Unit tests use Karma + Jasmine (see `karma` devDependency). Tests live next to source files as `*.spec.ts` (example: `src/app/app.spec.ts`).
- For CI, run `npm ci && npm test` and optionally `npm run build` for artifact verification.

# When the AI agent should be conservative

- Do not refactor bootstrapping (changing from `bootstrapApplication` to `NgModule`-based bootstrapping) unless requested — it's a deliberate architectural choice.
- Avoid adding `Zone.js` or removing `provideZonelessChangeDetection()` without explicit approval.

# Where to look for context

- `src/main.ts`, `src/app/app.config.ts`, `src/app/app.ts`, `src/app/app.routes.ts`, `angular.json`, and `package.json`.

If anything in this guidance is unclear or you'd like me to expand any section (examples, tests, or CI steps), tell me which part to iterate on.
 
# Prompt library

The repository contains a curated prompt library in `.github/prompt-library/` with reusable, domain-specific prompt files. These are intended to accelerate common architectural, refactor, and feature tasks.

How to use (AI agent or human):

1. Browse the directory: each file name conveys its focus (e.g. `prompt-standalone-component.md`, `prompt-signals.md`, `prompt-angular-clean-architecture.md`).
2. Open the file to review its guidance and include (copy/paste or reference) its content when initiating a related task. Prefer referencing the file path rather than duplicating large sections verbatim.
3. When creating new prompts:
  - Follow existing naming convention: `prompt-<topic>.md` (kebab-case, concise).
  - Keep them self-contained, actionable checklists or structured guidance rather than narrative prose.
  - Avoid overlapping duplicate prompts; extend or refine an existing file if the topic is closely related.
4. If a prompt supersedes prior guidance, add a short deprecation notice at the top of the older file referencing the new file.

Recommended integration patterns:

- For multi-step feature work, import relevant checklist items into the TODO planning phase.
- For architectural changes, cite the prompt file path in commit messages (e.g. `ref: .github/prompt-library/prompt-design-tokens.md`).
- Keep prompts technology-version aware; update when Angular major versions introduce paradigm shifts (signals, zoneless, SSR, hydration, etc.).

Quality bar for new prompts:

- Clear objective line at top (e.g., `Objective: Introduce SSR to existing standalone Angular app`).
- Bullet list of prerequisites (version constraints, libraries, config files touched).
- Ordered steps (each action verifiable).
- Post-implementation validation checklist.