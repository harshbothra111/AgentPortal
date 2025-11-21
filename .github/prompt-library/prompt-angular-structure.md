# Angular 20 Structure Prompt

1. Use standalone components, directives, and pipes—avoid NgModules except where required by third-party libraries.
2. Organize features by domain under `src/app/<feature>` with colocated routes (`route.ts`), components, and services.
3. Provide bootstrapping through `main.ts`/`main.server.ts` with shared `app.config.ts` to configure providers.
4. Expose cross-cutting utilities in `src/common` (components) and `src/core` (services, guards), ensuring reusable pieces stay framework-agnostic where possible.
5. Register global styles and design tokens via `src/styles.scss` and `src/design-tokens`.
6. Keep README + prompt files updated when the project layout evolves or new conventions are adopted.

