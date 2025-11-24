import { UserConfig } from 'vite';

export interface ViteConfigOptions {
  projectName?: string;
  plugins?: any[];
  alias?: Record<string, string>;
  configPath?: string;
}

export function createViteConfig(options?: ViteConfigOptions): UserConfig;
