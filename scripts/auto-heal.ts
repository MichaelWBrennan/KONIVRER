/**
 * Auto-Heal Script
 * 
 * This script automatically fixes common issues in the codebase.
 * It can be run with different flags to control the level of healing.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const config = {
  quickMode: false,
  fullMode: false,
  fixLinting: true,
  fixFormatting: true,
  fixDependencies: true,
  fixTypeErrors: true
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--quick')) {
  config.quickMode = true;
  config.fixDependencies = false;
  config.fixTypeErrors = false;
}

if (args.includes('--full')) {
  config.fullMode = true;
}

// Main function
async function autoHeal() {
  console.log('Starting Auto-Heal Process...');
  
  const results: Record<string, any> = {};
  
  // Fix linting issues
  if (config.fixLinting) {
    console.log('\n🔧 Fixing linting issues...');
    try {
      execSync('npm run lint:fix', { stdio: 'inherit' });
      results.linting = { status: 'success' };
    } catch (error) {
      console.error('Failed to fix linting issues:', error);
      results.linting = { status: 'failed', error };
    }
  }
  
  // Fix formatting issues
  if (config.fixFormatting) {
    console.log('\n✨ Fixing formatting issues...');
    try {
      execSync('npm run format', { stdio: 'inherit' });
      results.formatting = { status: 'success' };
    } catch (error) {
      console.error('Failed to fix formatting issues:', error);
      results.formatting = { status: 'failed', error };
    }
  }
  
  // Fix dependencies
  if (config.fixDependencies && !config.quickMode) {
    console.log('\n📦 Fixing dependencies...');
    try {
      execSync('npm run deps:audit', { stdio: 'inherit' });
      results.dependencies = { status: 'success' };
    } catch (error) {
      console.error('Failed to fix dependencies:', error);
      results.dependencies = { status: 'failed', error };
    }
  }
  
  // Fix type errors
  if (config.fixTypeErrors && !config.quickMode) {
    console.log('\n🔍 Checking for type errors...');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      results.typeCheck = { status: 'success' };
    } catch (error) {
      console.error('Type errors found. Please fix them manually.');
      results.typeCheck = { status: 'failed', error };
    }
  }
  
  // Full mode additional fixes
  if (config.fullMode) {
    console.log('\n🔄 Running full healing process...');
    try {
      // Clean cache
      execSync('npm run clean:cache', { stdio: 'inherit' });
      
      // Optimize build
      execSync('npm run optimize', { stdio: 'inherit' });
      
      results.fullMode = { status: 'success' };
    } catch (error) {
      console.error('Full healing process failed:', error);
      results.fullMode = { status: 'failed', error };
    }
  }
  
  // Generate report
  const reportPath = path.join(process.cwd(), 'heal-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Healing report saved to ${reportPath}`);
  
  console.log('\n✅ Auto-Heal Process Complete!');
}

// Run if called directly
if (require.main === module) {
  autoHeal().catch(error => {
    console.error('Auto-Heal failed:', error);
    process.exit(1);
  });
}

export default autoHeal;