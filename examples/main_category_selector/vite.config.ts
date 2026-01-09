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
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
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
      name: 'main_category_selector',
      fileName: fileName,
      formats: ['es'],
    },
    ...(mode === 'development' && {
      minify: false,
      sourcemap: false,
      cssCodeSplit: false,
      emptyOutDir: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: Infinity,
    })
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: {},
    process: {
      env: {},
    },
  },
  ...(mode === 'development' && {
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: false,
      esbuildOptions: {
        target: 'es2020',
        treeShaking: false
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
