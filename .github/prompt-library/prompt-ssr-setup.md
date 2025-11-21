# SSR Setup Prompt

1. Use `provideExperimentalZonelessChangeDetection()` together with `provideClientHydration()` in `src/app/app.config.ts`.
2. Merge the browser config with `provideServerRendering()` in `src/app/app.config.server.ts` and bootstrap via `src/main.server.ts`.
3. Build bundles with `npm run build:ssr` (`ng build` + `ng run pnc-ui-accelerator:server`).
4. Launch the Express host using `npm run serve:ssr` after building.
5. Verify server output hydrates on the client and that Signal-driven UI updates work without Zone.js.
6. Keep this prompt updated if the SSR workflow changes.

