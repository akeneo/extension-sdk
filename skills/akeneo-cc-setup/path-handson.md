# Hands-on path

The user wants to understand and own the code. Explain every significant decision before acting. Use technical language where it adds clarity. The user should come out of this session able to iterate on the project independently.

`reference.md` is already loaded — SKILL.md pre-loaded it alongside this file.

---

## IMPORTANT — credential value rule

When writing or reading `extension_configuration.json`, always leave credential `value` fields as placeholders — never write actual token or password values into the file. Tell the user to fill them in directly:

> "I've left the credential values as placeholders in `extension_configuration.json`. Please fill them in directly — I won't write or read actual credential values to keep them out of this conversation."

If the user asks you to write a credential value into the file, decline and redirect them to edit it manually.

---

# Phase 1 — Hello World

## Before starting

First, ask the user where the component should appear. Use §7 from reference.md and display the UI label and location columns — do not truncate it:

> "Where should your component appear in the PIM?"

Wait for their answer, then confirm the plan and ask for a go-ahead:

> "I am going to scaffold a **[name]** component at **[chosen position]**, walk you through each file, build it, and upload it so you can see it live. Once it is working we will add the real functionality together. Ready?"

Wait for confirmation.

---

## Step 1 — Create the project

Create all project files first, then walk through each one with the user — explanation and validation together, file by file.

For each file: write it, then present the explanation and ask if the user wants to change anything before moving on.

---

**`extension_configuration.json`**

Write the file using the schema in `reference.md §8.1`, substituting session values. Then explain and validate:

> "This is the extension manifest the PIM reads when loading your component. A few things worth knowing:
> - `name` is the technical identifier used by the PIM API — snake_case, must be unique in your instance.
> - `type` is always `sdk_script`, which is the internal name for Custom Components.
> - `file` points to the compiled output. Only that single file gets uploaded — nothing else from the project.
> - `default_label` is what appears in the PIM UI; we're using the component name as a starting point, you can change it anytime.
> - Optional fields (`labels` for per-locale names, `custom_variables` for runtime config, `credentials` for external API keys) are documented in `reference.md §8.1` — add them when needed.
>
> Does this look right, or would you like to adjust anything?"

---

**`.gitignore`**

Write this file before anything else:

```
node_modules/
dist/
.env
```

Mention that it was created — no further explanation needed.

---

**`package.json`**

Write the file using §8.2, with the component name set. Then explain and validate:

> "Standard Node project config. A couple of things to note:
> - `\"type\": \"module\"` makes all `.js` files use ESM syntax by default — this is a natural fit since we're producing an ESM bundle.
> - The devDependencies (Vite, TypeScript, React types) are build tools only; none of them end up in the uploaded file.
> - We're starting with React 17 and no UI library — you can add more dependencies later, just keep an eye on the final bundle size (the PIM has a 10 MB limit).
>
> Anything you'd like to change?"

---

**`tsconfig.json`**, **`tsconfig.app.json`**, and **`tsconfig.node.json`**

Write all three files using §8.4, using the extended `tsconfig.json` variant (the one that also references `tsconfig.node.json`). Then explain and validate:

> "Three config files because `tsc -b` uses project references. `tsconfig.app.json` covers everything in `src/`. `tsconfig.node.json` covers `vite.config.ts` — it type-checks the build configuration so misconfigurations are caught at `tsc` time rather than silently failing at build time. The important setting in both is `noEmit: true` — TypeScript only type-checks, Vite handles the actual bundling.
>
> Any changes, or shall we move on?"

---

**`vite.config.ts`**

Write the file using §8.3, replacing `my-extension` in `entryFileNames` with the component name. Then explain and validate:

> "The build config. Here's what the key settings do:
> - `rollupOptions` with `format: 'es'` and `entryFileNames` — produces a single named `.js` file in `dist/`. The filename must match what you declared in `extension_configuration.json`.
> - `target: 'es2020'` — a reasonable baseline for modern browsers; you can raise it if you know your users are on recent browsers, or lower it for broader compatibility.
> - `define: { 'process.env.NODE_ENV' }` — React uses this internally; the PIM's SES sandbox doesn't have `process`, so it must be replaced with a hardcoded string at build time or the component crashes on load.
> - `commonjsOptions.strictRequires: 'auto'` — significantly reduces bundle size by tree-shaking CommonJS modules more aggressively. We'd recommend keeping this unless you hit a specific compatibility issue.
> - Terser with 3 compression passes — good compression with reasonable build times. You can reduce the passes if builds feel slow.
>
> Any changes?"

---

**`src/main.tsx`**

Write `src/index.css` using §8.5, then write `src/main.tsx` using §8.6. Then explain and validate:

> "The entry point. The PIM injects a `<div id=\"root\">` into the page and your component mounts into it. The `if (!document.getElementById('root'))` guard just creates that div when running locally via `npm run dev`, where the PIM isn't there to inject it.
>
> This file rarely needs changing. Ready to move on?"

---

**`src/global.d.ts`**

Download the official SDK type definitions:

```bash
curl -o src/global.d.ts https://raw.githubusercontent.com/akeneo/extension-sdk/main/examples/common/global.d.ts
```

Then explain:

> "This file contains TypeScript types for the entire PIM SDK — `globalThis.PIM`, all context shapes, and all API parameters and responses. It lives in `src/` so TypeScript picks it up automatically. This means you get autocompletion and type errors when working with the SDK instead of having to cast everything to `any`.
>
> You should re-download it if the SDK adds new APIs."

---

**`src/App.tsx`**

Write the hello world using `reference.md §8.7`. Then explain and validate:

> "A minimal starting point — it reads your name from the PIM SDK (typed via the `global.d.ts` we just downloaded) and displays it. We'll replace this with the real implementation in Phase 2. What would you like the component to do?"

---

## Step 2 — Install and build

Run both commands directly inside the project folder:

```bash
npm install
npm run build
```

Once they complete, explain the output:

> "`tsc -b` ran a TypeScript type check first — if that passed, Vite bundled everything into `dist/[name].js`. That single minified file is the only thing that gets uploaded to the PIM; nothing else from the project is deployed."

If either command fails, show the error output and diagnose it together before continuing.

---

## Step 3 — Upload (first time)

The upload sub-flow is already in context — follow it now.

---

## Step 4 — Confirm it is live

Ask the user to navigate to the position in their PIM and confirm the hello world appears. Do not move to Phase 2 until they confirm.

---

# Phase 2 — Enhance

## Step 5 — Explain the SDK for their position

Before writing any logic, explain what the component can read and do at the chosen position. Use §3.2 and §4 from reference.md. For example:

- **Product/product model page:** `PIM.context.product.uuid` and `.identifier` — the product currently open. `PIM.api.product_uuid_v1.get(uuid)` to fetch full product data.
- **Product grid action bar:** `PIM.context.productGrid.productUuids` — UUIDs of selected products. Useful for bulk actions.
- **Category page:** `PIM.context.category.code` — the category being edited.
- **All positions:** `PIM.context.user.catalog_locale` and `.catalog_scope` — the user's active locale and channel.

Also cover the constraints from §2:
- No direct `fetch()` — use `PIM.api.external.call()` for external HTTP.
- No `process.env` — use `import.meta.env` for build-time config.
- All PIM API calls respect the logged-in user's API permissions.

---

## Step 6 — Ask what to build (or use captured intent)

**If `[USER_INTENT]` is set**, do not ask — open with:

> "Now that the SDK is clear, let's implement what you described: [USER_INTENT]. Here's my approach: [brief explanation of the relevant API calls and logic]. Does that match what you had in mind, or would you like to adjust anything?"

Wait for confirmation, then build it together.

**If `[USER_INTENT]` is not set**, ask:

> "Now that you can see how the SDK works — what should this component actually do?"

Discuss the approach with the user before implementing. Explain the relevant API calls you will use. If the feature is non-trivial, propose splitting the implementation across files (e.g. `src/api.ts` for PIM API calls, `src/components/` for sub-components, `src/App.tsx` as the thin root) — this keeps each file focused and lets the user navigate the code independently. Then build it together.

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
