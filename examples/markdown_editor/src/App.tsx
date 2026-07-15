import { useEffect, useState } from 'react';
import { AttributeInfo, fetchAttributeInfo, fetchMarkdownValue } from './api';
import { readEditorConfig } from './config';
import MarkdownPanel from './MarkdownPanel';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; attribute: AttributeInfo; initialMarkdown: string };

function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const config = readEditorConfig();
  const context = globalThis.PIM.context;
  const locale = context.user.catalog_locale;
  const scope = context.user.catalog_scope;
  const productUuid =
    'product' in context && context.product ? context.product.uuid : null;

  useEffect(() => {
    const load = async () => {
      try {
        if (!productUuid) {
          throw new Error('Unable to determine the current product.');
        }

        const attributeCode = config.attributeCode;
        if (!attributeCode) {
          throw new Error(
            "No attribute configured. Set the 'markdown_attribute_code' custom variable on this extension."
          );
        }

        const attribute = await fetchAttributeInfo(attributeCode, locale);
        if (attribute.type !== 'pim_catalog_textarea' && attribute.type !== 'pim_catalog_text') {
          throw new Error(
            `Attribute '${attributeCode}' is of type '${attribute.type}' — expected a text or textarea attribute.`
          );
        }

        const initialMarkdown = await fetchMarkdownValue(productUuid, attribute, locale, scope);
        setState({ status: 'ready', attribute, initialMarkdown });
      } catch (err) {
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'An unknown error occurred.',
        });
      }
    };

    load();
  }, [productUuid, locale, scope]);

  if (state.status === 'loading') {
    return (
      <div style={{ padding: '20px', color: '#67768a', fontSize: '13px' }}>
        Loading markdown editor…
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div
        style={{
          margin: '12px',
          padding: '10px',
          backgroundColor: '#f7dee4',
          color: '#ad2b4e',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        {state.message}
      </div>
    );
  }

  return (
    <MarkdownPanel
      productUuid={productUuid!}
      attribute={state.attribute}
      locale={locale}
      scope={scope}
      initialMarkdown={state.initialMarkdown}
      hideModeSwitch={config.hideModeSwitch}
      toolbarItems={config.toolbarItems}
    />
  );
}

export default App;
