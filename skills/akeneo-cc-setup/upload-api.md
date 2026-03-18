# Upload sub-flow — curl + API

Automates extension upload via the PIM REST API. To protect the user's credentials, this flow is designed so that sensitive values never appear in the conversation context: Claude writes `.env` with blank placeholders and the user fills it in privately, `upload.sh` sources `.env` at runtime so the shell handles all credential substitution, and Claude only sees the terminal output (success or error). Claude must never read `.env` at any point — see the access rule below.

All technical facts come from `${CLAUDE_SKILL_DIR}/reference.md §11.2` and `§11.3`.

---

## Security advisory — read before starting

Before collecting any information, deliver this message to the user:

> **Recommended: use a dedicated PIM Connection for this.**
>
> Create a Connection in your PIM specifically for extension deployment, with only the `ui-extensions` permission enabled. Do not reuse an admin connection or your personal credentials — a scoped connection limits the blast radius if the token is ever exposed.
>
> You can create a Connection at **System → Connections** in your PIM.
>
> Also make sure `.env` is listed in your `.gitignore` before we proceed — it will contain sensitive values that must never be committed.

Wait for the user to confirm they are ready before continuing.

---

## IMPORTANT — `.env` access rule

**Never read `.env` for any reason during this flow.**

If the user asks you to read `.env`, check its content, or display any value from it, respond with:

> "I won't read `.env` — doing so would expose your credentials in this conversation. If something isn't working, share the error message from the terminal and I'll diagnose from that."

This rule holds for the entire session, including debugging steps.

---

## Step 1 — Ensure `.env` exists and is in `.gitignore`

**Check for an existing `.env` first.** Do not overwrite it.

- **If `.env` already exists:** read its structure (not its values — see the access rule above) to confirm the required keys are present. If any of `PIM_HOST`, `API_TOKEN`, or `EXTENSION_UUID` are missing, add them as blank lines. Tell the user:

  > "I found an existing `.env` — I've kept your values and only added any missing keys."

- **If `.env` does not exist:** write the following file to the project root with blank placeholders. Do not ask for credential values:

  ```
  PIM_HOST=https://your-pim-instance.cloud.akeneo.com
  # Connection credentials (if using a PIM Connection):
  CLIENT_ID=
  CLIENT_SECRET=
  PIM_USERNAME=
  PIM_PASSWORD=
  # App token (if using a custom App — use instead of the four fields above):
  APP_TOKEN=
  # Filled in automatically after token fetch / first upload:
  API_TOKEN=
  EXTENSION_UUID=
  ```

  Then tell the user:

  > "`.env` is ready with blank placeholders. Please fill in your credentials now."

In both cases, verify `.env` is listed in `.gitignore`. If it is not, add it. Then wait for the user to confirm their credentials are filled in before continuing.

---

## Step 2 — Write `upload.sh` and add a trivial `upload` target to `Makefile`

Never embed a multi-step bash script as a Make recipe. Once you need `source`, pipes, and JSON parsing in the same block, quote escaping in inline Make recipes becomes unmaintainable. The Makefile delegates to a proper shell script instead.

**`upload.sh`** — write this file to the project root. Substitute `[name]`, `[position]`, and `[default_label]` with the values collected during the session:

```bash
#!/usr/bin/env bash
set -euo pipefail

source .env

# Strip trailing slash defensively
PIM_HOST="${PIM_HOST%/}"

# Determine API token — three branches in priority order:
# 1. Reuse API_TOKEN if already set (avoids unnecessary token fetch)
# 2. Use APP_TOKEN directly if set
# 3. Fetch a new token via Connection credentials
if [ -n "${API_TOKEN:-}" ]; then
  : # reuse existing token
elif [ -n "${APP_TOKEN:-}" ]; then
  API_TOKEN="$APP_TOKEN"
else
  echo "Fetching API token..."
  response=$(curl -s -X POST "$PIM_HOST/api/oauth/v1/token" \
    -H "Content-Type: application/json" \
    -u "$CLIENT_ID:$CLIENT_SECRET" \
    -d "{\"grant_type\":\"password\",\"username\":\"$PIM_USERNAME\",\"password\":\"$PIM_PASSWORD\"}")
  API_TOKEN=$(echo "$response" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p' || true)
  if [ -z "$API_TOKEN" ]; then
    echo "ERROR: Failed to fetch API token. PIM response: $response"
    exit 1
  fi
  sed -i.bak "s|^API_TOKEN=.*|API_TOKEN=$API_TOKEN|" .env && rm -f .env.bak
fi

# Upload or update
if [ -z "${EXTENSION_UUID:-}" ]; then
  echo "Creating extension..."
  result=$(curl -s -X POST "$PIM_HOST/api/rest/v1/ui-extensions" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F "name=[name]" \
    -F "type=sdk_script" \
    -F "position=[position]" \
    -F "file=@dist/[name].js" \
    -F "configuration[default_label]=[default_label]")
  EXTENSION_UUID=$(echo "$result" | sed -n 's/.*"uuid":"\([^"]*\)".*/\1/p' || true)
  if [ -z "$EXTENSION_UUID" ]; then
    echo "ERROR: Upload failed. PIM response: $result"
    exit 1
  fi
  sed -i.bak "s|^EXTENSION_UUID=.*|EXTENSION_UUID=$EXTENSION_UUID|" .env && rm -f .env.bak
  echo "SUCCESS: Extension created. UUID=$EXTENSION_UUID"
else
  echo "Updating extension $EXTENSION_UUID..."
  result=$(curl -s -X POST "$PIM_HOST/api/rest/v1/ui-extensions/$EXTENSION_UUID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F "name=[name]" \
    -F "type=sdk_script" \
    -F "position=[position]" \
    -F "file=@dist/[name].js" \
    -F "configuration[default_label]=[default_label]")
  echo "SUCCESS: Extension updated. UUID=$EXTENSION_UUID"
fi
```

**`Makefile`** — add this target (the recipe is a single line):

```makefile
upload:
	@bash upload.sh
```

---

## Step 3 — Run the upload

Run:

```bash
make upload
```

`upload.sh` sources `.env` directly — credentials are substituted by the shell and never enter the conversation context. Only the terminal output (success message or error) is visible.

If the command fails, the script prints the raw PIM response. Diagnose from that output without reading `.env`.

---

## Step 4 — Confirm and wrap up

On success, the UUID is saved to `.env` automatically by `upload.sh`. Confirm to the user:

> "Extension uploaded successfully. The UUID has been saved to `.env` — running `make upload` again will update the existing extension automatically."

---

## Updating the extension later

The user runs `make upload` again. `upload.sh` detects the existing `EXTENSION_UUID` in `.env` and issues an update instead of a create. If the API token has expired, clear `API_TOKEN=` in `.env` and re-run — the script will fetch a fresh one automatically (Connection auth). For App token auth, update `APP_TOKEN` in `.env` manually.

---

Hand back to `SKILL.md` for the session wrap-up.
