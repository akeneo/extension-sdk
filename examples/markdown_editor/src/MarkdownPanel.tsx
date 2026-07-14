import { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { AttributeInfo, saveMarkdownValue } from './api';

type Props = {
  productUuid: string;
  attribute: AttributeInfo;
  locale: string;
  scope: string;
  initialMarkdown: string;
  hideModeSwitch: boolean;
  toolbarItems: string[][];
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function MarkdownPanel({
  productUuid,
  attribute,
  locale,
  scope,
  initialMarkdown,
  hideModeSwitch,
  toolbarItems,
}: Props) {
  const editorRef = useRef<Editor>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSave = async () => {
    const editor = editorRef.current?.getInstance();
    if (!editor) return;

    setSaveState('saving');
    try {
      await saveMarkdownValue(productUuid, attribute, locale, scope, editor.getMarkdown());
      setSaveState('saved');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Save failed.');
      setSaveState('error');
    }
  };

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#11324d' }}>
          {attribute.label}
        </div>
        <div style={{ fontSize: '11px', color: '#67768a', marginTop: '2px' }}>
          {attribute.localizable ? locale : 'all locales'} ·{' '}
          {attribute.scopable ? scope : 'all channels'}
        </div>
      </div>

      <Editor
        ref={editorRef}
        initialValue={initialMarkdown}
        initialEditType="wysiwyg"
        hideModeSwitch={hideModeSwitch}
        toolbarItems={toolbarItems}
        height="360px"
        usageStatistics={false}
        autofocus={false}
      />

      <button
        onClick={handleSave}
        disabled={saveState === 'saving'}
        style={{
          padding: '10px 16px',
          backgroundColor: saveState === 'saving' ? '#a1a9b7' : '#5992c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: saveState === 'saving' ? 'default' : 'pointer',
        }}
      >
        {saveState === 'saving' ? 'Saving…' : 'Save'}
      </button>

      {saveState === 'saved' && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#e1f0e3',
            color: '#3d7449',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          Saved. Refresh the page to see the change in the product form.
        </div>
      )}

      {saveState === 'error' && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f7dee4',
            color: '#ad2b4e',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default MarkdownPanel;
