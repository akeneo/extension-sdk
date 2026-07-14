// Editor options driven by extension custom variables — editable in the PIM
// (Connect → UI extensions) without rebuilding the bundle.

const VALID_TOOLBAR_ITEMS = new Set([
  'heading',
  'bold',
  'italic',
  'strike',
  'hr',
  'quote',
  'ul',
  'ol',
  'task',
  'indent',
  'outdent',
  'table',
  'image',
  'link',
  'code',
  'codeblock',
]);

const DEFAULT_TOOLBAR: string[][] = [
  ['heading', 'bold'],
  ['ul', 'ol'],
];

export type EditorConfig = {
  attributeCode: string | null;
  hideModeSwitch: boolean;
  toolbarItems: string[][];
};

// Toolbar syntax: comma-separated items, pipe-separated groups,
// e.g. "heading,bold|ul,ol|link". Unknown items are ignored.
function parseToolbarItems(value: unknown): string[][] {
  if (typeof value !== 'string' || value.trim() === '') return DEFAULT_TOOLBAR;

  const groups = value
    .split('|')
    .map((group) =>
      group
        .split(',')
        .map((item) => item.trim())
        .filter((item) => VALID_TOOLBAR_ITEMS.has(item))
    )
    .filter((group) => group.length > 0);

  return groups.length > 0 ? groups : DEFAULT_TOOLBAR;
}

function parseBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return defaultValue;
}

export function readEditorConfig(): EditorConfig {
  const variables = globalThis.PIM.custom_variables ?? {};

  const attributeCode = variables.markdown_attribute_code;

  return {
    attributeCode: typeof attributeCode === 'string' && attributeCode !== '' ? attributeCode : null,
    hideModeSwitch: parseBoolean(variables.hide_mode_switch, false),
    toolbarItems: parseToolbarItems(variables.toolbar_items),
  };
}
