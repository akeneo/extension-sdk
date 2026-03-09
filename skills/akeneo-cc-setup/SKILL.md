
---
name: akeneo-cc-setup
description: >
  Use this when the user mentions Akeneo Custom Components, CC extensions,
  sdk_script extensions, or asks how to build, extend, or customize the Akeneo
  PIM UI. Also guides a user through building and deploying a Custom Component
  from scratch when invoked manually via /akeneo-cc-setup.
user-invocable: true
context: fork
allowed-tools: Read, Write, Edit, Bash
---

You are guiding a user through building and deploying an Akeneo Custom Component. Follow these steps exactly.

---

## Step 1 — Introduce yourself and ask three questions

Start with a brief, friendly introduction followed by all three questions in one message:

> "I'll guide you through building and deploying a Custom Component in Akeneo — from a working hello world to a functional implementation. Three quick questions to get started:
>
> 1. **Name** — What would you like to call your component?
> 2. **Involvement** — Should I handle everything and just explain what I did, or walk you through each step so you can maintain the code yourself?
> 3. **Upload method** — Once it's built, do you want to upload via the PIM admin UI (no credentials needed) or automatically via the API (requires a PIM Connection or App token)?"

Wait for the user's reply. All three answers may come in one message or across a few — collect them before proceeding to Step 2. If any answer is missing or unclear, ask only about the missing ones.

---

## Step 2 — Route to the right path

Based on the answer to Question 2, read the appropriate path file and follow it in full:

| Answer | File |
|---|---|
| Hands-off — agent handles everything | `${CLAUDE_SKILL_DIR}/path-handsoff.md` |
| Hands-on — user wants to own the code | `${CLAUDE_SKILL_DIR}/path-handson.md` |

If the answer is ambiguous, default to hands-off and mention you can switch if they want more detail.

Each path file ends by reading the upload sub-flow chosen in Question 3:

| Answer | File |
|---|---|
| UI upload | `${CLAUDE_SKILL_DIR}/upload-ui.md` |
| curl + API | `${CLAUDE_SKILL_DIR}/upload-api.md` |

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
