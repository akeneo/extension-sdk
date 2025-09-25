import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import FormData from 'form-data';

export const updateEnvVar = (key, value) => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const envPath = path.resolve(process.cwd(), '.env');

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
  const payload = new FormData();
  payload.append('name', 'sdk_script_extension');
  payload.append('type', 'sdk_script');
  payload.append('position', 'pim.product.panel');
  payload.append('file', fs.createReadStream(path.join(projectPath, 'dist/demo.js')));
  payload.append('configuration[labels][en_US]', 'SDK script test extension');
  payload.append('configuration[default_label]', 'SDK script test extension');

  if (withCredentials) {
    payload.append('credentials[0][code]', 'credential_code_example');
    payload.append('credentials[0][type]', 'Bearer Token');
    payload.append('credentials[0][value]', 'token_value');
  }

  return payload;
};
