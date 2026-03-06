# Upload sub-flow — curl + API

Requires a valid PIM API token. The MCP server handles authentication; the agent runs the curl command with the compiled file.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md §11.2` and `§11.3`.

---

## Step 1 — Collect connection info and write `.env`

Ask the user for their PIM connection details:

> "To upload via the API I need a few details from your PIM. Which authentication method do you use — a Connection (client ID + secret + username + password) or a custom App token?"

Collect the appropriate values, then write them to `.env` in the project root (create the file if it does not exist):

```
PIM_HOST=https://your-pim.cloud.akeneo.com
# Connection credentials (if applicable)
CLIENT_ID=
CLIENT_SECRET=
USERNAME=
PASSWORD=
# App token (if applicable)
APP_TOKEN=
# Filled in automatically:
API_TOKEN=
EXTENSION_UUID=
```

Do not print credential values in the conversation. Confirm once the file is written:

> ".env created with your connection details."

---

## Step 2 — Acquire an API token

**If the MCP PIM authentication tool is available:** use it to get a Bearer token. Do not print the token value.

**If MCP is unavailable or fails:** run the token endpoint directly. For Connection credentials:

```bash
curl -X POST "https://[PIM_HOST]/api/oauth/v1/token" \
  -H "Content-Type: application/json" \
  -u "[CLIENT_ID]:[CLIENT_SECRET]" \
  -d '{"grant_type":"password","username":"[USERNAME]","password":"[PASSWORD]"}'
```

For a custom App token, it is already a Bearer token — use it directly.

Extract `access_token` from the response, write it to `.env` as `API_TOKEN=`, and use it for all subsequent curl commands. Do not print the token value in the conversation.

---

## Step 3 — Create the extension

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

---

## Step 4 — Save the extension UUID to `.env`

Extract the `uuid` field from the response and write it to `.env`:

```bash
EXTENSION_UUID=[uuid from response]
```

Do not ask the user to do this manually — write it directly. Then confirm:

> "Done. Extension UUID saved to `.env`. You will not need to look it up again."

---

## Step 5 — Confirm it is live

> "Navigate to [plain-language description of the position] in your PIM. You may need to refresh the page for it to appear."

---

## Updating the extension later

Read `PIM_HOST`, `EXTENSION_UUID`, and `API_TOKEN` from `.env`. If the token has expired, re-run Step 2 to get a new one and update `API_TOKEN` in `.env`. Then run:

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
