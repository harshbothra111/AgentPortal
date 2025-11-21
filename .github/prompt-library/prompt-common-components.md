# Common Components Prompt

1. Audit `src/common/components` for feature folders missing an Angular component implementation (`*.component.ts` and optional `.scss`).
2. Create standalone components that follow the existing patterns: `ChangeDetectionStrategy.OnPush`, strongly-typed `input()` signals, and ergonomic outputs where appropriate.
3. Provide matching SCSS modules that scope styles to the component’s host element and match the design system tokens.
4. Ensure new components expose consistent selectors prefixed with `pnc-`.
5. Run `npm run lint` or targeted tests after adding components to keep the shared library stable.
6. Update this prompt when new categories of shared UI primitives are introduced.

