# Zoneless Change Detection Prompt

1. Enable zoneless mode via `provideExperimentalZonelessChangeDetection()` at the application root.
2. Prefer Angular Signals (`signal`, `computed`, `effect`) for all reactive state; avoid relying on Zone.js microtask patches.
3. Wrap asynchronous logic (timeouts, observables, event streams) in `effect()` or `toSignal()` to keep change detection deterministic.
4. Use `DestroyRef`/`takeUntilDestroyed` for RxJS subscriptions instead of `ngOnDestroy`.
5. Ensure third-party libraries trigger manual updates (e.g., emit signals) since automatic zone patches are disabled.
6. Document any zones-only API usage and refactor or shim before enabling zoneless mode in production.

