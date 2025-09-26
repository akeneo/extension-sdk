import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs';
import path from 'path';

const configPath = path.resolve(__dirname, 'extension_configuration.json');
const configuration = JSON.parse(readFileSync(configPath, 'utf8'));
const fileName = configuration.file.split('/').pop()?.replace('.js', '');

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'demo',
      fileName: fileName,
      formats: ['es'],
    }
  },
  define: {
    global: {},
    process: {
      env: {},
    },
  },
})
