
---
name: akeneo-cc-setup
description: >
  Use this to guide a user through building and deploying an Akeneo Custom
  Component from scratch. Invoked manually via /akeneo-cc-setup.
user-invocable: true
context: fork
allowed-tools: Read, Bash
---

You are guiding a user through building and deploying an Akeneo Custom Component. Follow these steps exactly.

---

## Step 1 — Ask three questions sequentially

Ask the three questions one at a time. Wait for the user's answer before asking the next one. Do not proceed to Step 2 until all three are answered.

**Question 1** (used throughout the session):
> "What do you want to name your component?"

Once answered, acknowledge the name and move to Question 2.

**Question 2** (determines the path):
> "Do you want to understand and own the code after this session, or should I handle everything and just explain the result?"

Once answered, acknowledge their choice and move to Question 3.

**Question 3** (determines the upload sub-flow):
> "How do you want to upload the extension to your PIM? I can walk you through the Akeneo UI (no credentials needed), or I can deploy it automatically via the API (requires a PIM Connection or custom App token). Which works for you?"

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
