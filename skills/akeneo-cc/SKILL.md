---
name: akeneo-cc
description: Use this when the user mentions Akeneo Custom Components, CC extensions, sdk_script extensions, or asks how to build, extend, or customize the Akeneo PIM UI.
user-invokable: false
---

The user wants to build an Akeneo Custom Component.

Before reading the setup skill, extract the following from the user's message if present. Carry each through the entire session — do not ask the user to repeat information they already provided.

- **`[USER_INTENT]`** — a specific description of what the component should do (e.g. "display a gallery of asset attributes", "show a compliance score"). Not just a general request to create a CC. Leave unset if absent.
- **`[COMPONENT_NAME]`** — a name for the component (snake_case). Leave unset if absent.
- **`[POSITION]`** — where the component should appear in the PIM (e.g. "product panel", "product tab"). Leave unset if absent.
- **`[INVOLVEMENT]`** — how much involvement the user wants: hands-off (agent handles everything) or hands-on (user wants to own the code). Leave unset if absent.
- **`[UPLOAD_METHOD]`** — how they want to upload: UI or API. Leave unset if absent.

Then read and follow `${CLAUDE_SKILL_DIR}/../akeneo-cc-setup/SKILL.md` now.
