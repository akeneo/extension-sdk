# PDF Viewer Extension

A simple Akeneo PIM extension that displays PDF files from external sources using Mozilla PDF.js viewer.

## Overview

This extension demonstrates how to embed and display PDF documents within Akeneo PIM using the Extension SDK. It uses Mozilla's PDF.js viewer to render PDF files reliably across all browsers.

## Features

- Display PDF files from any publicly accessible URL
- User-friendly input field for entering PDF URLs
- Powered by Mozilla PDF.js viewer for consistent cross-browser experience
- Full-featured PDF viewing: zoom, search, page navigation, download, and more
- Clean, responsive interface using Akeneo Design System

## Why Mozilla PDF.js?

We chose Mozilla PDF.js as the PDF rendering engine for several important reasons:

1. **Cross-browser compatibility**: Unlike native browser PDF viewers, PDF.js works consistently across all modern browsers
2. **Feature-rich**: Provides a complete viewing experience with zoom controls, text search, page navigation, and printing capabilities
3. **No CORS issues**: The hosted PDF.js viewer handles cross-origin PDFs more reliably than direct iframe embedding
4. **Open source and maintained**: Mozilla actively maintains PDF.js, ensuring security updates and compatibility with evolving PDF standards
5. **No dependencies**: Uses Mozilla's hosted version, requiring no additional setup or library installation
6. **Professional appearance**: Provides a polished, familiar PDF viewing interface that users expect

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Configuration

The extension is configured via `extension_configuration.json`:

- **position**: Where the extension appears in Akeneo PIM (`pim.activity.navigation.tab`)
- **name**: Unique identifier for the extension
- **file**: Path to the built JavaScript file
- **labels**: Display labels in different locales

## Usage

1. Open the extension in Akeneo PIM
2. Enter a publicly accessible PDF URL in the input field
3. Click "Load PDF" or press Enter
4. The PDF will be displayed using Mozilla's PDF.js viewer

**Example PDF URLs you can try:**
- `https://www.akeneo.com/wp-content/uploads/2021/11/Akeneo_eBook_PIM_101_EN.pdf`
- Any other publicly accessible PDF URL

## Customization

You can customize this extension in several ways:

- **Dynamic PDF loading**: Integrate with Akeneo's context data to automatically load PDFs based on the current product or category
- **Styling**: Modify the UI appearance in `src/App.tsx` to match your brand
- **Default URLs**: Pre-populate the input field with a default URL based on user context
- **Validation**: Add URL validation to ensure only valid PDF URLs are accepted

## Architecture

- **App.tsx**: Main component with PDF viewer logic
- **main.tsx**: Application entry point
- **index.html**: HTML template
- **vite.config.ts**: Vite build configuration

### Technical Details

The extension uses Mozilla's hosted PDF.js viewer (`https://mozilla.github.io/pdf.js/web/viewer.html`) to render PDFs. The PDF URL is passed as a query parameter to the viewer:

```typescript
const mozillaViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
```

The viewer is embedded in an iframe, providing a sandboxed environment for PDF rendering. This approach:
- Avoids Content Security Policy (CSP) restrictions
- Provides consistent rendering across all browsers
- Handles CORS and X-Frame-Options headers more reliably than direct embedding

## Browser Compatibility

This extension works across all modern browsers:
- Chrome, Firefox, Edge, Safari (desktop and mobile)
- Consistent viewing experience regardless of browser
- No plugins or additional software required
