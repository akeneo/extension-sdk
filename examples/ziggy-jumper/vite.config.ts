import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'DoodleJump',
      fileName: () => 'doodle_jump.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: 'doodle_jump.[ext]',
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
  },
});