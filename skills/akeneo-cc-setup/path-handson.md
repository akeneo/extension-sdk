# Hands-on path

The user wants to understand and own the code. Explain every significant decision before acting. Use technical language where it adds clarity. The user should come out of this session able to iterate on the project independently.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

# Phase 1 — Hello World

## Before starting

Confirm the plan and ask for a go-ahead:

> "I am going to scaffold a **[name]** component at **[plain-language position]**, walk you through each file, build it, and upload it so you can see it live. Once it is working we will add the real functionality together. Ready?"

Wait for confirmation.

---

## Step 1 — Create the project

Create the project folder and files from scratch — explain each one as you create it.

**`extension_configuration.json`** — the extension manifest. Walk through each field:

- `name` — the technical identifier used by the PIM API. Must be snake_case, unique across your PIM.
- `type` — always `sdk_script` (the internal name for Custom Components).
- `position` — where the component renders; maps to the identifier you chose.
- `file` — path to the compiled output. This single file is everything the PIM loads.
- `configuration.default_label` — what users see in the PIM UI. Using the component name as a default; you can change it later.

```json
{
  "name": "[name]",
  "type": "sdk_script",
  "position": "[position identifier]",
  "file": "dist/[name].js",
  "configuration": {
    "default_label": "[name]"
  }
}
```

**`package.json`** — from `reference.md §8.2`. Explain: `"type": "module"` enables ESM imports; devDependencies are build tools only, nothing ships to the PIM.

**`tsconfig.json`** and **`tsconfig.app.json`** — from `reference.md §8.4`. Explain: `tsc -b` uses project references; `noEmit: true` means TypeScript only type-checks — Vite does the actual bundling.

**`vite.config.ts`** — from `reference.md §8.3` (standalone version). Replace `my-extension` in `fileName` with the component name. Explain the key settings:

- `lib` mode with `formats: ['es']` — produces a single ESM file, which is what the PIM expects.
- `target: 'es2020'` — matches the PIM runtime.
- `commonjsOptions.strictRequires: 'auto'` — critical; reduces bundle size ~8x by tree-shaking CommonJS modules.
- Terser with 3 compression passes — keeps the compiled file well under the 10 MB limit.

**`src/main.tsx`** — from `reference.md §8.5`. Explain: the PIM injects a `<div id="root">` into the page; this file mounts the React app into it. The `if (!document.getElementById('root'))` guard handles the dev server case.

**`src/App.tsx`** — a minimal hello world. Explain: `globalThis.PIM` is injected by the PIM runtime at load time. We use optional chaining so the component does not crash during local dev where PIM is absent.

```tsx
function App() {
  const user = (globalThis as any).PIM?.user;

  return (
    <div style={{ padding: '16px' }}>
      <h2>[name]</h2>
      {user && <p>Hello, {user.first_name}!</p>}
    </div>
  );
}

export default App;
```

---

## Step 2 — Install and build

```bash
npm install
npm run build
```

Explain: `tsc -b` runs the TypeScript type check first; if it passes, Vite bundles everything into `dist/[name].js`. That single file — minified, no source maps — is what gets uploaded to Akeneo. Nothing else from the project is deployed.

If the build fails, diagnose the error together before continuing.

---

## Step 3 — Upload (first time)

Read and follow the upload sub-flow the user chose during profiling:

- UI upload → `${CLAUDE_SKILL_DIR}/upload-ui.md`
- curl + API → `${CLAUDE_SKILL_DIR}/upload-api.md`

---

## Step 4 — Confirm it is live

Ask the user to navigate to the position in their PIM and confirm the hello world appears. Do not move to Phase 2 until they confirm.

---

# Phase 2 — Enhance

## Step 5 — Explain the SDK for their position

Before writing any logic, explain what the component can read and do at the chosen position. Read the exact context payload from `reference.md §3.2` and the API surface from `reference.md §4`. For example:

- **Product/product model page:** `PIM.context.product.uuid` and `.identifier` — the product currently open. `PIM.api.product_uuid_v1.get(uuid)` to fetch full product data.
- **Product grid action bar:** `PIM.context.productGrid.productUuids` — UUIDs of selected products. Useful for bulk actions.
- **Category page:** `PIM.context.category.code` — the category being edited.
- **All positions:** `PIM.context.user.catalog_locale` and `.catalog_scope` — the user's active locale and channel.

Also cover the constraints from `reference.md §2`:
- No direct `fetch()` — use `PIM.api.external.call()` for external HTTP.
- No `process.env` — use `import.meta.env` for build-time config.
- All API calls inherit the logged-in user's PIM permissions.

---

## Step 6 — Ask what to build

> "Now that you can see how the SDK works — what should this component actually do?"

Discuss the approach with the user before implementing. Explain the relevant API calls you will use. Then build it together.

---

## Step 7 — Rebuild

```bash
npm run build
```

If the build fails, diagnose it together.

---

## Step 8 — Push the update

Follow the "Updating the component later" section of the upload sub-flow the user chose — not the create step.

---

Hand back to `SKILL.md` for the session wrap-up.
