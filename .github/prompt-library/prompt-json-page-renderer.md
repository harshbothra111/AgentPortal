# JSON Page Renderer Prompt

1. Declare page entries in `src/assets/json-pages/page-config.json` (id, display name, model file) so the renderer can resolve layouts dynamically.
2. Author each page model in its own JSON file (`nodes` array) using layout primitives (`row`, `column`, `section`, `stack`, `card`) and reference shared components by `type`.
3. Keep component bindings explicit: use `bindings.formControl` for form fields, `validators` for rules, and `actions` for interactive elements like buttons.
4. Prefer existing common components (`textField`, `textArea`, `dropdown`, `radio`, `button`, etc.) and supplement with renderer-specific primitives (`heading`, `text`, `link`) when static content is needed.
5. The `PageRendererService` caches the manifest and page configs—call `clearCache()` when iterating on JSON so changes hot-reload.
6. Layout `span` metadata (1-12) controls responsive widths; fall back to flex column layouts on small screens.
7. Update this prompt whenever new component types, layout helpers, or manifest fields are introduced.

