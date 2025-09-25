import axios from 'axios';
import dotenv from 'dotenv';
import {updateEnvVar, createExtensionPayload} from './utils.js';

dotenv.config({override: true});

const {
    PIM_HOST,
    API_TOKEN,
    PROJECT_PATH = process.cwd(),
} = process.env;

if (!PIM_HOST || !API_TOKEN) {
    console.error('Error: PIM_HOST and API_TOKEN must be set in your .env file.');
    process.exit(1);
}

const withCredentials = process.argv.includes('--with-credentials');

const payload = createExtensionPayload(PROJECT_PATH, withCredentials);

(async () => {
  try {
    console.log(`Creating extension on ${PIM_HOST}...`);
    const response = await axios.post(
      `${PIM_HOST}/api/rest/v1/ui-extensions`,
      payload,
      {
        headers: {
          ...payload.getHeaders(),
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    const uuid = response.data.uuid;
    if (uuid) {
      updateEnvVar('EXTENSION_UUID', uuid);
      console.log(`Extension created successfully! UUID: ${uuid}`);
      console.log('EXTENSION_UUID has been saved to your .env file.');
    }
  } catch (error) {
    console.error('Error creating extension:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
})();
