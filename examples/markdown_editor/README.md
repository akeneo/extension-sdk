# Markdown Editor

A product panel extension (`pim.product.panel`) that edits a text/textarea attribute as **markdown** through a WYSIWYG editor ([ToastUI Editor](https://ui.toast.com/tui-editor)), so users never have to write raw markdown by hand.

## What it does

- Loads the configured attribute's value for the current product, using the user's catalog locale and channel (localizable/scopable attributes are resolved automatically).
- Renders it in a ToastUI WYSIWYG editor with a restricted toolbar.
- **Save** writes the editor's markdown back to the attribute via `PIM.api.product_uuid_v1.patch`, then prompts the user to refresh the product form.

## Configuration (custom variables)

All behavior is driven by extension custom variables — editable in the PIM under **Connect → UI extensions** without rebuilding:

| Variable | Default | Description |
|---|---|---|
| `markdown_attribute_code` | `description` | Code of the text/textarea attribute to edit. |
| `hide_mode_switch` | `false` | `true` hides the Markdown/WYSIWYG tab switch, locking users into WYSIWYG mode. |
| `toolbar_items` | `heading,bold\|ul,ol` | Toolbar buttons: comma-separated items, `\|`-separated groups. Valid items: `heading`, `bold`, `italic`, `strike`, `hr`, `quote`, `ul`, `ol`, `task`, `indent`, `outdent`, `table`, `image`, `link`, `code`, `codeblock`. Unknown items are ignored. |

## Setup

```bash
make start        # guided setup: install, .env, create the extension
# or manually:
npm install
npm run build     # produces dist/markdown_editor.js
make create       # first upload — or `make update` after changes
```

## Caveats

- **The attribute must store markdown.** If it currently holds HTML (e.g. it was edited with the PIM's native rich-text editor), the editor will display it as literal text/code — convert existing values to markdown first, and keep the attribute's native "rich text editor" flag off.
- **Toolbar restriction is not content restriction.** Pasted rich content and inline markdown syntax still work; add a sanitization pass on save if formatting must be enforced. With `hide_mode_switch=false` the markdown tab also allows any syntax.
- **Stale form.** Saving from the panel updates the product via API; the native form shows the old value until refresh, and a form save afterwards overwrites the panel's save (last-write-wins). To make the panel the only write path, put the attribute in an attribute group that is read-only for the relevant user groups.
