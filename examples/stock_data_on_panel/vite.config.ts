import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'demo',
      fileName: 'demo',
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
