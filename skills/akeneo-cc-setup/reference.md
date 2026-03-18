# Akeneo Custom Component — Technical Reference

This file is the single source of truth for all factual technical content about building an Akeneo Custom Component (CC). No instructions, no user guidance — only facts.

**Sources:** [`extension-sdk` repository](https://github.com/akeneo/extension-sdk) · [Advanced Extensions documentation](https://api.akeneo.com/advanced-extensions/overview.html)

---

## 0. Prerequisites

The following must be present on the user's machine before the skill can run successfully.

| Requirement | Minimum version | Used for |
|---|---|---|
| Claude Code | any | Running the skill |
| `akeneo-cc` plugin | any | Skill availability (`/akeneo-cc-setup` command) |
| Node.js | 18 | `npm install`, `npm run build` |
| npm | bundled with Node.js | Dependency installation and build scripts |
| curl | any | `make upload` (API upload path); downloading `global.d.ts` during scaffold |

The plugin is installed from the `extension-sdk` public repository. Node.js and npm must be available in the shell where Claude Code runs — the skill executes `npm install` and `npm run build` directly via Bash.

curl is required for two distinct purposes:
- **Scaffold step:** `curl -o src/global.d.ts https://raw.githubusercontent.com/akeneo/extension-sdk/main/examples/common/global.d.ts`
- **API upload path:** the `make upload` Makefile target uses curl to POST the compiled file to the PIM REST API

curl is not required for the UI upload path.

---

## 1. What Is a Custom Component

A Custom Component is a UI Extension of type `sdk_script`. "Custom Component" is the current product name; "sdk_script" was its name during the development phase and is still used as the `type` value in all API payloads and configuration files. It is a compiled JavaScript/TypeScript application uploaded directly into the PIM. Once uploaded, it renders inside the Akeneo PIM interface at a specific position on the page.

The SDK (`globalThis.PIM`) is injected by the PIM runtime into the extension's execution context. It provides access to context data, PIM APIs, navigation, and custom configuration.

---

## 2. Runtime Environment

### Sandbox

Extensions execute inside a **SES (Secure ECMAScript)** sandbox. This is enforced by the PIM runtime and cannot be opted out of.

Consequences:
- Direct `fetch()` and `XMLHttpRequest` calls are prohibited. All HTTP must go through `PIM.api.*` or `PIM.api.external.call()`.
- `process` (Node.js global) is not available. Use `import.meta.env` for environment variables at build time.
- Dynamic code evaluation (`eval`, `new Function(...)`) is restricted.
- Modifying the `constructor` property on objects will throw. Some libraries do this internally — audit dependencies.
- Extension code is isolated and cannot affect PIM global state or the DOM outside its container.

### Permissions

API calls made through `PIM.api.*` inherit the Web API permissions of the **logged-in PIM user**. Two users running the same extension may get different results if their PIM roles differ.

### Output format

The compiled output must be a single JavaScript file. The SDK examples use **ESM format** targeting **ES2020** — this is the configuration chosen by the SDK team and is a solid default. Other formats and targets may be supported by the PIM runtime but are not covered by the provided tooling.

### Bundle size

The compiled JS file must not exceed **10 MB**.

---

## 3. PIM SDK — `globalThis.PIM`

The SDK object has four top-level properties:

```typescript
globalThis.PIM = {
  user: PIM_USER;
  context: PIM_CONTEXT;
  api: { /* see §4 */ };
  navigate: { /* see §5 */ };
  custom_variables: EXTENSION_VARIABLES; // see §6
}
```

### 3.1 User (`PIM.user`)

```typescript
{
  username: string;
  uuid: string;
  first_name: string;
  last_name: string;
  groups: Array<{ id: number; name: string }>;
}
```

### 3.2 Context (`PIM.context`)

All positions expose a `BaseContext`:

```typescript
{
  position: string;           // the extension's position identifier
  user: {
    catalog_locale: string;   // e.g. "en_US"
    catalog_scope: string;    // e.g. "ecommerce"
  };
}
```

Plus one position-specific payload (mutually exclusive):

| Position type | Additional field |
|---|---|
| Product page / Product model page | `product: { uuid: string; identifier: string \| null }` |
| Category page | `category: { code: string }` |
| Product grid | `productGrid: { productUuids: string[]; productModelCodes: string[] }` |
| All other positions | no additional field |

---

## 4. PIM API (`PIM.api.*`)

All API calls are asynchronous (Promise-based). Operations follow REST semantics: `get`, `list`, `create`/`post`, `patch`/`upsert`, `delete`.

**`list()` search parameter:** pass a plain object — do not `JSON.stringify` it. The SDK serializes it internally; wrapping it in a string causes a 400 error.

```typescript
// Correct
PIM.api.product_uuid_v1.list({ search: { uuid: [{ operator: 'IN', value: uuids }] } })

// Wrong — double-encodes the search param
PIM.api.product_uuid_v1.list({ search: JSON.stringify({ uuid: [...] }) })
```

### 4.1 Product APIs

| Object | API key | Operations |
|---|---|---|
| Product (by UUID) | `product_uuid_v1` | `get`, `list`, `create`, `patch`, `delete` |
| Product model | `product_model_v1` | `get`, `list`, `post`, `patch`, `delete` |

When filtering `product_uuid_v1.list()` by UUID, the search key is `uuid` (not `id`):

```typescript
PIM.api.product_uuid_v1.list({
  search: { uuid: [{ operator: 'IN', value: ['uuid-1', 'uuid-2'] }] }
})
```
| Product media file | `product_media_file_v1` | `get`, `post`, `download` |

### 4.2 Catalog Structure APIs

| Object | API key | Operations |
|---|---|---|
| Family | `family_v1` | `get`, `list`, `post`, `patch` |
| Family variant | `family_variant_v1` | `get`, `list`, `post`, `patch` |
| Category | `category_v1` | `get`, `list`, `post`, `patch` |
| Attribute | `attribute_v1` | `get`, `list`, `post`, `patch` |
| Attribute group | `attribute_group_v1` | `get`, `list`, `post`, `patch` |
| Attribute option | `attribute_option_v1` | `get`, `list`, `post`, `patch` |
| Association type | `association_type_v1` | `get`, `list`, `post`, `patch` |

### 4.3 Asset APIs

| Object | API key | Operations |
|---|---|---|
| Asset | `asset_v1` | `get`, `list`, `upsert`, `delete` |
| Asset family | `asset_family_v1` | `get`, `list`, `upsert` |
| Asset attribute | `asset_attribute_v1` | `get`, `list`, `upsert` |
| Asset attribute option | `asset_attribute_option_v1` | `get`, `list`, `upsert` |
| Asset media file | `asset_media_file_v1` | `get`, `list`, `upload`, `download` |

### 4.4 Reference Entity APIs

| Object | API key | Operations |
|---|---|---|
| Reference entity | `reference_entity_v1` | `get`, `list`, `upsert` |
| RE attribute | `reference_entity_attribute_v1` | `get`, `list`, `upsert` |
| RE attribute option | `reference_entity_attribute_option_v1` | `get`, `list`, `upsert` |
| RE record | `reference_entity_record_v1` | `get`, `list`, `upsert` |

### 4.5 System & Settings APIs

| Object | API key | Operations |
|---|---|---|
| System | `system_v1` | `get` |
| Channel | `channel_v1` | `get`, `list` |
| Currency | `currency_v1` | `get`, `list` |
| Locale | `locale_v1` | `get`, `list` |
| Measurement family | `measurement_family_v1` | `get`, `list`, `upsert` |

### 4.6 Workflow APIs

| Object | API key | Operations |
|---|---|---|
| Workflow | `workflows_v1` | `get`, `list` |
| Workflow task | `workflow_tasks_v1` | `get`, `list`, `patch` |
| Workflow execution | `workflow_executions_v1` | `post` |

### 4.7 External API calls

Two methods are available:

| Method | Use case |
|---|---|
| `PIM.api.external.call(params)` | Standard requests |
| `PIM.api.external.longCall(params)` | Long-running requests that may exceed normal timeout — only one `longCall` can run at a time |

Both accept the same parameters:

```typescript
const response = await PIM.api.external.call({
  method: 'GET',                                    // required
  url: 'https://api.example.com/data',              // required
  credentials_code: 'my_credential_code',           // optional
  headers: { 'Content-Type': 'application/json' },  // optional
  body: JSON.stringify({ key: 'value' }),            // optional — for POST/PATCH
});
```

`credentials_code` is optional — omit it for public APIs. When provided, it references a credential stored in the extension configuration; the PIM injects the appropriate auth header server-side. Hardcoding credentials in the JS file is prohibited — they are visible in browser developer tools.

### Response handling

The raw return value is a SES-proxied Response-like object. Call `.json()` on it to get the actual envelope — the real API payload is at `wrapper.body`:

```typescript
const response = await PIM.api.external.call({ method: 'GET', url });
const wrapper = await response.json();
const data = wrapper.body; // actual API response data
```

The envelope shape after `.json()`:

```typescript
{
  status: 'success' | 'error', // string, not HTTP number
  statusCode: 200,             // HTTP status code
  body: { ... },               // actual API response payload
  contentType: 'application/json',
  error: null | string
}
```

**Do not** access `response.body` directly — it is an opaque `ReadableStream` before `.json()` is called. `response.status` is the HTTP status number (e.g. `200`); `response.statusCode` is `undefined` on the raw object — both move to the expected shape only after `.json()`.

### SES debugging note

`JSON.stringify()` and `Object.keys()` on the raw response object return `{}` / `[]` even when properties exist — the object is SES-hardened. Use direct property access instead:

```typescript
// Wrong — always prints {}
console.log(JSON.stringify(response));

// Correct
console.log(response.status, response.statusCode);
```

The same applies after `.json()` if the wrapper is also proxied — always access properties directly.

---

## 5. Navigation (`PIM.navigate`)

```typescript
PIM.navigate.internal(path: string): void  // navigate within PIM, e.g. '#/products'
PIM.navigate.external(url: string): void   // open external URL (HTTPS only)
PIM.navigate.refresh(): void               // refresh the current PIM page
```

---

## 6. Custom Variables (`PIM.custom_variables`)

Arbitrary key-value configuration stored server-side in the extension record. Accessed at runtime via `globalThis.PIM.custom_variables`. Values are set at upload time in `extension_configuration.json` and can be updated via the API or UI without rebuilding the extension.

Example:
```typescript
const expirationDate = globalThis.PIM.custom_variables.certification_expiration_date;
```

---

## 7. Available Positions

| Position identifier | Where it appears | UI label (PIM admin dropdown) |
|---|---|---|
| `pim.product.header` | Product edit page — header | Product Header |
| `pim.product.panel` | Product edit page — right sidebar | Product Panel |
| `pim.product.tab` | Product edit page — tab | Product Tab |
| `pim.product-model.header` | Product model edit page — header | Product Model Header |
| `pim.product-model.panel` | Product model edit page — right sidebar | Product Model Panel |
| `pim.product-model.tab` | Product model edit page — tab | Product Model Tab |
| `pim.sub-product-model.header` | Sub product model edit page — header | Sub-Product Model Header |
| `pim.sub-product-model.panel` | Sub product model edit page — right sidebar | Sub-Product Model Panel |
| `pim.sub-product-model.tab` | Sub product model edit page — tab | Sub-Product Model Tab |
| `pim.category.tab` | Category edit page — tab | Category Tab |
| `pim.reference-entity-record.tab` | Reference entity record edit page — tab | Reference Entity Record Tab |
| `pim.product-grid.action-bar` | Product list page — bulk action bar (max 500 selected items) | Product Grid Action Bar |
| `pim.activity.navigation.tab` | Activity navigation — tab | Activity Navigation Tab |
| `pim.performance.analytics.tab` | Performance analytics — tab | Performance Analytics Tab |

Header positions (`*.header`) have a constrained height to preserve page readability. `pim.product-grid.action-bar` only fires when at most 500 products/models are selected.

---

## 8. Project Structure

The following structure is the one recommended by the extension-sdk repository and its examples.

```
my-extension/
├── src/
│   ├── main.tsx                    # Entry point — mounts the React app
│   ├── App.tsx                     # Root component — all UI and logic
│   ├── index.css                   # Base styles
│   └── vite-env.d.ts               # Vite type definitions
├── dist/                           # Build output (generated, not committed)
│   └── my-extension.js             # Compiled single-file output
├── extension_configuration.json    # Extension metadata and credentials
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── .env.example
├── .env                            # Local environment variables (not committed)
├── Makefile                        # Build and deploy commands
└── index.html                      # Dev server entry point (not deployed)
```

### 8.1 `extension_configuration.json`

Full schema:

```json
{
  "name": "my_extension",
  "type": "sdk_script",
  "position": "pim.product.panel",
  "file": "dist/my-extension.js",
  "configuration": {
    "default_label": "My Extension",
    "labels": {
      "en_US": "My Extension",
      "fr_FR": "Mon extension"
    },
    "custom_variables": {}
  },
  "credentials": [
    {
      "code": "my_api_token",
      "type": "Bearer Token",
      "value": "token-value"
    },
    {
      "code": "my_basic_auth",
      "type": "Basic Auth",
      "value": { "username": "user", "password": "pass" }
    },
    {
      "code": "my_custom_header",
      "type": "Custom Header",
      "value": { "header_key": "X-My-Header", "header_value": "value" }
    }
  ]
}
```

Required fields: `name`, `type` (must be `sdk_script`), `position`, `file`, `configuration.default_label`.
Optional fields: `configuration.labels`, `configuration.custom_variables`, `credentials`.

**Label length limit:** `default_label` and all per-locale `labels` values must not exceed **30 characters**.

### 8.2 `package.json`

```json
{
  "name": "my-extension",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "terser": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

### 8.3 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Replace at build time — process is not available in the SES sandbox at runtime
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        format: 'es',
        entryFileNames: 'my-extension.js', // explicit .js; must match extension_configuration.json "file"
      },
    },
    outDir: 'dist',
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: mode !== 'production',
    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
      },
    },
    commonjsOptions: {
      strictRequires: 'auto', // reduces bundle size ~8x; must not be removed
    },
  },
}));
```

Replace `my-extension` in `entryFileNames` with the component's snake_case name to match the `file` field in `extension_configuration.json`.

### 8.4 TypeScript configuration

**`tsconfig.json`** (minimal — only references `tsconfig.app.json`):

```json
{
  "references": [{ "path": "./tsconfig.app.json" }],
  "files": []
}
```

**`tsconfig.json`** (extended — also type-checks `vite.config.ts` via `tsconfig.node.json`):

```json
{
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "files": []
}
```

**`tsconfig.node.json`** (only needed alongside the extended `tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**`tsconfig.app.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

### 8.5 `src/index.css`

Create this file alongside `main.tsx`. A minimal reset is sufficient:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### 8.6 `src/main.tsx` pattern

```typescript
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'

if (!document.getElementById('root')) {
  document.body.innerHTML = '<div id="root"></div>'
}

ReactDOM.render(
  <StrictMode>
      <App />
  </StrictMode>,
  document.getElementById('root')
)
```

### 8.7 `src/App.tsx` pattern

```typescript
function App() {
  const context = globalThis.PIM.context;
  const user = globalThis.PIM.user;
  const variables = globalThis.PIM.custom_variables;

  // ... component logic using PIM.api.*

  return <div>...</div>;
}

export default App;
```

### 8.8 `.env` variables

Optional — useful for storing PIM connection details when deploying via curl. Not loaded by the PIM runtime; only used by local tooling.

```
PIM_HOST=https://your-pim-instance.com
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
PIM_USERNAME=your_username
PIM_PASSWORD=your_password
# OR (alternative authentication)
APP_TOKEN=your_app_token

API_TOKEN=               # filled in automatically after token fetch
EXTENSION_UUID=          # filled in automatically after first upload
```

### 8.9 Design Systems (optional)

The scaffold does not include a design system by default. Any design system can be added after the hello world is working.

#### Available options (used in official extension-sdk examples)

| Design system | Packages | CSS approach | SES-safe |
|---|---|---|---|
| Akeneo Design System | `akeneo-design-system@^4.0.0`, `styled-components@^6.1.0` | CSS-in-JS (no external file) | Yes — with `process.env.NODE_ENV` define |
| Shopify Polaris | `@shopify/polaris` | External CSS file | Requires CSS injection plugin |
| shadcn/UI | Radix UI primitives + Tailwind CSS | External CSS file | Requires CSS injection plugin |

Reference: `examples/generic_dashboard` demonstrates all three in a single project.

**Exact install command for the Akeneo Design System:**

```bash
npm install akeneo-design-system styled-components
```

The package name is `akeneo-design-system` — unscoped, no `@akeneo-pim-community/` prefix. That scoped variant does not exist on the public npm registry. styled-components must be v6 (`^6.1.0`) — v5 has different SES behaviour and a different `styled.d.ts` augmentation pattern.

#### SES constraint: CSS injection

Extensions run in an SES sandbox and cannot load separate CSS files — only the single compiled JS bundle is deployed. Any design system that ships an external stylesheet must have its CSS inlined into the bundle at build time.

**Fix:** add `vite-plugin-css-injected-by-js` to `devDependencies` and register it in `vite.config.ts`:

```bash
npm install --save-dev vite-plugin-css-injected-by-js
```

```typescript
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  // ...
});
```

This plugin inlines all CSS into the JS bundle during the Vite build. Without it, Polaris or Tailwind styles are silently absent when the extension loads in the PIM.

The Akeneo Design System does **not** need this plugin — `styled-components` injects styles at runtime via a `<style>` tag, which works inside the SES sandbox.

#### Akeneo Design System pattern

**`src/main.tsx`** — wrap the root with `ThemeProvider`:

```typescript
import { pimTheme } from 'akeneo-design-system';
import { ThemeProvider } from 'styled-components';

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={pimTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
```

`ThemeProvider` can also wrap individual components instead of the root — useful when mixing multiple design systems.

**`src/styled.d.ts`** — TypeScript theme augmentation (required for typed styled-components usage):

```typescript
import 'styled-components';
import { Theme } from 'akeneo-design-system';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

**`process.env.NODE_ENV` define** — already present in the `vite.config.ts` scaffold (`define: { 'process.env.NODE_ENV': JSON.stringify('production') }`). This is required: styled-components references `process.env.NODE_ENV` internally; without the define, it throws at runtime in the SES sandbox.

**`createGlobalStyle` — do not use.** It injects styles into the document root, which conflicts with PIM's own styles and leaks outside the extension's container. Scope all styles to the component level.

#### Bundle size impact

Each design system adds significant weight to the bundle. Representative additions (minified + gzipped):

| Addition | Approximate bundle increase |
|---|---|
| `akeneo-design-system` + `styled-components` | ~300–500 KB |
| `@shopify/polaris` | ~400–600 KB |
| Tailwind CSS (purged) + Radix UI | ~50–150 KB |

The PIM enforces a 10 MB hard limit on the compiled file. Check the output size after adding any design system: `ls -lh dist/*.js`.

---

## 9. Known SES Runtime Errors

These errors appear in the browser console when the extension loads in the PIM. They indicate the compiled bundle contains code incompatible with the SES sandbox.

### `SES_UNCAUGHT_EXCEPTION: ReferenceError: process is not defined`

**Cause:** The bundle contains a runtime reference to `process` (typically `process.env.NODE_ENV` from React or other libraries). `process` is a Node.js global; the SES sandbox does not provide it.

**Fix:** Add a `define` entry in `vite.config.ts` to replace it at build time:

```typescript
define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
},
```

This must be a top-level `defineConfig` option, not inside `build`.

### `SES Removing unpermitted intrinsics` (warnings)

**Cause:** The SES sandbox removes built-ins that are newer than its locked-down environment (e.g. `MapPrototype.getOrInsert`, `WeakMapPrototype.getOrInsert`, `DatePrototype.toTemporalInstant`). These are console warnings only — they do not affect functionality and can be ignored.

### Output file has no `.js` extension

**Cause:** Vite lib mode `fileName` does not always guarantee a `.js` extension depending on the version and format.

**Fix:** Use `rollupOptions.output.entryFileNames` with an explicit `.js` suffix instead of `lib.fileName`.

---

## 10. Build Commands

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start local Vite dev server |
| `npm run build` | Production build: TypeScript check + Vite bundle → `dist/[name].js` |
| `npm run preview` | Preview the production build locally |

> **Note:** `npm run dev` has limited value for Custom Components. The PIM SDK (`globalThis.PIM`) is only injected when the component runs inside the PIM runtime. Most features — context data, API calls, navigation — are unavailable locally. The recommended workflow is: build → upload → verify in the PIM. `index.html` is not scaffolded by default; if local dev is needed, create one at the project root with a `<div id="root"></div>` body and `<script type="module" src="/src/main.tsx"></script>`.

---

## 12. Credential Types Reference

| Type | Form field value | Auth header injected by PIM |
|---|---|---|
| Bearer Token | `Bearer Token` | `Authorization: Bearer {value}` |
| Basic Auth | `Basic Auth` | `Authorization: Basic {base64(username:password)}` |
| Custom Header | `Custom Header` | `{header_key}: {header_value}` |

Credentials are stored encrypted in the PIM database. Never hardcode credentials in the JS bundle — they are visible in browser developer tools.

---

## 13. Type Definitions

The full TypeScript type definitions for the PIM SDK are available at:

```
https://github.com/akeneo/extension-sdk/blob/main/examples/common/global.d.ts
```

This file contains all types for `PIM_SDK`, `PIM_USER`, `PIM_CONTEXT`, and all API parameter/response types. Download it into the project (e.g. `src/global.d.ts`) and add it to `tsconfig.app.json`:

```json
"include": ["src"]
```

TypeScript will pick it up automatically since it is inside `src/`. No explicit reference needed.

**File structure — module, not ambient.** `global.d.ts` contains `export declare type` statements and a bare `export { }`, making it a TypeScript **module** file. Two consequences:

1. **`globalThis.PIM` is correctly typed** via the `declare global { namespace globalThis { var PIM: PIM_SDK; } }` block at the end of the file. This is module augmentation — it works correctly and requires no import. `globalThis.PIM`, `globalThis.PIM.context`, `globalThis.PIM.api.*` are all fully typed as long as the file is included in the compilation.

2. **Exported types (`PIM_CONTEXT`, `PIM_USER`, `PIM_SDK`, `EXTENSION_VARIABLES`) are NOT globally ambient.** They cannot be used as type names in annotations without an explicit import:

```typescript
import type { PIM_CONTEXT, PIM_USER } from './global';
```

**`PIM_CONTEXT` is a discriminated union — `'in'` narrowing required.** Even with correct typing, accessing position-specific context fields directly raises `TS2339: Property 'product' does not exist on type 'PIM_CONTEXT'`. The type is a union of three mutually exclusive branches; TypeScript requires narrowing before accessing branch-specific properties:

```typescript
const context = globalThis.PIM.context;

if ('product' in context) {
  const uuid = context.product.uuid; // fully typed after narrowing
}
if ('category' in context) {
  const code = context.category.code;
}
if ('productGrid' in context) {
  const uuids = context.productGrid.productUuids;
}
```

`BaseContext` fields (`context.position`, `context.user.catalog_locale`, `context.user.catalog_scope`) are always present and do not require narrowing.

