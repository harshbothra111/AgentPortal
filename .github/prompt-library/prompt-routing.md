# Angular Routing Prompt

1. Maintain all routes in standalone route definitions (`app.routes.ts` or `<feature>.routes.ts`) using lazy `loadComponent`/`loadChildren`.
2. Prefer feature-based route slices under `src/app/features/<feature>` with colocated guards, resolvers, and data providers.
3. Keep route titles, breadcrumbs, and analytics metadata in the `data` property to centralize navigation semantics.
4. Expose child routers for multi-step flows (e.g., FNOL) so steps can be bookmarked and tested individually.
5. After updating routes, verify SSR navigation (`npm run serve:ssr`) and client hydration to catch mismatches.
6. Update this prompt whenever routing conventions change (e.g., new lazy loading strategy or auth requirements).

