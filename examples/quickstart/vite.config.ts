import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import swc from 'unplugin-swc'
import { readFileSync } from 'fs';
import path from 'path';

const configPath = path.resolve(__dirname, 'extension_configuration.json');
const configuration = JSON.parse(readFileSync(configPath, 'utf8'));
const fileName = configuration.file.split('/').pop()?.replace('.js', '');

export default defineConfig(({ mode }) => ({
  plugins: [
    // React plugin configuration with options to automatically import React
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
    // SWC configuration with enhanced React support
    // SWC (Speedy Web Compiler) is a super-fast TypeScript/JavaScript compiler written in Rust
    // that significantly improves build times compared to Babel or TypeScript compiler
    swc.vite({
      jsc: {
        target: 'es2020',
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic'
          }
        }
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'demo',
      fileName: fileName,
      formats: ['es'],
    },
    // Optimizations for development
    ...(mode === 'development' && {
      minify: false,
      sourcemap: false,  // Changed from 'inline' to false for faster builds
      cssCodeSplit: false,
      emptyOutDir: false,
      reportCompressedSize: false,  // Disable compressed size reporting to speed up build
      chunkSizeWarningLimit: Infinity,  // Disable chunk size warnings
    })
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: {},
    process: {
      env: {},
    },
  },
  // Development cache optimization
  ...(mode === 'development' && {
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: false,
      esbuildOptions: {
        target: 'es2020',
        treeShaking: false  // Disable tree shaking in dev mode for faster builds
      }
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      target: 'es2020',
      treeShaking: false,
      legalComments: 'none',
    }
  })
}))
