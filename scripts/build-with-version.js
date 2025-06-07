#!/usr/bin/env node

/**
 * Build script with version injection
 * Sets build time and git commit information
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Building with version information...\n');

try {
  // Get git commit SHA
  let gitCommitSha = 'unknown';
  try {
    gitCommitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    console.log(`📝 Git commit: ${gitCommitSha.slice(0, 8)}`);
  } catch (error) {
    console.warn('⚠️  Could not get git commit SHA:', error.message);
  }

  // Get build timestamp
  const buildTime = new Date().toISOString();
  console.log(`⏰ Build time: ${buildTime}`);

  // Create or update .env.local with build info
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  const envContent = `# Build-time environment variables
VITE_BUILD_TIME=${buildTime}
VITE_GIT_COMMIT_SHA=${gitCommitSha}
VITE_APP_VERSION=${gitCommitSha.slice(0, 8)}-${Date.now()}
`;

  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Created .env.local with build information');

  // Update index.html with version meta tag
  const indexPath = path.join(__dirname, '..', 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the version placeholder
    const version = `${gitCommitSha.slice(0, 8)}-${Date.now()}`;
    indexContent = indexContent.replace('%VITE_APP_VERSION%', version);
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('✅ Updated index.html with version information');
  }

  // Run the actual build
  console.log('\n🚀 Starting build process...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully with version information!');
  console.log(`📦 Version: ${gitCommitSha.slice(0, 8)}-${Date.now()}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
