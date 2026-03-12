# Upload sub-flow — curl + API

Automates extension upload via the PIM REST API. To protect the user's credentials, this flow is designed so that sensitive values never appear in the conversation context: Claude writes `.env` with blank placeholders and the user fills it in privately, a Makefile target sources `.env` at runtime so the shell handles all credential substitution, and Claude only sees the terminal output (success or error). Claude must never read `.env` at any point — see the access rule below.

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

## Step 1 — Write `.env` with placeholders

Write the following file to the project root. Do not ask for credential values — leave them blank for the user to fill in:

```
PIM_HOST=https://your-pim-instance.cloud.akeneo.com
# Connection credentials (if using a PIM Connection):
CLIENT_ID=
CLIENT_SECRET=
USERNAME=
PASSWORD=
# App token (if using a custom App — use instead of the four fields above):
APP_TOKEN=
# Filled in automatically after first upload:
API_TOKEN=
EXTENSION_UUID=
```

Then tell the user:

> "`.env` is ready with blank placeholders. Please fill in your credentials now."

Wait for the user to confirm before continuing.

---

## Step 2 — Add `upload` target to `Makefile`

Add the following target to the existing `Makefile` in the project root. Substitute `[name]`, `[position]`, and `[default_label]` with the values collected during the session:

```makefile
upload:
	@set -euo pipefail; \
	source .env; \
	if [ -n "$${APP_TOKEN:-}" ]; then \
	  API_TOKEN="$$APP_TOKEN"; \
	else \
	  echo "Fetching API token..."; \
	  response=$$(curl -s -X POST "$$PIM_HOST/api/oauth/v1/token" \
	    -H "Content-Type: application/json" \
	    -u "$$CLIENT_ID:$$CLIENT_SECRET" \
	    -d "{\"grant_type\":\"password\",\"username\":\"$$USERNAME\",\"password\":\"$$PASSWORD\"}"); \
	  API_TOKEN=$$(echo "$$response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4); \
	  if [ -z "$$API_TOKEN" ]; then echo "ERROR: Failed to fetch API token. Check your .env credentials."; exit 1; fi; \
	  sed -i.bak "s|^API_TOKEN=.*|API_TOKEN=$$API_TOKEN|" .env && rm -f .env.bak; \
	fi; \
	if [ -z "$${EXTENSION_UUID:-}" ]; then \
	  echo "Creating extension..."; \
	  result=$$(curl -s -X POST "$$PIM_HOST/api/rest/v1/ui-extensions" \
	    -H "Authorization: Bearer $$API_TOKEN" \
	    -F "name=[name]" \
	    -F "type=sdk_script" \
	    -F "position=[position]" \
	    -F "file=@dist/[name].js" \
	    -F "configuration[default_label]=[default_label]"); \
	  EXTENSION_UUID=$$(echo "$$result" | grep -o '"uuid":"[^"]*"' | cut -d'"' -f4); \
	  if [ -z "$$EXTENSION_UUID" ]; then echo "ERROR: Upload failed. PIM response: $$result"; exit 1; fi; \
	  sed -i.bak "s|^EXTENSION_UUID=.*|EXTENSION_UUID=$$EXTENSION_UUID|" .env && rm -f .env.bak; \
	  echo "SUCCESS: Extension created. UUID=$$EXTENSION_UUID"; \
	else \
	  echo "Updating extension $$EXTENSION_UUID..."; \
	  result=$$(curl -s -X POST "$$PIM_HOST/api/rest/v1/ui-extensions/$$EXTENSION_UUID" \
	    -H "Authorization: Bearer $$API_TOKEN" \
	    -F "name=[name]" \
	    -F "type=sdk_script" \
	    -F "position=[position]" \
	    -F "file=@dist/[name].js" \
	    -F "configuration[default_label]=[default_label]"); \
	  echo "SUCCESS: Extension updated. UUID=$$EXTENSION_UUID"; \
	fi
```

---

## Step 3 — Run the upload

Run:

```bash
make upload
```

The Makefile sources `.env` internally — credentials are substituted by the shell and never enter the conversation context. Only the terminal output (success message or error) is visible.

If the command fails, read the error message from the terminal output and diagnose from it without reading `.env`.

---

## Step 4 — Confirm and wrap up

On success, the UUID is saved to `.env` automatically by the Makefile. Confirm to the user:

> "Extension uploaded successfully. The UUID has been saved to `.env` — running `make upload` again will update the existing extension automatically."

---

## Updating the extension later

The user runs `make upload` again. The Makefile detects the existing `EXTENSION_UUID` in `.env` and issues an update instead of a create. If the token has expired, it re-fetches it automatically (Connection auth) or the user updates `APP_TOKEN` in `.env` manually.

---

Hand back to `SKILL.md` for the session wrap-up.
