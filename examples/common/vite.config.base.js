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

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

// Target ECMAScript version for all build tools
const ES_TARGET = 'es2020';

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
    const isProduction = mode === 'production';
    const isDevelopment = mode === 'development';

    // Read extension configuration to get output filename
    const fullConfigPath = path.resolve(process.cwd(), configPath);
    const configuration = JSON.parse(readFileSync(fullConfigPath, 'utf8'));
    const fileName = configuration.file.split('/').pop()?.replace('.js', '');

    return {
      plugins: [
        // React plugin with automatic JSX runtime
        react({
          jsxRuntime: 'automatic',
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
          entry: path.resolve(process.cwd(), 'src/main.tsx'),
          name: projectName,
          fileName: fileName,
          formats: ['es'],
        },
        // Production: Optimize for size
        minify: isProduction ? 'terser' : false,
        cssMinify: isProduction,
        ...(isProduction && {
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
              ecma: 2020, // Must be number for Terser
            },
          },
        }),
        // Development: Optimize for speed
        ...(isDevelopment && {
          cssCodeSplit: false,
          emptyOutDir: false,
          reportCompressedSize: false,
          chunkSizeWarningLimit: Infinity,
        }),
        sourcemap: isDevelopment ? 'inline' : false,
        rollupOptions: {
          ...(isProduction && {
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
      },
      // Development: Cache and build optimization
      ...(isDevelopment && {
        optimizeDeps: {
          include: ['react', 'react-dom'],
          force: false,
          esbuildOptions: {
            target: ES_TARGET,
          }
        },
        esbuild: {
          logOverride: { 'this-is-undefined-in-esm': 'silent' },
          target: ES_TARGET,
          legalComments: 'none',
        }
      })
    };
  });
}
