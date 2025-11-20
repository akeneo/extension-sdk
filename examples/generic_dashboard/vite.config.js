import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs';
import swc from 'unplugin-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { resolve } from 'path'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

const configPath = path.resolve(__dirname, 'extension_configuration.json');
const configuration = JSON.parse(readFileSync(configPath, 'utf8'));
const fileName = configuration.file.split('/').pop()?.replace('.js', '');

export default defineConfig(({ mode }) => ({
  plugins: [
    // React plugin configuration with options to automatically import React
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
      tailwindcss(),
      cssInjectedByJs(),
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'generic_dashboard',
      fileName: fileName,
      formats: ['es'],
    },
    minify: 'terser',
    sourcemap: false,
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id) => {
          // Force tree-shaking for akeneo-design-system
          return !id.includes('akeneo-design-system');
        },
      },
      output: {
        minifyInternalExports: true,
        compact: true,
        generatedCode: {
          constBindings: true,
        },
      }
    },
    commonjsOptions: {
      strictRequires: 'auto',
    },
    // Optimizations for development
    ...(mode === 'development' && {
      minify: false,
      sourcemap: false,
      cssCodeSplit: false,
      emptyOutDir: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: Infinity,
    })
  },
  esbuild: {
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
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
