import { updateEnvVar } from './utils.js';

const key = process.argv[2];
const value = process.argv[3];

if (!key || value === undefined) {
  console.error('Usage: node set-env.js <KEY> <VALUE>');
  process.exit(1);
}

updateEnvVar(key, value);

