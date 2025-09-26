/**
 * This script provides a "watch" functionality for hot-reloading during development.
 *
 * It uses `chokidar` to monitor the `src/` directory for any file changes.
 * When a change is detected, it automatically triggers the `make update-dev` command.
 * This command rebuilds the project with development settings and pushes the update
 * to the Akeneo PIM, allowing developers to see their changes in near real-time
 * without manual intervention.
 *
 * Usage:
 * `node watch.mjs` (typically run via `make watch`)
 */

import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';

// Configuration
const DEBOUNCE_TIME = 1000;
const DIRECTORY_TO_WATCH = path.resolve(process.cwd(), 'src');
const UPDATE_COMMAND = 'make update-dev';
const GET_TOKEN_COMMAND = 'make get-token';

let timeout = null;
let isRunning = false;

function update() {
    if (isRunning) return;
    isRunning = true;
    console.log('Changes has been detected...');
    exec(GET_TOKEN_COMMAND, (tokenError, tokenStdout, tokenStderr) => {
        if (tokenError) {
            console.error(`Token error: ${tokenError.message}`);
            isRunning = false;
            return;
        }
        if (tokenStderr) console.error(`Token stderr: ${tokenStderr}`);
        if (tokenStdout) console.log(`Token stdout: ${tokenStdout}`);
        exec(UPDATE_COMMAND, (error, stdout, stderr) => {
            if (error) console.error(`error: ${error.message}`);
            if (stderr) console.error(`stderr: ${stderr}`);
            if (stdout) console.log(`stdout: ${stdout}`);
            isRunning = false;
            console.log('Update process completed successfully');
        });
    });
}

console.log(`Watch: ${DIRECTORY_TO_WATCH}`);
const watcher = chokidar.watch(DIRECTORY_TO_WATCH, {
    persistent: true,
    ignoreInitial: true
});

watcher.on('all', (event, path) => {
    console.log(`Change: ${path}`);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        if (!isRunning) update();
    }, DEBOUNCE_TIME);
});
