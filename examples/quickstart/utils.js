import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FormData from 'form-data';

export const updateEnvVar = (key, value) => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const envPath = path.resolve(__dirname, '.env');

    let envData = {};
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envData = dotenv.parse(envContent);
    }

    // Update with the new value
    envData[key] = value;

    // Convert back to .env format
    let envContent = '';
    for (const [k, v] of Object.entries(envData)) {
      if (v !== undefined && v !== null) {
        envContent += `${k}=${v}\n`;
      }
    }

    fs.writeFileSync(envPath, envContent.trim());
  } catch (error) {
    console.error(`Error updating ${key} in .env:`, error);
  }
};

export const createExtensionPayload = (projectPath, withCredentials) => {
  const form = new FormData();
  form.append('name', 'sdk_script_extension');
  form.append('type', 'sdk_script');
  form.append('position', 'pim.product.panel');
  form.append('file', fs.createReadStream(path.join(projectPath, 'dist/demo.js')));
  form.append('configuration[labels][en_US]', 'SDK script test extension');
  form.append('configuration[default_label]', 'SDK script test extension');

  if (withCredentials) {
    form.append('credentials[0][code]', 'credential_code_example');
    form.append('credentials[0][type]', 'Bearer Token');
    form.append('credentials[0][value]', 'token_value');
  }

  return form;
};
