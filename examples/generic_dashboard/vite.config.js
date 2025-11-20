import { createViteConfig } from '../common/vite.config.base';
import tailwindcss from '@tailwindcss/vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default createViteConfig({
  projectName: 'generic_dashboard',
  plugins: [
    tailwindcss(),
    cssInjectedByJs(),
  ],
});
