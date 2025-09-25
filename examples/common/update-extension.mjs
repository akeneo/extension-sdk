import axios from 'axios';
import dotenv from 'dotenv';
import { createExtensionPayload } from './utils.mjs';

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

const payload = createExtensionPayload(PROJECT_PATH, withCredentials);

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

