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

import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { updateEnvVar } from './utils.mjs';

(async () => {
  dotenv.config({ debug: false });

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const username = process.env.USERNAME;
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
    console.error('Error: Please define CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD and PIM_HOST in the .env file');
    process.exit(1);
  }

  const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const isTokenStillValid = () => {
    if (!tokenCreatedAt) {
      return false;
    }
    return Math.floor(Date.now() / 1000) - parseInt(tokenCreatedAt, 10) < 3600;
  };

  const getNewToken = () => {
    try {
      const response = execSync(
        `curl -s -X POST "${pimHost}/api/oauth/v1/token" \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic ${base64Auth}" \
        -d '{
            "grant_type": "password",
            "username": "${username}",
            "password": "${password}"
        }'`,
        { encoding: 'utf8' }
      );
      const jsonStart = response.indexOf('{');
      const jsonResponse = response.substring(jsonStart);
      return JSON.parse(jsonResponse);
    } catch (error) {
      console.error('Error retrieving a new token:', error);
      process.exit(1);
    }
  };

  const refreshExistingToken = (refreshTokenValue) => {
    try {
      const response = execSync(
        `curl -s -X POST "${pimHost}/api/oauth/v1/token" \
        -H "Content-Type: application/json" \
        -H "Authorization: Basic ${base64Auth}" \
        -d '{
            "refresh_token": "${refreshTokenValue}",
            "grant_type": "refresh_token"
        }'`,
        { encoding: 'utf8' }
      );
      const jsonStart = response.indexOf('{');
      const jsonResponse = response.substring(jsonStart);
      return JSON.parse(jsonResponse);
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
    token = refreshExistingToken(refreshToken);
  } else {
    console.log('Getting new token...');
    token = getNewToken();
  }
  const currentTime = Math.floor(Date.now() / 1000);
  updateEnvVar('API_TOKEN', token.access_token);
  updateEnvVar('REFRESH_TOKEN', token.refresh_token);
  updateEnvVar('TOKEN_CREATED_AT', currentTime.toString());

  console.error('Token saved to .env as API_TOKEN');
})();
