## Prompt: Angular Universal SSR Checklist

**Scenario**
Build, test, and deploy SSR for pnc-ui-accelerator using Angular Universal.

**Checklist**
1. Ensure 
g add @nguniversal/express-engine or --ssr scaffold is present.
2. Verify server.ts, main.server.ts, and pp.config.server.ts.
3. Confirm package.json scripts:
   - uild:ssr, serve:ssr, dev:ssr
   - Optional: prerender.
4. Configure environment variables and HTTP interceptors to be SSR-safe (no direct window/document).
5. Update 	sconfig.server.json for strict, remove DOM-only types if necessary.
6. Document deployment target (Node host, Cloud Run, Vercel, etc.) with commands.

**Outputs to Provide**
- Build commands and expected artifacts (dist/pnc-ui-accelerator/browser & server).
- Sample Express server tweaks (compression, caching, error handling).
- Tips for debugging hydration or signals on the server.
- Monitoring/logging recommendations.

**Format**
- Present as steps with optional command snippets.
- Highlight pitfalls (e.g., third-party libs requiring DOM).
- End with verification steps (
pm run build:ssr, 
pm run serve:ssr).
