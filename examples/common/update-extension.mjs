/**
 * This script updates an existing UI extension in the Akeneo PIM.
 *
 * It performs the following steps:
 * 1. Loads environment variables, including the `EXTENSION_UUID` of the extension to be updated.
 * 2. Builds a multipart/form-data payload containing the updated compiled JavaScript file (`dist/demo.js`).
 * 3. Sends a POST request (using a `_method=PATCH` override) to the Akeneo PIM API to update the extension.
 * 4. Confirms that the extension has been updated successfully.
 *
 * This script is intended to be used after the initial creation of the extension to push changes.
 *
 * Usage:
 * `node update-extension.mjs`
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { createExtensionPayload } from './utils.mjs';
import fs from 'fs';
import path from 'path';

dotenv.config({override: true});

const {
    PIM_HOST,
    API_TOKEN,
    EXTENSION_UUID,
    PROJECT_PATH = process.cwd(),
} = process.env;

if (!PIM_HOST || !API_TOKEN) {
    console.error('Error: PIM_HOST and API_TOKEN must be set in your .env file.');
    process.exit(1);
}

if (!EXTENSION_UUID) {
    console.error('Error: EXTENSION_UUID is not set in your .env file. Please create an extension first.');
    process.exit(1);
}

const withCredentials = process.argv.includes('--with-credentials');

const configPath = path.join(PROJECT_PATH, 'extension_configuration.json');
const configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const payload = createExtensionPayload(PROJECT_PATH, withCredentials, configuration);
(async () => {
  try {
    console.log(`Updating extension with UUID: ${EXTENSION_UUID} on ${PIM_HOST}...`);
    await axios.post(
        `${PIM_HOST}/api/rest/v1/ui-extensions/${EXTENSION_UUID}`,
        payload,
        {
            headers: {
            ...payload.getHeaders(),
                Authorization: `Bearer ${API_TOKEN}`,
            },
        }
    );
    console.log('Extension updated successfully!');
  } catch (error) {
    console.error('Error updating extension:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
})();
