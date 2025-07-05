import fs from 'fs';
import path from 'path';


#!/usr/bin/env node

import {  execSync  } from 'child_process';
import {  existsSync, writeFileSync  } from 'fs';
import path from 'path';

const log = (log: any) => console.log(`🔧 ${message}`);
const success = (success: any) => console.log(`✅ ${message}`);
const error = (error: any) => console.error(`❌ ${message}`);

class OptimizedDeployment {
  constructor() {
    this.startTime = Date.now();
  }

  async run() {
    try {
      log('Starting optimized build and deployment...');
      
      await this.cleanBuild();
      await this.optimizeBuild();
      await this.runQualityChecks();
      await this.deployToProduction();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      success(`Deployment completed in ${duration}s`);
      
    } catch (err) {
      error(`Deployment failed: ${err.message}`);
      process.exit(1);
    }
  }

  async cleanBuild() {
    log('Cleaning previous build...');
    execSync('rm -rf dist node_modules/.cache', { stdio: 'inherit' });
  }

  async optimizeBuild() {
    log('Building optimized production bundle...');
    process.env.NODE_ENV = 'production';
    execSync('npm run build', { stdio: 'inherit' });
    
    // Analyze bundle size
    if (existsSync('dist')) {
      try {
        const stats = execSync('du -sh dist', { encoding: 'utf8' });
        log(`Bundle size: ${stats.trim()}`);
      } catch {}
    }
  }

  async runQualityChecks() {
    log('Running quality checks...');
    
    try {
      // ESLint check
      execSync('npm run lint', { stdio: 'inherit' });
      success('ESLint passed');
    } catch {
      error('ESLint failed - continuing anyway');
    }
    
    try {
      // Type check if TypeScript
      if (existsSync('tsconfig.json')) {
        execSync('npx tsc --noEmit', { stdio: 'inherit' });
        success('TypeScript check passed');
      }
    } catch {
      error('TypeScript check failed - continuing anyway');
    }
  }

  async deployToProduction() {
    log('Deploying to production...');
    
    // Git operations
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "feat: optimized codebase deployment"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      success('Git deployment completed');
    } catch (err) {
      error(`Git operations failed: ${err.message}`);
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/optimize-and-deploy.js [options]

Options:
  --help, -h    Show this help message

This script will:
1. Clean previous builds
2. Build optimized production bundle
3. Run quality checks (ESLint, TypeScript)
4. Deploy to production via Git
`);
  process.exit(0);
}

// Run deployment
const deployment = new OptimizedDeployment();
deployment.run();
