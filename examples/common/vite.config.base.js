/**
 * Shared Vite Configuration for Akeneo Extension SDK Examples
 *
 * This base configuration provides optimized settings for both production and development builds:
 * - Production: Optimized for minimal bundle size (Terser minification, tree-shaking)
 * - Development: Optimized for fastest build time (no minification, no tree-shaking)
 *
 * CRITICAL: commonjsOptions.strictRequires: 'auto' enables tree-shaking and reduces
 * bundle size by 8.3x! Never remove this setting.
 *
 * Usage in your vite.config.js:
 * ```js
 * import { createViteConfig } from '../common/vite.config.base.js';
 * export default createViteConfig({
 *   projectName: 'my-extension',
 *   plugins: [tailwindcss()], // optional additional plugins
 * });
 * ```
 */

import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import swc from 'unplugin-swc';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Creates an optimized Vite configuration for Akeneo extensions
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.projectName='extension'] - Name of the project
 * @param {Array} [options.plugins=[]] - Additional Vite plugins
 * @param {Object} [options.alias={}] - Additional path aliases
 * @param {string} [options.configPath='./extension_configuration.json'] - Path to extension config
 */
export function createViteConfig(options = {}) {
  const {
    projectName = 'extension',
    plugins = [],
    alias = {},
    configPath = './extension_configuration.json',
  } = options;

  return defineConfig(({ mode }) => {
    // Read extension configuration to get output filename
    const fullConfigPath = path.resolve(process.cwd(), configPath);
    const configuration = JSON.parse(readFileSync(fullConfigPath, 'utf8'));
    const fileName = configuration.file.split('/').pop()?.replace('.js', '');

    return {
      plugins: [
        // React plugin with automatic JSX runtime
        react({
          jsxRuntime: 'automatic',
          jsxImportSource: 'react',
          babel: {
            plugins: [
              ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
            ]
          }
        }),
        // SWC for fast TypeScript/JSX transpilation
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
        }),
        // Include additional project-specific plugins
        ...plugins,
      ],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), './src'),
          ...alias,
        },
      },
      build: {
        lib: {
          entry: resolve(process.cwd(), 'src/main.tsx'),
          name: projectName,
          fileName: fileName,
          formats: ['es'],
        },
        // Production vs Development configurations
        ...(mode === 'production' ? {
          // PRODUCTION: Optimize for size
          minify: 'terser',
          cssMinify: true,
          terserOptions: {
            // @ts-ignore - terser options are correctly typed but Vite's types may be outdated
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
        } : {
          // DEVELOPMENT: Optimize for speed
          minify: false,
          cssMinify: false,
          cssCodeSplit: false,
          emptyOutDir: false,
          reportCompressedSize: false,
          chunkSizeWarningLimit: Infinity,
        }),
        sourcemap: false,  // Set to 'inline' in dev if you need debugging (3x larger bundle)
        rollupOptions: {
          ...(mode === 'production' && {
            treeshake: {
              moduleSideEffects: (id) => {
                // Force tree-shaking for design system libraries
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
          }),
        },
        // CRITICAL: Enables tree-shaking for CommonJS modules
        // Without this, bundle size increases by 8.3x!
        commonjsOptions: {
          strictRequires: 'auto',
        },
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
    };
  });
}
