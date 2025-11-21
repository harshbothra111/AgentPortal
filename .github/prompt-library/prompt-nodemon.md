# Nodemon Prompt

1. Install nodemon as a dev dependency so server-side bundles can restart automatically (`npm install --save-dev nodemon`).
2. Add a script such as `serve:ssr:watch` that runs nodemon against the built server bundle, watching the `dist/.../server` directory.
3. Use nodemon only for local development; keep production commands (`serve:ssr`) on plain `node` to avoid extra CPU overhead.
4. Configure the nodemon ignore/watch lists if additional directories (logs, temp files) should not trigger restarts.
5. Document the workflow in the README or prompts so the team knows how to rebuild (`npm run build:ssr`) before `serve:ssr:watch` detects changes.
