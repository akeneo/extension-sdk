import { updateEnvVar } from './utils.mjs';

const key = process.argv[2];
const value = process.argv[3];

if (!key || value === undefined) {
  console.error('Usage: node set-env.mjs <KEY> <VALUE>');
  process.exit(1);
}

updateEnvVar(key, value);

