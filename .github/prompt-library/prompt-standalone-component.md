## Prompt: Standalone Component Blueprint

**Use When**
Creating a reusable UI component for src/common/components.

**Requirements**
- standalone: true, changeDetection: signal (if applicable).
- Inputs/outputs strictly typed; leverage Angular signals or 	oSignal for observable sources.
- Styles in SCSS; use design tokens from src/design-tokens.
- Accessibility (ARIA) and theming via Material tokens or custom tokens.
- Provide Storybook-like usage notes if helpful.

    - **Template & styling files:** Keep the component TypeScript file lean — put the HTML template in a separate `*.html` file and styles in a separate `*.scss` file (use `templateUrl` and `styleUrl`). Example component metadata:

      ```ts
      @Component({
        standalone: true,
        imports: [...],
        templateUrl: './foo.html',
        styleUrl: './foo.scss'
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
      - `foo.scss` — component styles (`styleUrl`)
      - `foo.spec.ts` — optional unit tests

      This keeps imports predictable (e.g., `import { Foo } from './foo/foo';`) and makes automated tooling and refactors simpler.
