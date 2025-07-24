#!/usr/bin/env node
/**
 * KONIVRER Git Hook Setup
 * 
 * This script sets up Git hooks to automatically start the development environment
 * when the repository is cloned or updated.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const gitHooksDir = path.join(process.cwd(), '.git', 'hooks');
const postCheckoutHookPath = path.join(gitHooksDir, 'post-checkout');
const postMergeHookPath = path.join(gitHooksDir, 'post-merge');
const postCloneHookPath = path.join(gitHooksDir, 'post-clone');

// Create hooks directory if it doesn't exist
if (!fs.existsSync(gitHooksDir)) {
  console.log('[SETUP] Creating Git hooks directory...');
  fs.mkdirSync(gitHooksDir, { recursive: true });
}

// Post-checkout hook content (runs after git checkout)
const postCheckoutHook = `#!/bin/bash
# Auto-start development environment after checkout
./auto-init.sh &
`;

// Post-merge hook content (runs after git pull)
const postMergeHook = `#!/bin/bash
# Auto-start development environment after pull
./auto-init.sh &
`;

// Post-clone hook content (runs after git clone)
const postCloneHook = `#!/bin/bash
# Auto-start development environment after clone
./auto-init.sh &
`;

// Write hooks
console.log('[SETUP] Setting up Git hooks for auto-start...');

// Post-checkout hook
fs.writeFileSync(postCheckoutHookPath, postCheckoutHook);
fs.chmodSync(postCheckoutHookPath, '755');
console.log('[SETUP] Created post-checkout hook');

// Post-merge hook
fs.writeFileSync(postMergeHookPath, postMergeHook);
fs.chmodSync(postMergeHookPath, '755');
console.log('[SETUP] Created post-merge hook');

// Post-clone hook
fs.writeFileSync(postCloneHookPath, postCloneHook);
fs.chmodSync(postCloneHookPath, '755');
console.log('[SETUP] Created post-clone hook');

// Make auto-init.sh executable
const autoInitPath = path.join(process.cwd(), 'auto-init.sh');
if (fs.existsSync(autoInitPath)) {
  fs.chmodSync(autoInitPath, '755');
  console.log('[SETUP] Made auto-init.sh executable');
}

// Run auto-init.sh in the background
try {
  console.log('[SETUP] Starting auto-init.sh in the background...');
  execSync('./auto-init.sh &', { stdio: 'inherit' });
} catch (error) {
  console.error('[ERROR] Error starting auto-init.sh:', error.message);
}

console.log('[SETUP] Git hooks setup complete! The development environment will now start automatically when you clone or update the repository.');