#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

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

if (!clientId || !clientSecret || !username || !password || !pimHost) {
  console.error('Error: Please define CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD and PIM_HOST in the .env file');
  process.exit(1);
}

const base64Auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

const updateToken = () => {
  // If APP_TOKEN is defined, always use it and ignore refresh logic
  if (appToken) {
    console.error('APP_TOKEN in the .env file. Using it.');
    updateEnvVar('API_TOKEN', appToken);
    return appToken;
  }

  if (apiToken && isTokenStillValid()) {
    console.log('API_TOKEN still valid. Using it.');
    return apiToken;
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

  // Update environment variables with the new token
  const currentTime = Math.floor(Date.now() / 1000);
  updateEnvVar('API_TOKEN', token.access_token);
  updateEnvVar('REFRESH_TOKEN', token.refresh_token);
  updateEnvVar('TOKEN_CREATED_AT', currentTime.toString());

  console.error('Token saved to .env as API_TOKEN');
};

const isTokenStillValid = () => {
  if (!tokenCreatedAt) {
    return false;
  }

  return Math.floor(Date.now() / 1000) - parseInt(tokenCreatedAt, 10) < 3600;
};

const getNewToken = () => {
  try {
    const response = execSync(
      `curl -s -X POST "${pimHost}/api/oauth/v1/token" \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Basic ${base64Auth}" \\
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
      `curl -s -X POST "${pimHost}/api/oauth/v1/token" \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Basic ${base64Auth}" \\
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

const updateEnvVar = (key, value) => {
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

// Main function
updateToken();

export default updateToken;
