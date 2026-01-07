# PDF Viewer Extension

A simple Akeneo PIM extension that displays PDF files from external sources.

## Overview

This extension demonstrates how to embed and display PDF documents within Akeneo PIM using the Extension SDK. It uses an iframe to render the PDF directly in the browser.

## Features

- Display PDF files from external URLs
- Clean, responsive interface using Akeneo Design System
- Easy to customize for different PDF sources

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

## Customization

To display a different PDF, edit the `pdfUrl` constant in `src/App.tsx`:

```typescript
const pdfUrl = "https://your-pdf-url-here.pdf";
```

You can also modify the iframe styling, add controls, or integrate with Akeneo's context data to dynamically load PDFs based on the current product or category.

## Architecture

- **App.tsx**: Main component with PDF viewer logic
- **main.tsx**: Application entry point
- **index.html**: HTML template
- **vite.config.ts**: Vite build configuration

### Technical Details

The extension uses Akeneo's **External Gateway API** (`globalThis.PIM.api.external.call()`) to fetch the PDF. This is necessary because Akeneo PIM has Content Security Policy (CSP) restrictions that prevent direct `fetch()` calls to external domains. The External Gateway API bypasses these restrictions securely.

## Browser Compatibility

This extension uses an iframe to display PDFs. Browser support may vary:
- Modern browsers (Chrome, Firefox, Edge) have built-in PDF viewers
- Some browsers may prompt to download the PDF instead

For better cross-browser compatibility, consider using a dedicated PDF viewer library like PDF.js.
