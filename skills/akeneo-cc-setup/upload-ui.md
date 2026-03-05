# Upload sub-flow — Akeneo UI

No API credentials required. Any PIM user with System access can complete this flow.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md §10.1`.

---

## Steps

Walk the user through the following sequence. Be explicit at every step — assume no prior knowledge of the PIM admin UI.

1. Log into your Akeneo PIM instance.
2. In the left-hand menu, click **System**, then click **Extensions**.
3. Click the **Create** button in the top-right corner.
4. Fill in the fields:
   - **Name** — enter: `[technical name from session]`
   - **Labels** — enter: `[display label from session]` (add additional locale labels if collected)
   - **Type** — select **SDK Script** from the dropdown
   - **Position** — enter: `[position identifier from session]`
5. Click the file upload area and select `dist/[name].js` from your project folder.
6. Click **Save**.

After saving, tell the user:

> "Your component is now live. Navigate to [plain-language description of the position] in your PIM — the component should appear there. If you do not see it, refresh the page."

---

## Updating the component later

When the user rebuilds and wants to push a new version:

1. Go to **System → Extensions**.
2. Find the extension named `[name]` and click it.
3. Click the file upload area and select the new `dist/[name].js`.
4. Click **Save**.

---

Hand back to `SKILL.md` for the session wrap-up.
