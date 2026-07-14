
---
name: akeneo-cc-setup
description: Guides a user through building and deploying an Akeneo Custom Component from scratch. Invoked manually via /akeneo-cc-setup.
user-invokable: true
context: fork
allowed-tools: Read, Write, Edit, Bash
---

You are guiding a user through building and deploying an Akeneo Custom Component. Follow these steps exactly.

**Note on `${CLAUDE_SKILL_DIR}`:** all file paths in this skill and its sub-files (path-handsoff.md, path-handson.md, path-existing.md, upload-ui.md, upload-api.md, reference.md) resolve relative to the `akeneo-cc-setup/` directory — the directory containing this file. Not the directory of any skill that delegated to this one.

---

## Step 1 — Introduce yourself and ask the starting question

**If `[USER_INTENT]` is set**, open with:

> "I'll help you build that. We'll start by bootstrapping a working Custom Component — once it's live in your PIM, I'll implement [USER_INTENT] directly. First — are you starting from scratch, or do you already have an existing project?"

**If `[USER_INTENT]` is not set**, open with:

> "I'll guide you through building and deploying a Custom Component in Akeneo. First — are you starting from scratch, or do you already have an existing project you want to upload or iterate on?"

---

## Step 2 — Route to the right path

### Existing project

If the user already has a project, ask one question:

> "How would you like to upload — via the PIM admin UI (no credentials needed) or automatically via the API (requires a PIM Connection or App token)?"

Wait for the answer, then read the following files **simultaneously in a single parallel batch**:

- `${CLAUDE_SKILL_DIR}/path-existing.md`
- `${CLAUDE_SKILL_DIR}/reference.md`
- The upload sub-flow for their answer:

| Answer | File |
|---|---|
| UI upload | `${CLAUDE_SKILL_DIR}/upload-ui.md` |
| curl + API | `${CLAUDE_SKILL_DIR}/upload-api.md` |

Then follow `path-existing.md` in full. The upload sub-flow is already in context — `path-existing.md` will not ask you to read it again.

### New project

If the user is starting from scratch, check which of the following are already known from `[COMPONENT_NAME]`, `[INVOLVEMENT]`, and `[UPLOAD_METHOD]` set by the awareness skill. Ask only the missing ones in a single message:

> "A few quick questions to get started:
>
> 1. **Name** — What would you like to call your component? _(skip if `[COMPONENT_NAME]` is set)_
> 2. **Involvement** — Should I handle everything and just explain what I did, or walk you through each step so you can maintain the code yourself? _(skip if `[INVOLVEMENT]` is set)_
> 3. **Upload method** — Once it's built, do you want to upload via the PIM admin UI (no credentials needed) or automatically via the API (requires a PIM Connection or App token)? _(skip if `[UPLOAD_METHOD]` is set)_"

If all three are already known, skip the question entirely and proceed directly to loading files.

Wait for the user's reply if needed. Answers may come in one message or across a few — collect all before proceeding. If any answer is missing or unclear, ask only about the missing ones.

Once all three answers are collected, read the following files **simultaneously in a single parallel batch** — do not read them sequentially:

- The path file for Question 2:

| Answer | File |
|---|---|
| Hands-off — agent handles everything | `${CLAUDE_SKILL_DIR}/path-handsoff.md` |
| Hands-on — user wants to own the code | `${CLAUDE_SKILL_DIR}/path-handson.md` |

- The upload sub-flow for Question 3:

| Answer | File |
|---|---|
| UI upload | `${CLAUDE_SKILL_DIR}/upload-ui.md` |
| curl + API | `${CLAUDE_SKILL_DIR}/upload-api.md` |

- `${CLAUDE_SKILL_DIR}/reference.md`

If the answer to Question 2 is ambiguous, default to hands-off and mention you can switch if they want more detail.

With all three files loaded, follow the path file in full. `reference.md` is already in context — the path file will not ask you to read it again.

Carry the component name from Question 1 throughout the entire session. If the user did not have a name, help them pick one before starting the path (snake_case, no spaces, unique in their PIM).

---

## Step 3 — Wrap up

Close the session with:

1. **Summary** — one or two sentences: what was built and where it now appears in the PIM.
2. **Relevant doc links** — pick from the list below based on what came up during the session.
3. **Next steps** — what the user should do next (iterate on the UI, add credentials for external services, set up a CI/CD deploy, etc.).

Doc links to draw from:
- Overview: https://api.akeneo.com/advanced-extensions/overview.html
- SDK in depth: https://api.akeneo.com/advanced-extensions/sdk-in-depth.html
- Development workflow: https://api.akeneo.com/advanced-extensions/development-workflow.html
- API deployment: https://api.akeneo.com/advanced-extensions/api-deployment.html
- UI deployment: https://api.akeneo.com/advanced-extensions/ui-deployment.html
- Credentials: https://api.akeneo.com/advanced-extensions/sdk-credentials.html
- Available positions: https://api.akeneo.com/extensions/positions.html
- FAQ & Troubleshooting: https://api.akeneo.com/advanced-extensions/faq.html
- Extension SDK repo: https://github.com/akeneo/extension-sdk
