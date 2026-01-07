import {useState} from "react";
import {Link, SectionTitle, Button} from "akeneo-design-system";

function App() {
  // Use a direct PDF URL that's more reliable
  const [pdfUrl, setPdfUrl] = useState("https://www.akeneo.com/wp-content/uploads/2021/11/Akeneo_eBook_PIM_101_EN.pdf");
  const [showViewer, setShowViewer] = useState(false);
  const [viewerType, setViewerType] = useState<'iframe' | 'object' | 'google' | 'mozilla' | 'microsoft' | 'pdfobject'>('iframe');
  const [customUrl, setCustomUrl] = useState("");

  const handleShowPdf = (type: 'iframe' | 'object' | 'google' | 'mozilla' | 'microsoft' | 'pdfobject') => {
    setViewerType(type);
    setShowViewer(true);
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      setPdfUrl(customUrl.trim());
      setShowViewer(false);
    }
  };

  // Mozilla PDF.js hosted viewer (most reliable)
  const mozillaViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  // Google Docs Viewer (sometimes unreliable)
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

  // Microsoft Office Online Viewer
  const microsoftViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pdfUrl)}`;

  // PDF.js viewer from cdnjs (alternative Mozilla hosting)
  const cdnjsViewerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  const getViewerUrl = () => {
    switch (viewerType) {
      case 'mozilla': return mozillaViewerUrl;
      case 'google': return googleViewerUrl;
      case 'microsoft': return microsoftViewerUrl;
      case 'pdfobject': return cdnjsViewerUrl;
      default: return pdfUrl;
    }
  };

  const getViewerName = () => {
    switch (viewerType) {
      case 'mozilla': return 'Mozilla PDF.js Viewer';
      case 'google': return 'Google Docs Viewer';
      case 'microsoft': return 'Microsoft Office Viewer';
      case 'pdfobject': return 'CDNJS PDF.js Viewer';
      default: return viewerType;
    }
  };

  return <>
    <div style={{
      marginTop: '20px',
      padding: '40px',
      border: '2px solid #5E2CA5',
      borderRadius: '4px',
      textAlign: 'center',
      backgroundColor: '#fafafa'
    }}>

      <div style={{ marginBottom: '10px', fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
        Select a viewer:
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
        <Button onClick={() => handleShowPdf('mozilla')} level="secondary">
          Mozilla PDF.js
        </Button>
        <Button onClick={() => handleShowPdf('pdfobject')} level="secondary" ghost>
          CDNJS PDF.js
        </Button>
        <Button onClick={() => handleShowPdf('microsoft')} level="secondary" ghost>
          Microsoft Office
        </Button>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '13px', color: '#666' }}>
        Alternative / Testing:
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => handleShowPdf('google')} level="tertiary" ghost>
          Google Viewer
        </Button>
        <Button onClick={() => handleShowPdf('iframe')} level="tertiary" ghost>
          Direct Iframe
        </Button>
        <Button onClick={() => handleShowPdf('object')} level="tertiary" ghost>
          Object Tag
        </Button>
      </div>

      <p style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
        PDF Size: ~2.5 MB | 48 pages
      </p>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'left' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
          Custom PDF URL:
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter PDF URL (e.g., https://example.com/file.pdf)"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace'
            }}
          />
          <Button onClick={handleCustomUrl} level="secondary" disabled={!customUrl.trim()}>
            Load URL
          </Button>
        </div>
        <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666' }}>
          Tip: Try a different PDF if the current one has CORS issues
        </p>
      </div>
    </div>

    {showViewer && (
      <>
        <SectionTitle>
          <SectionTitle.Title level="secondary">
            PDF Viewer ({getViewerName()})
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
          {viewerType === 'iframe' && (
            <iframe
              src={getViewerUrl()}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="PDF Viewer"
            />
          )}

          {viewerType === 'object' && (
            <object
              data={getViewerUrl()}
              type="application/pdf"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            >
              <p style={{ padding: '20px', textAlign: 'center' }}>
                Your browser doesn't support embedded PDFs or the PDF was blocked.
              </p>
            </object>
          )}

          {(viewerType === 'google' || viewerType === 'mozilla' || viewerType === 'microsoft' || viewerType === 'pdfobject') && (
            <iframe
              src={getViewerUrl()}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="PDF Viewer"
            />
          )}
        </div>

        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #4caf50', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#2e7d32' }}>
            {viewerType === 'mozilla' && '✓ Mozilla PDF.js - Full featured viewer with all pages, zoom, search, and navigation'}
            {viewerType === 'pdfobject' && '✓ CDNJS PDF.js - Alternative Mozilla PDF.js hosting via Cloudflare CDN'}
            {viewerType === 'microsoft' && '✓ Microsoft Office Viewer - Enterprise-grade viewer, may have different UI/UX'}
            {viewerType === 'google' && '⚠️ Google Docs Viewer - May only show first page or timeout, not recommended'}
            {(viewerType === 'iframe' || viewerType === 'object') && '⚠️ Direct embedding - Likely blocked by server CORS/X-Frame-Options headers'}
          </p>
        </div>
      </>
    )}

    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>
        <strong>Current PDF URL:</strong><br/>
        <Link href={pdfUrl} target="_blank" style={{ wordBreak: 'break-all', fontSize: '12px' }}>{pdfUrl}</Link>
      </p>
      <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
        <strong>Note:</strong> If you see "invalid file type: html" error, it means the PDF URL is being blocked or redirected by CORS.
        Try opening the URL in a new tab first to verify it's accessible, or try the Microsoft Office viewer which handles CORS differently.
      </p>
    </div>
  </>
}

export default App
