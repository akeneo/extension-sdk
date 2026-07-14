/**
 * This script manages the OAuth2 authentication process with the Akeneo PIM API.
 * It retrieves an API token, stores it in the .env file, and handles token expiration
 * by refreshing it when necessary.
 *
 * The script performs the following steps:
 * 1. Loads environment variables from the .env file.
 * 2. Checks for the presence of an APP_TOKEN. If found, it uses it directly.
 * 3. Checks if an existing API_TOKEN is still valid (less than 1 hour old).
 * 4. If the token is expired or missing, it tries to refresh it using the REFRESH_TOKEN.
 * 5. If refreshing fails or no REFRESH_TOKEN is available, it requests a new token using password credentials.
 * 6. The new token, refresh token, and creation timestamp are saved to the .env file for subsequent uses.
 */

import dotenv from 'dotenv';
import { updateEnvVar } from './utils.mjs';

(async () => {
  dotenv.config({ debug: false });

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const username = process.env.PIM_USERNAME;
  const password = process.env.PASSWORD;
  const pimHost = process.env.PIM_HOST;
  const apiToken = process.env.API_TOKEN;
  const refreshToken = process.env.REFRESH_TOKEN;
  const tokenCreatedAt = process.env.TOKEN_CREATED_AT;
  const appToken = process.env.APP_TOKEN;

  // If APP_TOKEN is defined, always use it and ignore refresh logic
  if (appToken) {
    console.error('APP_TOKEN in the .env file. Using it.');
    updateEnvVar('API_TOKEN', appToken);
    return;
  }

  if (!clientId || !clientSecret || !username || !password || !pimHost) {
    console.error('Error: Please define CLIENT_ID, CLIENT_SECRET, PIM_USERNAME, PASSWORD and PIM_HOST in the .env file');
    process.exit(1);
  }

  const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const isTokenStillValid = () => {
    if (!tokenCreatedAt) {
      return false;
    }
    return Math.floor(Date.now() / 1000) - parseInt(tokenCreatedAt, 10) < 3600;
  };

  const postToken = async (body) => {
    const response = await fetch(`${pimHost}/api/oauth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64Auth}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };

  const getNewToken = async () => {
    try {
      return await postToken({ grant_type: 'password', username, password });
    } catch (error) {
      console.error('Error retrieving a new token:', error);
      process.exit(1);
    }
  };

  const refreshExistingToken = async (refreshTokenValue) => {
    try {
      return await postToken({ grant_type: 'refresh_token', refresh_token: refreshTokenValue });
    } catch (error) {
      console.error('Error refreshing token:', error);
      console.error('Refresh token failed, getting a new token...');
      return getNewToken();
    }
  };

  // Main execution
  if (apiToken && isTokenStillValid()) {
    console.log('API_TOKEN still valid. Using it.');
    return;
  }
  // API_TOKEN has expired or doesn't exist: refresh or get a new one
  let token;
  if (refreshToken) {
    console.log('Refreshing token...');
    token = await refreshExistingToken(refreshToken);
  } else {
    console.log('Getting new token...');
    token = await getNewToken();
  }
  const currentTime = Math.floor(Date.now() / 1000);
  updateEnvVar('API_TOKEN', token.access_token);
  updateEnvVar('REFRESH_TOKEN', token.refresh_token);
  updateEnvVar('TOKEN_CREATED_AT', currentTime.toString());

  console.error('Token saved to .env as API_TOKEN');
})();
