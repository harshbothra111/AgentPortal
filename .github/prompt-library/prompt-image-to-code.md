# Image-to-Code Prompt

1. Gather design inputs upfront: export the source image (or Figma frame) plus key design tokens (colors, typography, spacing) so the conversion stays faithful.
2. Break the layout into logical sections (header, hero, cards, forms) before coding; outline stacking order and responsive breakpoints.
3. Reuse existing components/design tokens where possible; introduce new primitives only when the UI diverges meaningfully from the shared library.
4. Map visual styles to CSS/SCSS variables first—avoid inlining hex values or ad-hoc spacing so the build keeps using `src/design-tokens`.
5. Scaffold HTML/Angular structure with semantic elements, then layer styling; iterate per section and validate against the image after each step.
6. Document assumptions (missing assets, ambiguous interactions) in the PR/prompt so reviewers know what was inferred versus pixel-perfect.
