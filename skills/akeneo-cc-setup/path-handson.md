# Hands-on path

The user wants to understand and own the code. Explain every significant decision before acting. Use technical language where it adds clarity. The user should come out of this session able to iterate on the project independently.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

## Step 1 — Scaffold the project

Start from the quickstart example in the `extension-sdk` repository:

```
https://github.com/akeneo/extension-sdk/tree/main/examples/quickstart
```

Clone or copy it, rename the folder to the component name (snake_case), then walk through the structure with the user:

> "This project uses React and Vite. The entry point is `src/main.tsx` — it mounts the React app into a `<div id="root">` that the PIM injects into the page. Your main work will be in `src/App.tsx`. The compiled output goes to `dist/[name].js` — that single file is what gets uploaded to Akeneo."

Walk through `extension_configuration.json` field by field as you fill it in:

- `name` — technical identifier, snake_case, unique across your PIM instance
- `type` — always `sdk_script` (shown as "Custom Component" in the UI)
- `position` — where the component renders; read options from `reference.md §7` and explain which identifier matches the user's choice
- `file` — path to the compiled output; must match exactly what the build produces
- `configuration.default_label` — the label shown in the PIM interface
- `credentials` — for calling external services; leave empty for now unless already needed

---

## Step 2 — Explain the SDK

Explain how the component communicates with Akeneo before writing any logic:

> "The PIM injects a global object into your component at runtime. You access it via `globalThis.PIM`. It has five parts:
>
> - `PIM.user` — the logged-in user (name, UUID, permission groups)
> - `PIM.context` — where the component is placed and what it is currently looking at
> - `PIM.api` — async methods to read and write PIM data
> - `PIM.navigate` — navigate within the PIM or open external URLs
> - `PIM.custom_variables` — configuration values set at upload time, without rebuilding"

Then explain the context available at the position the user chose. Read the exact payload from `reference.md §3.2`. For example:

- Product or product model page: `PIM.context.product.uuid`, `PIM.context.product.identifier`
- Category page: `PIM.context.category.code`
- Product grid: `PIM.context.productGrid.productUuids`, `PIM.context.productGrid.productModelCodes`
- All positions: `PIM.context.user.catalog_locale`, `PIM.context.user.catalog_scope`

Show a minimal `App.tsx` starter that reads the relevant context:

```typescript
function App() {
  const context = globalThis.PIM.context;

  return <div>Your component here</div>;
}

export default App;
```

Point them to `reference.md §4` for the full API list when they want to fetch or write PIM data.

---

## Step 3 — Explain the constraints

State the hard technical limits and what they mean in practice:

- **10 MB bundle size limit** — the compiled JS file cannot exceed this. The Vite config in the quickstart uses Terser with 3 compression passes specifically to keep bundles small. Avoid heavy dependencies.
- **SES sandbox** — the component runs in a Secure ECMAScript sandbox. No direct `fetch()` or `XMLHttpRequest` (use `PIM.api.external.call()` instead). No `process.env` (use `import.meta.env` for build-time variables). No `eval()` or dynamic `new Function()`.
- **User permissions** — all `PIM.api.*` calls inherit the Web API permissions of the logged-in user. The component cannot exceed what that user is allowed to do in the PIM.
- **HTTPS only** — `PIM.navigate.external()` only accepts HTTPS URLs.

---

## Step 4 — Build

Run the build:

```bash
make build
```

If the `Makefile` is not available (from-scratch project):

```bash
npm run build
```

Explain what happens: `tsc -b` compiles TypeScript, then Vite bundles everything into a single minified ESM file at `dist/[name].js`. That file — and only that file — is what gets uploaded to Akeneo. Nothing else from the project is deployed.

If the build fails, diagnose the error before continuing. Do not proceed to the upload step with a broken build.

---

## Step 5 — Hand off to the upload sub-flow

Read and follow the upload sub-flow the user chose during profiling:

- UI upload → `${CLAUDE_SKILL_DIR}/upload-ui.md`
- curl + API → `${CLAUDE_SKILL_DIR}/upload-api.md`
