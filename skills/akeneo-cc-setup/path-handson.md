# Hands-on path

The user wants to understand and own the code. Explain every significant decision before acting. Use technical language where it adds clarity. The user should come out of this session able to iterate on the project independently.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

# Phase 1 — Hello World

## Before starting

First, ask the user where the component should appear. Show this list in full — do not truncate it:

> "Where should your component appear in the PIM?"
>
> | Position | Where it appears |
> |---|---|
> | Product Header | Product edit page — header |
> | Product Panel | Product edit page — right sidebar |
> | Product Tab | Product edit page — tab |
> | Product Model Header | Product model edit page — header |
> | Product Model Panel | Product model edit page — right sidebar |
> | Product Model Tab | Product model edit page — tab |
> | Sub-Product Model Header | Sub product model edit page — header |
> | Sub-Product Model Panel | Sub product model edit page — right sidebar |
> | Sub-Product Model Tab | Sub product model edit page — tab |
> | Category Tab | Category edit page — tab |
> | Reference Entity Record Tab | Reference entity record edit page — tab |
> | Product Grid Action Bar | Product list page — bulk action bar |
> | Activity Navigation Tab | Activity navigation — tab |
> | Performance Analytics Tab | Performance analytics — tab |

Wait for their answer, then confirm the plan and ask for a go-ahead:

> "I am going to scaffold a **[name]** component at **[chosen position]**, walk you through each file, build it, and upload it so you can see it live. Once it is working we will add the real functionality together. Ready?"

Wait for confirmation.

---

## Step 1 — Create the project

Create all project files first, then walk through each one with the user — explanation and validation together, file by file.

For each file: write it, then present the explanation and ask if the user wants to change anything before moving on.

---

**`extension_configuration.json`**

Write the file (values from the session):

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

Then explain and validate:

> "This is the extension manifest the PIM reads when loading your component. A few things worth knowing:
> - `name` is the technical identifier used by the PIM API — snake_case, must be unique in your instance.
> - `type` is always `sdk_script`, which is the internal name for Custom Components.
> - `file` points to the compiled output. Only that single file gets uploaded — nothing else from the project.
> - `default_label` is what appears in the PIM UI; we're using the component name as a starting point, you can change it anytime.
>
> Does this look right, or would you like to adjust anything?"

---

**`package.json`**

Write the file from `reference.md §8.2`, with the component name set. Then explain and validate:

> "Standard Node project config. A couple of things to note:
> - `\"type\": \"module\"` makes all `.js` files use ESM syntax by default — this is a natural fit since we're producing an ESM bundle.
> - The devDependencies (Vite, TypeScript, React types) are build tools only; none of them end up in the uploaded file.
> - We're starting with React 17 and no UI library — you can add more dependencies later, just keep an eye on the final bundle size (the PIM has a 10 MB limit).
>
> Anything you'd like to change?"

---

**`tsconfig.json`** and **`tsconfig.app.json`**

Write both files from `reference.md §8.4`. Then explain and validate:

> "Two config files because `tsc -b` (the TypeScript build command) uses project references. The important setting in `tsconfig.app.json` is `noEmit: true` — TypeScript only type-checks the code, it doesn't produce output. Vite handles the actual bundling. Feel free to tighten or relax the compiler options to match your team's conventions.
>
> Any changes, or shall we move on?"

---

**`vite.config.ts`**

Write the file from `reference.md §8.3`, replacing `my-extension` in `entryFileNames` with the component name. Then explain and validate:

> "The build config. Here's what the key settings do:
> - `rollupOptions` with `format: 'es'` and `entryFileNames` — produces a single named `.js` file in `dist/`. The filename must match what you declared in `extension_configuration.json`.
> - `target: 'es2020'` — a reasonable baseline for modern browsers; you can raise it if you know your users are on recent browsers, or lower it for broader compatibility.
> - `define: { 'process.env.NODE_ENV' }` — replaces that reference at build time so it doesn't cause an error in the PIM's sandboxed runtime.
> - `commonjsOptions.strictRequires: 'auto'` — significantly reduces bundle size by tree-shaking CommonJS modules more aggressively. We'd recommend keeping this unless you hit a specific compatibility issue.
> - Terser with 3 compression passes — good compression with reasonable build times. You can reduce the passes if builds feel slow.
>
> Any changes?"

---

**`src/main.tsx`**

Write the file from `reference.md §8.5`. Then explain and validate:

> "The entry point. The PIM injects a `<div id=\"root\">` into the page and your component mounts into it. The `if (!document.getElementById('root'))` guard just creates that div when running locally via `npm run dev`, where the PIM isn't there to inject it.
>
> This file rarely needs changing. Ready to move on?"

---

**`src/App.tsx`**

Write the hello world:

```tsx
function App() {
  const user = (globalThis as any).PIM?.user;

  return (
    <div style={{ padding: '16px' }}>
      {user && <p>Hello, {user.first_name}!</p>}
    </div>
  );
}

export default App;
```

Then explain and validate:

> "A minimal starting point. `globalThis.PIM` is the SDK object the PIM runtime injects — we use optional chaining (`?.`) so the component doesn't crash when running locally where PIM isn't present. We'll replace this with the real logic in Phase 2.
>
> Good to go?"

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
