/**
 * This script updates a specific key-value pair in the project's .env file.
 *
 * It takes two command-line arguments: the key and the value to be updated.
 * The script reads the existing .env file, updates the specified key with the new value
 * (or adds it if it doesn't exist), and writes the changes back to the file.
 *
 * This is used by the `make start` command to programmatically set up the
 * environment variables based on user input.
 *
 * Usage:
 * `node set-env.mjs KEY_TO_UPDATE "new value"`
 */

import { updateEnvVar } from './utils.mjs';

const key = process.argv[2];
const value = process.argv[3];

if (!key || value === undefined) {
  console.error('Usage: node set-env.mjs <KEY> <VALUE>');
  process.exit(1);
}

updateEnvVar(key, value);
