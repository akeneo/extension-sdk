# Upload sub-flow — Akeneo UI

No API credentials required. Any PIM user with System access can complete this flow.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md §11.1`.

---

## Steps

Walk the user through the following sequence. Be explicit at every step — assume no prior knowledge of the PIM admin UI.

1. Log into your Akeneo PIM instance.
2. In the left-hand menu, click **System**, then click **Extensions**.
3. Click the **Create** button in the top-right corner.
4. Choose the extension type: **Custom Component**.
5. Fill in the fields:
   - **Name** — enter: `[technical name from session]`
   - **Labels** — enter: `[component name from session]`
   - **Position** — the dropdown shows UI labels, not technical identifiers. Look up the UI label for the chosen position in `reference.md §7` and tell the user exactly which option to select (e.g. for `pim.product.panel`, select **Product Panel**).
6. Click the file upload area and select `dist/[name].js` from your project folder.
7. Click **Save**.

After saving, tell the user:

> "Your component is now live. Navigate to [plain-language description of the position] in your PIM. You may need to refresh the page for it to appear."

---

## Updating the component later

When the user rebuilds and wants to push a new version:

1. Go to **System → Extensions**.
2. Find the extension named `[name]` and click it.
3. Click the file upload area and select the new `dist/[name].js`.
4. Click **Save**.

---

Hand back to `SKILL.md` for the session wrap-up.
