#!/usr/bin/env node
/**
 * KONIVRER Auto-Start System
 * 
 * This script automatically starts the fully autonomous development system.
 * It runs in the background with no need for user input or interaction.
 * 
 * Features:
 * - Automatically starts on npm install
 * - Runs the zero-interaction mode
 * - No UI, panels, or user input required
 * - 100% autonomous operation
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Skip in build environment
if (process.env.VERCEL === '1' || 
    process.env.NODE_ENV === 'production' || 
    process.env.CI === 'true' || 
    process.env.VITE_BUILD === 'true' || 
    process.env.npm_lifecycle_event === 'build') {
  console.log('🛑 Skipping auto-start in build environment');
  process.exit(0);
}

console.log('🚀 Starting fully autonomous development system...');

// Check if dev-automation.js exists
const automationPath = join(process.cwd(), 'dev-automation.js');
if (!existsSync(automationPath)) {
  console.log('⚠️ dev-automation.js not found, skipping auto-start');
  process.exit(0);
}

// Start zero-interaction mode in a detached process
const zeroInteraction = spawn('node', [automationPath, 'zero-interaction'], {
  detached: true,
  stdio: 'ignore'
});

// Unref the child process so it can run independently
zeroInteraction.unref();

console.log('✅ Fully autonomous development system started');
console.log('🤖 Running in zero-interaction mode with no UI or user input required');
console.log('🔄 System will automatically:');
console.log('   - Check and fix TypeScript issues');
console.log('   - Check and fix ESLint/Prettier issues');
console.log('   - Monitor and fix security issues');
console.log('   - Optimize performance');
console.log('   - Update dependencies');
console.log('   - Self-heal the codebase');
console.log('   - Prepare for deployment');

// Exit this process
process.exit(0);