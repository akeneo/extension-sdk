# Hands-off path

The user wants the agent to handle everything. Build autonomously. Explain outcomes, not decisions. Confirm once before each phase — not before every action.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

# Phase 1 — Hello World

## Before starting

Confirm the full plan and ask for a single go-ahead:

> "I am going to scaffold a **[name]** component at **[plain-language position]**, build it, and upload it so you can see it live in your PIM. Once it is working, we will add the actual functionality. Ready?"

Wait for confirmation. Then proceed without checking in again until the component is live.

---

## Step 1 — Create the project

Create a new directory named after the component (snake_case). Inside it, create the following files exactly.

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

**`package.json`** — from `reference.md §8.2`:

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

**`src/main.tsx`** — from `reference.md §8.5`.

**`src/App.tsx`** — a minimal hello world that reads the logged-in user:

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

Run:

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

## Step 5 — Ask what to build

Ask a single question:

> "The hello world is live. What should this component actually do?"

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
