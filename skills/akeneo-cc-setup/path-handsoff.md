# Hands-off path

The user wants the agent to handle everything. Build autonomously. Explain outcomes, not decisions. Confirm once before each phase — not before every action.

Read `${CLAUDE_SKILL_DIR}/reference.md` now. You will use it throughout this session — do not read it again.

---

# Phase 1 — Hello World

## Before starting

First, ask the user where the component should appear. Use §7 from reference.md and display the UI label and location columns — do not truncate it:

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

**`package.json`** — use §8.2. Set `"name"` to the component name.

**`tsconfig.json`**, **`tsconfig.app.json`**, **`tsconfig.node.json`** — use §8.4. Use the extended `tsconfig.json` variant (references both `tsconfig.app.json` and `tsconfig.node.json`).

**`vite.config.ts`** — use §8.3. Replace `my-extension` in `entryFileNames` with the component name.

**`src/index.css`** — use §8.5.

**`src/main.tsx`** — use §8.6.

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

## Step 5 — Surface SDK context, then move to implementation

Use §3.2 and §4 from reference.md for the chosen position. Briefly tell the user what data is available at that position — one short non-technical paragraph. For example:

- **Product/product model positions:** "At this position your component knows which product is open (its UUID and identifier). From there it can fetch the full product data, read or update any attribute, fetch the product's family or categories, and so on."
- **Product grid action bar:** "At this position your component receives the list of selected product UUIDs (up to 500). It's designed for bulk actions — triggering a workflow, exporting data, applying a tag to all selected products, etc."
- **Category positions:** "At this position your component knows which category is being edited (its code). It can fetch the category's details or trigger actions scoped to that category."
- **Other positions:** "At this position there is no specific entity in context — your component can still read the logged-in user's details and call any PIM API, but it has no pre-selected product or category to work from."

**If `[USER_INTENT]` is set**, do not ask what to build — go directly to Step 6 and implement it.

**If `[USER_INTENT]` is not set**, ask:

> "Given what's available — what should this component actually do?"

Wait for their answer before proceeding.

---

## Step 6 — Build it

Implement the requested functionality. Use §3 and §4 from reference.md for the SDK surface available at the chosen position. Build what the user asked for — no unnecessary explanation.

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
