# event_platform_dashboard

Custom Component displaying the Event Platform subscribers, subscriptions and delivery errors
that belong to one PIM connection.

Read-only. Renders under **Activity > Event Platform**.

## Before anything else

This example authenticates with an **OAuth2** credential. Open System > Extensions > Create and
check that the Type of Authentication dropdown offers OAuth2. If it does not, the credential type
is not enabled on your PIM and the authentication path used here cannot be configured; contact
Akeneo support.

You also need, on that PIM:

- a connection (System > Connections) declared on the Event Platform side,
- Event Platform enabled for the tenant.

## Build

```bash
npm install
npm run build
```

Output: `dist/event_platform_dashboard.js`, a single self-contained ES module.

## Install

System > Extensions > Create.

| Field | Value |
| --- | --- |
| Name | `event_platform_dashboard` |
| Type | SDK Script |
| Position | Activity Navigation Tab |
| File | `dist/event_platform_dashboard.js` |

### Credential

Add one credential of type **OAuth2**:

| Field | Value |
| --- | --- |
| Code | `event_platform_connection` |
| Grant type | Password grant |
| Token URL | `https://<your-pim>.cloud.akeneo.com/api/oauth/v1/token` |
| Client id / secret | those of the connection |
| Username / password | those of the connection |
| Header name | `X-PIM-TOKEN` |

`header_name` is what makes this work: with a custom header name the PIM sends the raw token,
without the `Bearer` prefix, which is what Event Platform expects.

### Custom variables

```json
{
  "event_platform_url": "https://event.prd.sdk.akeneo.cloud",
  "pim_url": "https://<your-pim>.cloud.akeneo.com",
  "connections": [
    {
      "label": "ERP",
      "client_id": "<client id of the ERP connection>",
      "credentials_code": "erp_connection"
    },
    {
      "label": "Translation app",
      "client_id": "<client id of the translation connection>",
      "credentials_code": "translation_connection"
    }
  ]
}
```

Declare one entry per PIM connection, and one OAuth2 credential per entry, matching on
`credentials_code`. With two or more entries the dashboard shows a connection selector; with one it
is hidden.

The older flat form is still accepted for a single connection:

```json
{
  "event_platform_url": "...",
  "pim_url": "...",
  "pim_client_id": "<the connection client id>",
  "credentials_code": "event_platform_connection"
}
```

`event_platform_url` is the Event Platform API host, `https://event.prd.sdk.akeneo.cloud`. See the
[Event Platform documentation](https://api.akeneo.com/event-platform/overview.html).

`pim_url` and `pim_client_id` are sent as plain headers by the component. They are not secrets:
Event Platform calls the PIM back on `/api/rest/v1/token-info` to verify that the token really
belongs to that client id on that PIM.

`extension_configuration.json` holds the same values as a template for an API-based deployment.

## How the call works

```
component  ->  PIM.api.external.call()
           ->  PIM /sdk/external      (resolves the OAuth2 credential, injects X-PIM-TOKEN)
           ->  Event Platform /api/v1/subscribers
           ->  PIM /api/rest/v1/token-info   (Event Platform verifying the token)
```

Event Platform scopes subscribers by `(tenant_id, client_id)`, so "the subscribers of this
connection" is the native behaviour of the endpoint. The component does no filtering.

## Known limits

- The connection selector is a credential picker, not a security boundary. Anyone who can see the
  extension can select any connection declared in it. To restrict per connection, create one
  extension per connection and scope it with `userGroup` or `userEmails`.
- No token cache in the PIM: every call re-runs the OAuth2 round trip.
- 60 external calls per minute per extension. This component makes `1 + number of subscribers`
  calls per load, plus one per subscription expanded.
- The external call times out at 5 seconds.
- On delivery failures the Event Platform does not record the request and the response, so those
  blocks only appear on validation errors. The component hides them when empty.
