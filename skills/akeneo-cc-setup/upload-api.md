# Upload sub-flow — curl + API

Requires a valid PIM API token. The MCP server handles authentication; the agent runs the curl command with the compiled file.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md §10.2` and `§10.3`.

---

## Step 1 — Acquire an API token via MCP

Use the MCP PIM authentication tool to acquire a Bearer token for the user's PIM instance.

Ask the user for what the MCP auth tool needs (typically PIM host, client ID, client secret, username, password — or an App token if they use a custom App). Explain why:

> "To upload via the API I need a token from your PIM. I will use the MCP server to get one — your credentials are handled by the MCP server and are not stored in the project."

Once the token is acquired, proceed. Do not print the token value in the conversation.

**Fallback — if MCP auth is unavailable or fails:**

> "I could not acquire a token automatically. You can get one manually by running:
> ```bash
> make get-token
> ```
> or by following the [Akeneo connection guide](https://api.akeneo.com/getting-started/connect-the-pim-4x/step-1.html). Once you have the token, paste it here and I will run the upload."

---

## Step 2 — Create the extension

Run the curl command with all values substituted from the session:

```bash
curl -X POST "https://[PIM_HOST]/api/rest/v1/ui-extensions" \
  -H "Authorization: Bearer [API_TOKEN]" \
  -F "name=[name]" \
  -F "type=sdk_script" \
  -F "position=[position]" \
  -F "file=@dist/[name].js" \
  -F "configuration[default_label]=[default_label]"
```

Add locale labels if collected during profiling:

```bash
  -F "configuration[labels][en_US]=[label_en]" \
  -F "configuration[labels][fr_FR]=[label_fr]"
```

---

## Step 3 — Save the extension UUID

The response contains a `uuid` field. Extract it and save it — the user will need it for every future update.

Tell the user:

> "Extension created. Your extension UUID is: `[uuid]`
>
> Save this — you will need it to push updates. I recommend adding it to your `.env` file as `EXTENSION_UUID=[uuid]`."

---

## Step 4 — Confirm it is live

> "Navigate to [plain-language description of the position] in your PIM — the component should appear there. If you do not see it, refresh the page."

---

## Updating the extension later

When the user rebuilds and wants to push a new version, run:

```bash
curl -X POST "https://[PIM_HOST]/api/rest/v1/ui-extensions/[EXTENSION_UUID]" \
  -H "Authorization: Bearer [API_TOKEN]" \
  -F "_method=PATCH" \
  -F "name=[name]" \
  -F "type=sdk_script" \
  -F "position=[position]" \
  -F "file=@dist/[name].js" \
  -F "configuration[default_label]=[default_label]"
```

Note: the update endpoint uses `POST` with `_method=PATCH` — not an actual HTTP PATCH.

---

Hand back to `SKILL.md` for the session wrap-up.
