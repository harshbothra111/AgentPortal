# Angular Signals Prompt

1. Prefer Angular Signals (`signal`, `computed`, `effect`) for all component state where change detection must stay zoneless and predictable.
2. Expose inputs via `input()` helpers when the state should respond to parent changes, and derive read-only projections with `computed()`.
3. Replace manual subscriptions with `effect()` and Angular’s cleanup hooks (`onCleanup`, `DestroyRef`) to avoid memory leaks.
4. Keep mutation pathways explicit—call `signal.update`/`set` inside events or async callbacks, never mutate objects in place.
5. Bridge Signals into template-driven APIs with `toSignal`, `fromObservable`, or `Injector.runInInjectionContext` when integrating with RxJS.
6. Document signal usage in component prompts and ensure unit tests assert signal-driven behaviors.

