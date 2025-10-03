/**
 * This file provides utility functions used by other scripts in this directory.
 *
 * It includes functions for:
 * - `updateEnvVar`: Safely updates or adds a key-value pair to the project's .env file.
 *   It preserves existing content and formatting.
 * - `createExtensionPayload`: Constructs the multipart/form-data payload required for creating
 *   or updating a UI extension via the Akeneo PIM API. It reads the project's `package.json`
 *   for metadata and attaches the compiled `dist/demo.js` file.
 */

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

export const createExtensionPayload = (projectPath, withCredentials, configuration) => {
  const payload = new FormData();
  payload.append('name', configuration.name);
  payload.append('type', configuration.type);
  payload.append('position', configuration.position);
  payload.append('file', fs.createReadStream(path.join(projectPath, configuration.file)));
  payload.append('configuration[default_label]', configuration.configuration.default_label);

  if (configuration.configuration.labels) {
    for (const [locale, label] of Object.entries(configuration.configuration.labels)) {
      payload.append(`configuration[labels][${locale}]`, label);
    }
  }

  if (withCredentials && configuration.credentials) {
    configuration.credentials.forEach((credential, index) => {
      payload.append(`credentials[${index}][code]`, credential.code);
      payload.append(`credentials[${index}][type]`, credential.type);

      if (typeof credential.value === 'object' && credential.value !== null) {
        for (const [key, value] of Object.entries(credential.value)) {
          payload.append(`credentials[${index}][value][${key}]`, value);
        }
      } else {
        payload.append(`credentials[${index}][value]`, credential.value);
      }
    });
  }

  return payload;
};
