# Hands-off path

The user wants the agent to handle everything. Build autonomously. Explain outcomes, not decisions. Confirm once before starting — not before every action.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md`. Read from there when you need specifics.

---

## Before starting

Show the user a one-line summary of what you are about to do and ask for a single confirmation:

> "I am going to scaffold a Custom Component named **[name]**, configure it to appear at **[plain-language position]**, build it, and hand off to the upload step. Ready to start?"

Wait for confirmation. Then proceed without checking in again until the build is done.

---

## Step 1 — Scaffold the project

Clone or copy the quickstart example from the `extension-sdk` repository:

```
https://github.com/akeneo/extension-sdk/tree/main/examples/quickstart
```

Rename the project folder to the component name (snake_case). Then configure `extension_configuration.json` using the values collected during profiling:

- `name` — the technical identifier (snake_case, no spaces)
- `position` — the position identifier from `reference.md §7`; map the user's plain-language choice to the correct identifier
- `configuration.default_label` — the display label the user gave
- `configuration.labels` — add locale-specific labels if the user provided them

Do not explain the file structure. Just do it and move on.

---

## Step 2 — Tell the user what their component will be able to do

Before building, give a plain-language summary of what this component can do once it is live. Tailor it to the position they chose. Examples:

- **Product page positions:** "Your component will be able to read the product currently open — its identifier, the current locale and channel — and display anything you like alongside it. It can also read or update any PIM data your account has permission to access."
- **Activity navigation tab:** "Your component will appear as a tab in the main navigation. It can read your user info and access any PIM data your account allows, but it will not have a specific product or category in context."
- **Product grid action bar:** "Your component will appear when products are selected in the list. It can read the UUIDs of the selected products and act on them in bulk."

Keep it to two or three sentences. No API names, no code.

---

## Step 3 — Remind the user of the simple rules

Before building, state the constraints plainly:

- "The compiled file must be under 10 MB."
- "The component can only call external services through the PIM — it cannot make direct internet requests on its own."
- "What it can read and write depends on the permissions of the person who is logged in."

---

## Step 4 — Build

Run the build command:

```bash
make build
```

If the `Makefile` is not available (from-scratch project), run:

```bash
npm run build
```

If the build succeeds, tell the user:

> "Build complete. The compiled file is at `dist/[name].js`."

If the build fails, show the error and diagnose it before continuing. Do not proceed to the upload step with a failed build.

---

## Step 5 — Hand off to the upload sub-flow

Read and follow the upload sub-flow the user chose during profiling:

- UI upload → `${CLAUDE_SKILL_DIR}/upload-ui.md`
- curl + API → `${CLAUDE_SKILL_DIR}/upload-api.md`
