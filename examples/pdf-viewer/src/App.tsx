import {useState} from "react";
import {SectionTitle, Button} from "akeneo-design-system";

function App() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const handleLoadPdf = () => {
    if (inputUrl.trim()) {
      setPdfUrl(inputUrl.trim());
    }
  };

  const mozillaViewerUrl = pdfUrl
    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`
    : '';

  return <>
    <div style={{
      marginTop: '20px',
      padding: '40px',
      border: '2px solid #5E2CA5',
      borderRadius: '4px',
      backgroundColor: '#fafafa'
    }}>
      <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
        PDF Viewer
      </div>

      <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
          Enter PDF URL:
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoadPdf()}
            placeholder="https://example.com/file.pdf"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}
          />
          <Button onClick={handleLoadPdf} level="secondary" disabled={!inputUrl.trim()}>
            Load PDF
          </Button>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
          Enter a publicly accessible PDF URL and press "Load PDF" to view it
        </p>
      </div>
    </div>

    {pdfUrl && (
      <>
        <SectionTitle>
          <SectionTitle.Title level="secondary">
            Mozilla PDF.js Viewer
          </SectionTitle.Title>
        </SectionTitle>

        <div style={{
          marginTop: '20px',
          width: '100%',
          height: '800px',
          border: '2px solid #4caf50',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}>
          <iframe
            src={mozillaViewerUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="PDF Viewer"
          />
        </div>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#2e7d32' }}>
            Viewing: {pdfUrl}
          </p>
        </div>
      </>
    )}
  </>
}

export default App
