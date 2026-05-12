import { useState } from 'react';
import { Button, Helper, SectionTitle, TextInput } from 'akeneo-design-system';

// Use any for PIM API calls since we are calling multiple endpoints dynamically
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = (globalThis.PIM as any).api;

// --- Types ---

type FieldType = 'text' | 'json' | 'file';

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
}

type FieldValues = Record<string, string | File | null>;
type EndpointStatus = 'idle' | 'loading' | 'success' | 'error';

interface EndpointConfig {
  id: string;
  label: string;
  sdkPath: string;
  fields: FieldConfig[];
  execute: (values: FieldValues) => Promise<unknown>;
}

// --- Helpers ---

function parseOptionalJson(value: string | File | null): unknown {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return JSON.parse(value);
}

function str(value: string | File | null): string {
  return typeof value === 'string' ? value : '';
}

function optStr(value: string | File | null): string | undefined {
  const s = str(value);
  return s || undefined;
}

function optNum(value: string | File | null): number | undefined {
  const s = str(value);
  return s ? Number(s) : undefined;
}

// --- Endpoint definitions ---

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'attribute_option_patch',
    label: 'Attribute Option — patch',
    sdkPath: 'PIM.api.attribute_option_v1.patch()',
    fields: [
      { name: 'attribute_code', label: 'Attribute code', type: 'text', required: true },
      { name: 'code', label: 'Option code', type: 'text', required: true },
      {
        name: 'data',
        label: 'Data',
        type: 'json',
        placeholder: '{"labels": {"en_US": "My Option"}}',
        required: true,
      },
    ],
    execute: async (v) => {
      await api.attribute_option_v1.patch({
        attribute_code: str(v.attribute_code),
        code: str(v.code),
        data: parseOptionalJson(v.data),
      });
      return { success: true };
    },
  },
  {
    id: 'asset_media_file_upload',
    label: 'Asset Media File — upload',
    sdkPath: 'PIM.api.asset_media_file_v1.upload()',
    fields: [
      { name: 'file', label: 'File', type: 'file', required: true },
      { name: 'filename', label: 'Filename', type: 'text', placeholder: 'my-file.jpg', required: false },
    ],
    execute: async (v) => {
      return await api.asset_media_file_v1.upload({
        file: v.file as File,
        filename: optStr(v.filename),
      });
    },
  },
  {
    id: 'family_patch',
    label: 'Family — patch',
    sdkPath: 'PIM.api.family_v1.patch()',
    fields: [
      { name: 'code', label: 'Family code', type: 'text', required: true },
      {
        name: 'data',
        label: 'Data',
        type: 'json',
        placeholder: '{"code": "my_family", "labels": {"en_US": "My Family"}}',
        required: true,
      },
    ],
    execute: async (v) => {
      await api.family_v1.patch({
        code: str(v.code),
        data: parseOptionalJson(v.data),
      });
      return { success: true };
    },
  },
  {
    id: 'family_get',
    label: 'Family — get',
    sdkPath: 'PIM.api.family_v1.get()',
    fields: [
      { name: 'code', label: 'Family code', type: 'text', required: true },
    ],
    execute: async (v) => {
      return await api.family_v1.get({ code: str(v.code) });
    },
  },
  {
    id: 'product_model_patch',
    label: 'Product Model — patch',
    sdkPath: 'PIM.api.product_model_v1.patch()',
    fields: [
      { name: 'code', label: 'Product model code', type: 'text', required: true },
      {
        name: 'data',
        label: 'Data',
        type: 'json',
        placeholder: '{"categories": ["my_category"]}',
        required: true,
      },
    ],
    execute: async (v) => {
      await api.product_model_v1.patch({
        code: str(v.code),
        data: parseOptionalJson(v.data),
      });
      return { success: true };
    },
  },
  {
    id: 'attribute_list',
    label: 'Attributes — list',
    sdkPath: 'PIM.api.attribute_v1.list()',
    fields: [
      { name: 'page', label: 'Page', type: 'text', placeholder: '1', required: false },
      { name: 'limit', label: 'Limit', type: 'text', placeholder: '10', required: false },
    ],
    execute: async (v) => {
      return await api.attribute_v1.list({
        page: optNum(v.page),
        limit: optNum(v.limit),
      });
    },
  },
  {
    id: 'attribute_patch',
    label: 'Attribute — patch',
    sdkPath: 'PIM.api.attribute_v1.patch()',
    fields: [
      { name: 'code', label: 'Attribute code', type: 'text', required: true },
      {
        name: 'data',
        label: 'Data',
        type: 'json',
        placeholder: '{"labels": {"en_US": "My Attribute"}}',
        required: true,
      },
    ],
    execute: async (v) => {
      await api.attribute_v1.patch({
        code: str(v.code),
        data: parseOptionalJson(v.data),
      });
      return { success: true };
    },
  },
  {
    id: 'category_list',
    label: 'Categories — list',
    sdkPath: 'PIM.api.category_v1.list()',
    fields: [
      { name: 'page', label: 'Page', type: 'text', placeholder: '1', required: false },
      { name: 'search', label: 'Search', type: 'text', required: false },
    ],
    execute: async (v) => {
      return await api.category_v1.list({
        page: optNum(v.page),
        search: optStr(v.search),
      });
    },
  },
  {
    id: 'product_media_file_list',
    label: 'Product Media Files — list',
    sdkPath: 'PIM.api.product_media_file_v1.list()',
    fields: [
      { name: 'page', label: 'Page', type: 'text', placeholder: '1', required: false },
      { name: 'limit', label: 'Limit', type: 'text', placeholder: '10', required: false },
    ],
    execute: async (v) => {
      return await api.product_media_file_v1.list({
        page: optNum(v.page),
        limit: optNum(v.limit),
      });
    },
  },
  {
    id: 'product_media_file_create',
    label: 'Product Media File — create',
    sdkPath: 'PIM.api.product_media_file_v1.create()',
    fields: [
      { name: 'file', label: 'File', type: 'file', required: true },
      { name: 'identifier', label: 'Product identifier', type: 'text', required: true },
      { name: 'attribute', label: 'Attribute code', type: 'text', required: true },
      { name: 'scope', label: 'Scope', type: 'text', required: false },
      { name: 'locale', label: 'Locale', type: 'text', required: false },
    ],
    execute: async (v) => {
      await api.product_media_file_v1.create({
        file: v.file as File,
        product: {
          identifier: str(v.identifier),
          attribute: str(v.attribute),
          scope: optStr(v.scope),
          locale: optStr(v.locale),
        },
      });
      return { success: true };
    },
  },
  {
    id: 'product_uuid_list',
    label: 'Products (UUID) — list',
    sdkPath: 'PIM.api.product_uuid_v1.list()',
    fields: [
      { name: 'page', label: 'Page', type: 'text', placeholder: '1', required: false },
      { name: 'limit', label: 'Limit', type: 'text', placeholder: '10', required: false },
    ],
    execute: async (v) => {
      return await api.product_uuid_v1.list({
        page: optNum(v.page),
        limit: optNum(v.limit),
      });
    },
  },
  {
    id: 'ref_entity_record_list',
    label: 'Reference Entity Records — list',
    sdkPath: 'PIM.api.reference_entity_record_v1.list()',
    fields: [
      { name: 'referenceEntityCode', label: 'Reference entity code', type: 'text', required: true },
      { name: 'search', label: 'Search', type: 'text', required: false },
      { name: 'channel', label: 'Channel', type: 'text', required: false },
      { name: 'locales', label: 'Locales (comma-separated)', type: 'text', required: false },
    ],
    execute: async (v) => {
      return await api.reference_entity_record_v1.list({
        referenceEntityCode: str(v.referenceEntityCode),
        search: optStr(v.search),
        channel: optStr(v.channel),
        locales: optStr(v.locales),
      });
    },
  },
  {
    id: 'ref_entity_record_upsert',
    label: 'Reference Entity Records — upsert',
    sdkPath: 'PIM.api.reference_entity_record_v1.upsert()',
    fields: [
      { name: 'referenceEntityCode', label: 'Reference entity code', type: 'text', required: true },
      {
        name: 'data',
        label: 'Records data',
        type: 'json',
        placeholder: '[{"code": "my_record", "values": {}}]',
        required: true,
      },
    ],
    execute: async (v) => {
      return await api.reference_entity_record_v1.upsert({
        referenceEntityCode: str(v.referenceEntityCode),
        data: parseOptionalJson(v.data),
      });
    },
  },
];

// --- Error extraction ---

interface ErrorInfo {
  message: string;
  details: unknown;
}

function extractError(err: unknown): ErrorInfo {
  if (!(err instanceof Error)) {
    return { message: String(err), details: null };
  }

  const raw = err as unknown as Record<string, unknown>;

  // API errors typically carry a `response` object (axios-style or fetch-style)
  const response = raw['response'] as Record<string, unknown> | undefined;
  const responseData = response?.['data'] ?? response?.['body'];
  const status = response?.['status'];

  const details: Record<string, unknown> = {};
  if (status !== undefined) details['status'] = status;
  if (responseData !== undefined) details['response'] = responseData;

  // Some SDK errors expose extra fields directly on the error object
  for (const key of ['code', 'errors', 'violations', 'body']) {
    if (raw[key] !== undefined) details[key] = raw[key];
  }

  return {
    message: err.message,
    details: Object.keys(details).length > 0 ? details : null,
  };
}

// --- EndpointCard ---

function EndpointCard({ config }: { config: EndpointConfig }) {
  const [values, setValues] = useState<FieldValues>(() =>
    Object.fromEntries(config.fields.map((f) => [f.name, f.type === 'file' ? null : '']))
  );
  const [status, setStatus] = useState<EndpointStatus>('idle');
  const [result, setResult] = useState<unknown>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  const setValue = (name: string, value: string | File | null) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleRun = async () => {
    setStatus('loading');
    setResult(null);
    setErrorInfo(null);
    try {
      for (const field of config.fields) {
        if (field.required && !values[field.name]) {
          throw new Error(`"${field.label}" is required`);
        }
        if (field.type === 'json' && values[field.name]) {
          JSON.parse(values[field.name] as string);
        }
      }
      const res = await config.execute(values);
      setResult(res);
      setStatus('success');
    } catch (err: unknown) {
      setErrorInfo(extractError(err));
      setStatus('error');
    }
  };

  return (
    <div style={{ border: '1px solid #c7cbd4', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ background: '#f3f4f6', padding: '10px 16px', borderBottom: '1px solid #c7cbd4' }}>
        <div style={{ fontWeight: 700, color: '#11324d', marginBottom: 2 }}>{config.label}</div>
        <code style={{ fontSize: 11, color: '#5c677e' }}>{config.sdkPath}</code>
      </div>

      <div style={{ padding: 16 }}>
        {config.fields.map((field) => (
          <div key={field.name} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 12, color: '#67768a' }}>
              {field.label}
              {field.required && <span style={{ color: '#d4351c', marginLeft: 2 }}>*</span>}
            </label>

            {field.type === 'file' && (
              <input
                type="file"
                onChange={(e) => setValue(field.name, e.target.files?.[0] ?? null)}
                style={{ fontSize: 12 }}
              />
            )}

            {field.type === 'json' && (
              <textarea
                value={str(values[field.name])}
                onChange={(e) => setValue(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  border: '1px solid #c7cbd4',
                  borderRadius: 4,
                  padding: 8,
                  resize: 'vertical',
                  color: '#11324d',
                }}
              />
            )}

            {field.type === 'text' && (
              <TextInput
                value={str(values[field.name])}
                onChange={(v) => setValue(field.name, v)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <Button onClick={handleRun} disabled={status === 'loading'} level="primary" size="small">
            {status === 'loading' ? 'Running…' : 'Run'}
          </Button>
        </div>

        {status === 'success' && (
          <div style={{ marginTop: 12 }}>
            <Helper level="success" inline={false}>
              Success
            </Helper>
            {result !== null && (
              <pre
                style={{
                  marginTop: 8,
                  background: '#f3f4f6',
                  border: '1px solid #c7cbd4',
                  borderRadius: 4,
                  padding: 12,
                  fontSize: 11,
                  overflow: 'auto',
                  maxHeight: 300,
                  color: '#11324d',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}

        {status === 'error' && errorInfo !== null && (
          <div style={{ marginTop: 12 }}>
            <Helper level="error" inline={false}>
              {errorInfo.message}
            </Helper>
            {errorInfo.details !== null && (
              <pre
                style={{
                  marginTop: 8,
                  background: '#fff5f5',
                  border: '1px solid #f5c6cb',
                  borderRadius: 4,
                  padding: 12,
                  fontSize: 11,
                  overflow: 'auto',
                  maxHeight: 300,
                  color: '#721c24',
                }}
              >
                {JSON.stringify(errorInfo.details, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- App ---

function App() {
  return (
    <div>
      <SectionTitle>
        <SectionTitle.Title>API Endpoint Tester</SectionTitle.Title>
      </SectionTitle>
      <p style={{ marginBottom: 20, color: '#67768a', fontSize: 13 }}>
        Fill in the required fields and click <strong>Run</strong> to test each SDK endpoint.
      </p>
      {ENDPOINTS.map((endpoint) => (
        <EndpointCard key={endpoint.id} config={endpoint} />
      ))}
    </div>
  );
}

export default App;
