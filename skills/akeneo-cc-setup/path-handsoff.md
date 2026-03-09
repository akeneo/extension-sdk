# Hands-off path

The user wants the agent to handle everything. Build autonomously. Explain outcomes, not decisions. Confirm once before each phase — not before every action.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

# Phase 1 — Hello World

## Before starting

First, ask the user where the component should appear. Read the full position list from `reference.md §7` and display the UI label and location columns — do not truncate it:

> "Where should your component appear in the PIM?"

Wait for their answer, then confirm the full plan and ask for a go-ahead:

> "I am going to scaffold a **[name]** component at **[chosen position]**, build it, and upload it so you can see it live in your PIM. Once it is working, we will add the actual functionality. Ready?"

Wait for confirmation. Then proceed without checking in again until the component is live.

---

## Step 1 — Create the project

Create a new directory named after the component (snake_case). Inside it, create the following files exactly.

**`.gitignore`**:

```
node_modules/
dist/
.env
```

**`extension_configuration.json`** — fill in the real values from the session:

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

Optional fields (`labels`, `custom_variables`, `credentials`) are documented in `reference.md §8.1` — add them when needed.

**`package.json`** — from `reference.md §8.2`. Set `"name"` to the component name:

Use the standalone package.json. Set `"name"` to the component name.

**`tsconfig.json`**:

```json
{
  "references": [{ "path": "./tsconfig.app.json" }],
  "files": []
}
```

**`tsconfig.app.json`** — from `reference.md §8.4`.

**`vite.config.ts`** — from `reference.md §8.3` (standalone version). Replace `my-extension` in `fileName` with the component name.

**`src/index.css`** — from `reference.md §8.5`.

**`src/main.tsx`** — from `reference.md §8.6`.

**`src/global.d.ts`** — download the official SDK type definitions:

```bash
curl -o src/global.d.ts https://raw.githubusercontent.com/akeneo/extension-sdk/main/examples/common/global.d.ts
```

**`src/App.tsx`** — a minimal hello world that reads the logged-in user:

```tsx
function App() {
  const user = globalThis.PIM?.user;

  return (
    <div style={{ padding: '16px' }}>
      {user && <p>Hello, {user.first_name}!</p>}
    </div>
  );
}

export default App;
```

---

## Step 2 — Install and build

Run both commands directly inside the project folder:

```bash
npm install
npm run build
```

If the build succeeds, tell the user:

> "Build complete. The compiled file is at `dist/[name].js`."

If the build fails, diagnose and fix the error before continuing. Do not proceed with a broken build.

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

## Step 5 — Surface SDK context, then ask what to build

Read `reference.md §3.2` and `§4` for the chosen position. Then briefly tell the user what data is available to them before asking what to build. Keep it non-technical — one short paragraph. For example:

- **Product/product model positions:** "At this position your component knows which product is open (its UUID and identifier). From there it can fetch the full product data, read or update any attribute, fetch the product's family or categories, and so on."
- **Product grid action bar:** "At this position your component receives the list of selected product UUIDs (up to 500). It's designed for bulk actions — triggering a workflow, exporting data, applying a tag to all selected products, etc."
- **Category positions:** "At this position your component knows which category is being edited (its code). It can fetch the category's details or trigger actions scoped to that category."
- **Other positions:** "At this position there is no specific entity in context — your component can still read the logged-in user's details and call any PIM API, but it has no pre-selected product or category to work from."

Then ask:

> "Given what's available — what should this component actually do?"

Wait for their answer before proceeding.

---

## Step 6 — Build it

Implement the requested functionality. Read `reference.md §3` and `§4` for the SDK surface available at the chosen position. Build what the user asked for — no unnecessary explanation.

After implementing, rebuild:

```bash
npm run build
```

If the build fails, fix it before continuing.

---

## Step 7 — Push the update

Follow the "Updating the component later" section of the upload sub-flow the user chose — not the create step.

---

Hand back to `SKILL.md` for the session wrap-up.
