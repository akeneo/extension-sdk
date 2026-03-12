---
name: akeneo-cc
description: Use this when the user mentions Akeneo Custom Components, CC extensions, sdk_script extensions, or asks how to build, extend, or customize the Akeneo PIM UI.
user-invokable: false
---

The user wants to build an Akeneo Custom Component.

Before reading the setup skill, check whether the user's message contains a specific implementation intent — not just a general request to create a CC, but a description of what the component should actually do (e.g. "display a gallery of asset attributes", "show a compliance score", "trigger a workflow from the product page").

- If a specific intent is present: retain it as `[USER_INTENT]` and carry it through the entire session. Do not ask the user to repeat it.
- If no specific intent is present: leave `[USER_INTENT]` unset.

Then read and follow `${CLAUDE_SKILL_DIR}/../akeneo-cc-setup/SKILL.md` now.
