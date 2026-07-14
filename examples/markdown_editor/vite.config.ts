import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// This example intentionally does not use ../common/vite.config.base:
// - ToastUI Editor ships an external stylesheet that must be inlined into the
//   single JS bundle (SES sandbox cannot load CSS files) — hence
//   vite-plugin-css-injected-by-js.
// - The base config's terser property mangling (/^_/) and `unsafe` compress
//   options are not verified against ToastUI/ProseMirror internals; the
//   conservative settings below produce a bundle verified to run in the PIM.
export default defineConfig(({ mode }) => ({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        format: 'es',
        entryFileNames: 'markdown_editor.js',
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
      strictRequires: 'auto',
    },
  },
}));
