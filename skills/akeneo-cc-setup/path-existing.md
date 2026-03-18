# Existing project path

The user already has a Custom Component project. This path does not scaffold anything — it reads what exists, surfaces any gaps or deviations from the expected structure, and routes to the appropriate upload sub-flow.

`reference.md` is already loaded — SKILL.md pre-loaded it alongside this file.

---

## IMPORTANT — discovery rule

Read existing project files to gather information. Do not ask the user for values you can find by reading. Only ask for what is genuinely missing.

## IMPORTANT — credential value rule

When reading `extension_configuration.json`, use only the structural fields (`name`, `position`, `file`, `configuration.*`, and credential `code` fields). If credential `value` fields are present in the file (actual tokens, passwords, API keys), do not read, display, or reference them — treat them as opaque. If the user asks about a credential value, respond with:

> "I won't read credential values from `extension_configuration.json` — they would be exposed in this conversation. If you need to update a credential value, edit the file directly."

---

## Step 1 — Locate the project

Ask the user for the path to their project root if not already known:

> "What is the path to your project? (e.g. `~/projects/my-component`)"

Then read the following files if they exist. Do not error if they are missing — note what is absent and handle it in Step 2.

- `extension_configuration.json`
- `package.json`
- `vite.config.ts` (or `vite.config.js`)
- `Makefile`
- `.gitignore`

---

## Step 2 — Extract key values

From the files read in Step 1, extract the following. For each value, note its source (which file it came from) or mark it as missing:

| Value | Where to find it |
|---|---|
| Component `name` | `extension_configuration.json → name` |
| `position` | `extension_configuration.json → position` |
| `default_label` | `extension_configuration.json → configuration.default_label` |
| Compiled output path | `extension_configuration.json → file` (e.g. `dist/my-component.js`) |
| Build command | `package.json → scripts.build` |
| Vite output path | `vite.config.ts → build.rollupOptions.output.entryFileNames` or `lib.fileName` |

---

## Step 3 — Surface deviations and gaps

### Missing `extension_configuration.json`

If the file does not exist, ask:

> "I couldn't find `extension_configuration.json` in your project. This file holds the extension name, position, and output path used during upload. Do you have an equivalent config file, or would you like me to create one from your existing setup?"

If the user wants it created, ask for `name`, `position` (show the full table from `reference.md §7`), and `default_label`, then write the file using the schema from `reference.md §8.1`.

### Output path mismatch

If the path in `extension_configuration.json → file` does not match the path in `vite.config.ts`, warn the user:

> "There is a mismatch between the output path declared in `extension_configuration.json` (`[config path]`) and the path Vite actually produces (`[vite path]`). The upload will fail or target the wrong file. Which one is correct?"

Wait for their answer and update the wrong file before continuing.

### Missing `.gitignore` or `.env` not excluded

If `.gitignore` does not exist, or exists but does not contain `.env`, warn:

> "`.env` is not in your `.gitignore`. If you use the API upload path, `.env` will contain credentials — make sure it is excluded from version control before continuing."

Do not block progress on this, but do not move on silently either.

### Missing `Makefile`

Note internally if the Makefile is absent — this affects the API upload path (Step 5).

---

## Step 4 — Check the build

Check whether the compiled output file exists at the path identified in Step 2.

**If the file does not exist:**

> "I don't see a compiled file at `[output path]`. Running the build now."

Run the build command from `package.json`. If it is not a standard `npm run build`, ask the user:

> "What command do you use to build the project?"

**If the file exists**, check whether source files in `src/` have been modified more recently than the compiled output:

```bash
find src/ -newer [output path] -name "*.ts" -o -name "*.tsx" | head -1
```

If any source file is newer, warn:

> "Your source files have changed since the last build. Rebuilding now to make sure the upload reflects your latest code."

Run the build command.

**If the build fails:** diagnose the error using `reference.md §9` for known SES-related errors. Fix the issue before continuing.

---

## Step 5 — Ask the upload method

> "The component is built and ready. How would you like to upload it — via the PIM admin UI (no credentials needed) or automatically via the API (requires a PIM Connection or App token)?"

Then read and follow the appropriate sub-flow:

| Answer | Action |
|---|---|
| UI upload | Read `${CLAUDE_SKILL_DIR}/upload-ui.md` and follow it. Use the `name`, `position`, `default_label`, and output path discovered in Step 2. |
| curl + API | Read `${CLAUDE_SKILL_DIR}/upload-api.md` and follow it. Use the discovered values when writing the Makefile target. If no Makefile exists, create one with only the `upload` target. |

---

Hand back to `SKILL.md` for the session wrap-up.
