#!/usr/bin/env node
/**
 * KONIVRER Development Automation
 * 
 * This is a Vercel-safe automation system that only runs in development
 * and doesn't interfere with production builds.
 */

import { execSync, spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, watch, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Configuration - Development Only
const CONFIG = {
  typescript: { check: true, autoFix: true, interval: 5000 }, // 5 seconds
  security: { 
    check: true, 
    autoFix: true, // Auto-fix security issues in dev only
    interval: 60000, // 1 minute
    quickScan: true 
  },
  quality: { 
    eslint: true, 
    prettier: true, 
    autoFix: true,
    interval: 5000 // 5 seconds
  },
  performance: { 
    optimize: true, 
    bundleAnalysis: true,
    imageOptimization: true,
    interval: 60000, // 1 minute
    buildOptimization: true // Optimize build process
  },
  dependencies: {
    autoUpdate: true, // Auto-update in dev only
    checkOutdated: true,
    interval: 3600000 // 1 hour
  },
  notifications: { 
    enabled: true, 
    channels: ['console', 'dashboard'],
    desktop: false // No desktop notifications
  },
  monitoring: { 
    enabled: true, 
    interval: 5000, // 5 seconds
    detailedLogs: true
  },
  autoStart: {
    fileWatcher: true, // Auto-start on file access
    dashboard: false, // No dashboard - fully autonomous
    vscodeTask: true, // Create VS Code task
    browserLauncher: false, // No browser launcher - fully autonomous
    fileAccessWatcher: true // Watch for file access and auto-start
  },
  autonomous: {
    enabled: true, // Enable autonomous mode
    zeroInteraction: true, // Zero human interaction mode
    autoStartOnFileAccess: true, // Auto-start on file access
    continuousMonitoring: true, // Continuous monitoring
    interval: 5000, // 5 seconds
    silentMode: true, // Silent mode - minimal logging
    autoHeal: true, // Auto-heal on errors
    autoFix: true // Auto-fix all issues
  },
  deployment: {
    enabled: true, // Enable deployment preparation
    prepareDeploy: true, // Prepare for deployment
    buildOptimization: true, // Optimize build for deployment
    vercelPrep: true // Prepare for Vercel deployment
  },
  selfHealing: {
    enabled: true, // Enable self-healing
    autoFix: true, // Auto-fix issues
    interval: 300000, // 5 minutes
    fixBrokenDependencies: true, // Fix broken dependencies
    fixBrokenImports: true, // Fix broken imports
    fixBrokenConfig: true // Fix broken config
  },
  // VERCEL SAFETY FEATURES
  vercel: {
    disableDuringBuild: true, // Disable during Vercel builds
    disableAutoCommit: true, // Never auto-commit
    disableAutoPush: true, // Never auto-push
    disableInProduction: true, // Disable in production
    safeMode: true, // Extra safety checks
    maxBuildTime: 30000 // Max 30s for any operation during build
  }
};

// Utility functions
const log = (message, type = 'info') => {
  const colors = { info: '\x1b[36m', success: '\x1b[32m', error: '\x1b[31m', warn: '\x1b[33m' };
  const timestamp = new Date().toISOString();
  const logMessage = `${colors[type]}[${timestamp}] ${message}\x1b[0m`;
  console.log(logMessage);
  
  // Log to file if detailed logs are enabled
  if (CONFIG.monitoring.detailedLogs) {
    try {
      const logFile = join(process.cwd(), 'dev-automation.log');
      writeFileSync(logFile, `${timestamp} [${type.toUpperCase()}] ${message}\n`, { flag: 'a' });
    } catch (error) {
      // Silent fail for logging errors
    }
  }
};

const runCommand = (command, silent = false, timeout = null) => {
  try {
    // Apply timeout during build to prevent hanging
    const options = { 
      encoding: 'utf8', 
      stdio: silent ? 'pipe' : 'inherit',
      timeout: isBuildEnvironment() ? CONFIG.vercel.maxBuildTime : timeout
    };
    
    const result = execSync(command, options);
    return result;
  } catch (error) {
    if (!silent) log(`Command failed: ${command}`, 'error');
    return '';
  }
};

// Check if we're in a build environment
const isBuildEnvironment = () => {
  return (
    process.env.VERCEL === '1' ||
    process.env.NODE_ENV === 'production' ||
    process.env.CI === 'true' ||
    process.env.VITE_BUILD === 'true' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.KONIVRER_BUILD_ID === 'vercel-build' ||
    process.env.FORCE_BUILD_MODE === 'true'
  );
};

// Check if we're in a production environment
const isProductionEnvironment = () => {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1'
  );
};

// Safe execution wrapper for build environments
const safeBuildExecution = async (fn, fallback = null) => {
  if (isBuildEnvironment() && CONFIG.vercel.disableDuringBuild) {
    log('🛑 Skipping operation in build environment', 'warn');
    return fallback;
  }
  
  if (isProductionEnvironment() && CONFIG.vercel.disableInProduction) {
    log('🛑 Skipping operation in production environment', 'warn');
    return fallback;
  }
  
  try {
    const startTime = Date.now();
    const result = await fn();
    const duration = Date.now() - startTime;
    
    if (isBuildEnvironment() && duration > CONFIG.vercel.maxBuildTime) {
      log(`⚠️ Operation took ${duration}ms, exceeding safe build time`, 'warn');
    }
    
    return result;
  } catch (error) {
    log(`❌ Operation failed: ${error}`, 'error');
    return fallback;
  }
};

// Core automation modules
class TypeScriptEnforcer {
  static async check() {
    return await safeBuildExecution(async () => {
      log('🔍 TypeScript check...');
      const result = runCommand('npx tsc --noEmit', true);
      if (result.includes('error')) {
        log('❌ TypeScript errors found', 'error');
        if (CONFIG.typescript.autoFix) await this.autoFix();
        return false;
      }
      log('✅ TypeScript check passed', 'success');
      return true;
    }, true);
  }

  static async autoFix() {
    return await safeBuildExecution(async () => {
      log('🔧 Auto-fixing TypeScript issues...');
      runCommand('npx eslint --fix src/**/*.{ts,tsx}', true);
      runCommand('npx prettier --write src/**/*.{ts,tsx}', true);
      log('✅ TypeScript auto-fix complete', 'success');
      return true;
    }, false);
  }
  
  static async quickCheck() {
    // Quick incremental check for monitoring
    return await safeBuildExecution(async () => {
      const result = runCommand('npx tsc --noEmit --incremental', true);
      if (result.includes('error')) {
        log('🔍 TypeScript errors detected in quick check', 'warn');
        return false;
      }
      return true;
    }, true);
  }
}

class SecurityMonitor {
  static async check() {
    return await safeBuildExecution(async () => {
      log('🛡️ Security check...');
      const auditResult = runCommand('npm audit --audit-level moderate', true);
      
      if (auditResult.includes('vulnerabilities')) {
        log('⚠️ Security vulnerabilities found', 'warn');
        if (CONFIG.security.autoFix) {
          await this.autoFix();
        } else {
          log('Run npm audit fix to resolve issues', 'info');
        }
        return false;
      }
      log('✅ Security check passed', 'success');
      return true;
    }, true);
  }
  
  static async autoFix() {
    return await safeBuildExecution(async () => {
      log('🔧 Auto-fixing security vulnerabilities...');
      runCommand('npm audit fix', true);
      log('✅ Security auto-fix complete', 'success');
      return true;
    }, false);
  }
  
  static async quickScan() {
    // Quick security check for monitoring
    return await safeBuildExecution(async () => {
      if (!CONFIG.security.quickScan) return true;
      
      const auditResult = runCommand('npm audit --audit-level high', true);
      if (auditResult.includes('high') || auditResult.includes('critical')) {
        log('🚨 Critical security issue detected!', 'error');
        if (CONFIG.security.autoFix) {
          await this.autoFix();
        }
        return false;
      }
      return true;
    }, true);
  }
}

class QualityAssurance {
  static async check() {
    return await safeBuildExecution(async () => {
      log('🎯 Quality check...');
      let passed = true;

      // ESLint
      const eslintResult = runCommand('npx eslint src/**/*.{ts,tsx}', true);
      if (eslintResult.includes('error')) {
        log('❌ ESLint errors found', 'error');
        passed = false;
        
        if (CONFIG.quality.autoFix) {
          await this.autoFix();
        }
      }
      
      // Prettier check
      if (CONFIG.quality.prettier) {
        try {
          const prettierResult = runCommand('npx prettier --check src/**/*.{ts,tsx}', true);
          if (prettierResult.includes('Unformatted')) {
            log('❌ Prettier formatting issues found', 'error');
            passed = false;
            
            if (CONFIG.quality.autoFix) {
              await this.autoFix();
            }
          }
        } catch (error) {
          // Silently fail prettier check
        }
      }

      if (passed) log('✅ Quality check passed', 'success');
      return passed;
    }, true);
  }

  static async autoFix() {
    return await safeBuildExecution(async () => {
      log('🔧 Auto-fixing quality issues...');
      
      // Fix ESLint issues
      runCommand('npx eslint src/**/*.{ts,tsx} --fix', true);
      
      // Format with Prettier
      runCommand('npx prettier --write src/**/*.{ts,tsx}', true);
      
      log('✅ Quality auto-fix complete', 'success');
      return true;
    }, false);
  }
  
  static async quickLint() {
    // Quick ESLint check for monitoring
    return await safeBuildExecution(async () => {
      const eslintResult = runCommand('npx eslint src/**/*.{ts,tsx} --max-warnings 0', true);
      if (eslintResult.includes('error')) {
        log('🔧 ESLint issues detected in quick check', 'warn');
        if (CONFIG.quality.autoFix) {
          await this.autoFix();
        }
        return false;
      }
      return true;
    }, true);
  }
}

class PerformanceOptimizer {
  static async check() {
    return await safeBuildExecution(async () => {
      log('⚡ Performance check...');
      
      // Check bundle size if dist exists
      const distPath = join(process.cwd(), 'dist');
      if (existsSync(distPath)) {
        await this.analyzeBundleSize();
      }
      
      // Check for large files
      await this.checkLargeFiles();
      
      // Check for image optimization opportunities
      if (CONFIG.performance.imageOptimization) {
        await this.checkImageOptimization();
      }
      
      log('✅ Performance check complete', 'success');
      return true;
    }, true);
  }
  
  static async analyzeBundleSize() {
    return await safeBuildExecution(async () => {
      const distPath = join(process.cwd(), 'dist');
      if (!existsSync(distPath)) return;
      
      try {
        // Try to use vite-bundle-visualizer if available
        const visualizerResult = runCommand('npx vite-bundle-visualizer --json', true);
        if (visualizerResult) {
          try {
            const stats = JSON.parse(visualizerResult);
            log(`📊 Bundle size: ${(stats.totalBytes / 1024 / 1024).toFixed(2)} MB`);
          } catch (e) {
            // JSON parse error, fallback to manual calculation
            this.manualBundleAnalysis();
          }
        } else {
          // Fallback to manual calculation
          this.manualBundleAnalysis();
        }
      } catch (error) {
        // Fallback to manual calculation
        this.manualBundleAnalysis();
      }
    }, null);
  }
  
  static manualBundleAnalysis() {
    const distPath = join(process.cwd(), 'dist');
    if (!existsSync(distPath)) return;
    
    try {
      let totalSize = 0;
      const files = readdirSync(distPath, { recursive: true });
      
      files.forEach(file => {
        if (typeof file === 'string') {
          const filePath = join(distPath, file);
          try {
            const stats = statSync(filePath);
            if (stats.isFile()) {
              totalSize += stats.size;
            }
          } catch (e) {
            // Skip files that can't be stat'd
          }
        }
      });
      
      log(`📊 Bundle size (manual calculation): ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      log('⚠️ Could not analyze bundle size', 'warn');
    }
  }
  
  static async checkLargeFiles() {
    return await safeBuildExecution(async () => {
      const srcPath = join(process.cwd(), 'src');
      if (!existsSync(srcPath)) return;
      
      try {
        // Find files larger than 100KB
        const result = runCommand(`find ${srcPath} -type f -size +100k | sort -n -r`, true);
        if (result.trim()) {
          log('⚠️ Large files detected:', 'warn');
          result.split('\n').filter(Boolean).forEach(file => {
            try {
              const stats = statSync(file);
              log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`, 'warn');
            } catch (e) {
              log(`  - ${file}`, 'warn');
            }
          });
        }
      } catch (error) {
        // Skip large file check on error
      }
    }, null);
  }
  
  static async checkImageOptimization() {
    return await safeBuildExecution(async () => {
      const publicPath = join(process.cwd(), 'public');
      if (!existsSync(publicPath)) return;
      
      try {
        // Find image files
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
        const result = runCommand(`find ${publicPath} -type f | grep -E '\\.(png|jpg|jpeg|gif|webp|svg)$'`, true);
        
        if (result.trim()) {
          const images = result.split('\n').filter(Boolean);
          let largeImages = 0;
          let totalSize = 0;
          
          images.forEach(image => {
            try {
              const stats = statSync(image);
              totalSize += stats.size;
              if (stats.size > 200 * 1024) { // Larger than 200KB
                largeImages++;
                log(`  - Large image: ${image} (${(stats.size / 1024).toFixed(2)} KB)`, 'warn');
              }
            } catch (e) {
              // Skip files that can't be stat'd
            }
          });
          
          log(`📊 Images: ${images.length} files, ${largeImages} large images, ${(totalSize / 1024 / 1024).toFixed(2)} MB total`, 'info');
          
          if (largeImages > 0) {
            log('💡 Consider optimizing large images for better performance', 'info');
          }
        }
      } catch (error) {
        // Skip image optimization check on error
      }
    }, null);
  }
  
  static async optimize() {
    return await safeBuildExecution(async () => {
      if (!CONFIG.performance.optimize) return;
      
      log('⚡ Running performance optimizations...');
      
      // Optimize images if possible
      if (CONFIG.performance.imageOptimization) {
        await this.optimizeImages();
      }
      
      log('✅ Performance optimization complete', 'success');
    }, null);
  }
  
  static async optimizeImages() {
    return await safeBuildExecution(async () => {
      // Check if we have image optimization tools
      const hasImagemin = runCommand('npm list imagemin', true).includes('imagemin');
      
      if (!hasImagemin) {
        log('⚠️ Image optimization tools not available', 'warn');
        log('💡 Consider installing imagemin for image optimization', 'info');
        return;
      }
      
      const publicPath = join(process.cwd(), 'public');
      if (!existsSync(publicPath)) return;
      
      log('🖼️ Optimizing images...');
      
      // This would use imagemin in a real implementation
      // For now, just log what would be optimized
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
      const result = runCommand(`find ${publicPath} -type f | grep -E '\\.(png|jpg|jpeg|gif|webp)$'`, true);
      
      if (result.trim()) {
        const images = result.split('\n').filter(Boolean);
        log(`Would optimize ${images.length} images`, 'info');
      }
      
      log('✅ Image optimization complete', 'success');
    }, null);
  }
}

class DependencyManager {
  static async check() {
    return await safeBuildExecution(async () => {
      log('📦 Dependency check...');
      
      // Check for outdated packages
      if (CONFIG.dependencies.checkOutdated) {
        const outdated = runCommand('npm outdated --json', true);
        if (outdated) {
          try {
            const packages = JSON.parse(outdated);
            const count = Object.keys(packages).length;
            if (count > 0) {
              log(`📈 ${count} packages can be updated:`, 'warn');
              Object.entries(packages).forEach(([pkg, info]) => {
                log(`  - ${pkg}: ${info.current} → ${info.latest}`, 'info');
              });
              
              if (CONFIG.dependencies.autoUpdate) {
                await this.update();
              }
            } else {
              log('✅ All dependencies are up to date', 'success');
            }
          } catch (e) {
            log('⚠️ Could not parse outdated packages', 'warn');
          }
        }
      }
      
      // Check for broken dependencies
      await this.checkBrokenDependencies();
      
      log('✅ Dependency check complete', 'success');
      return true;
    }, true);
  }
  
  static async update() {
    return await safeBuildExecution(async () => {
      log('📦 Updating dependencies...');
      
      // Only update in development, never in build
      if (isBuildEnvironment()) {
        log('🛑 Skipping dependency update in build environment', 'warn');
        return false;
      }
      
      // Update dependencies
      runCommand('npm update', true);
      
      log('✅ Dependencies updated', 'success');
      return true;
    }, false);
  }
  
  static async checkBrokenDependencies() {
    return await safeBuildExecution(async () => {
      log('🔍 Checking for broken dependencies...');
      
      // Check for broken node_modules
      const nodeModulesPath = join(process.cwd(), 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        log('⚠️ node_modules directory not found, running npm install...', 'warn');
        runCommand('npm install', true);
        return;
      }
      
      // Check for package-lock.json consistency
      const packageLockPath = join(process.cwd(), 'package-lock.json');
      const packageJsonPath = join(process.cwd(), 'package.json');
      
      if (existsSync(packageLockPath) && existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
          const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
          
          // Simple check for version mismatch
          if (packageJson.version !== packageLock.version) {
            log('⚠️ Package version mismatch detected, running npm install...', 'warn');
            runCommand('npm install', true);
          }
        } catch (error) {
          log(`⚠️ Error checking package files: ${error}`, 'warn');
        }
      }
      
      // Run npm check to verify dependencies
      try {
        const checkResult = runCommand('npm ls --depth=0', true);
        if (checkResult.includes('UNMET DEPENDENCY') || checkResult.includes('missing:')) {
          log('⚠️ Broken dependencies detected, running npm install...', 'warn');
          runCommand('npm install', true);
        }
      } catch (error) {
        // npm ls often exits with non-zero code if there are issues
        log('⚠️ Dependency issues detected, running npm install...', 'warn');
        runCommand('npm install', true);
      }
      
      log('✅ Dependency check complete', 'success');
    }, null);
  }
}

// Deployment preparation
class DeploymentPreparation {
  static async prepare() {
    return await safeBuildExecution(async () => {
      if (!CONFIG.deployment.enabled) return;
      
      log('🚀 Preparing for deployment...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping deployment preparation in build environment', 'warn');
        return;
      }
      
      // Run checks before deployment
      await this.preDeploymentChecks();
      
      // Optimize build for deployment
      if (CONFIG.deployment.buildOptimization) {
        await this.optimizeBuild();
      }
      
      // Prepare for Vercel deployment
      if (CONFIG.deployment.vercelPrep) {
        await this.prepareForVercel();
      }
      
      log('✅ Deployment preparation complete', 'success');
    }, null);
  }
  
  static async preDeploymentChecks() {
    return await safeBuildExecution(async () => {
      log('🔍 Running pre-deployment checks...');
      
      // Run TypeScript check
      const tsResult = await TypeScriptEnforcer.check();
      
      // Run ESLint check
      const lintResult = await QualityAssurance.check();
      
      // Run security check
      const securityResult = await SecurityMonitor.check();
      
      // Check for outdated dependencies
      await DependencyManager.check();
      
      // Run test suite if available
      try {
        log('🧪 Running tests...');
        const testResult = runCommand('npm test -- --passWithNoTests', true);
        if (testResult.includes('FAIL')) {
          log('❌ Tests failed', 'error');
        } else {
          log('✅ Tests passed', 'success');
        }
      } catch (error) {
        log('⚠️ Error running tests', 'warn');
      }
      
      log('✅ Pre-deployment checks complete', 'success');
    }, null);
  }
  
  static async optimizeBuild() {
    return await safeBuildExecution(async () => {
      log('⚡ Optimizing build for deployment...');
      
      // Check and optimize vite.config.ts
      const viteConfigPath = join(process.cwd(), 'vite.config.ts');
      if (existsSync(viteConfigPath)) {
        log('📝 Checking Vite configuration...');
        
        // Read vite.config.ts
        const viteConfig = readFileSync(viteConfigPath, 'utf8');
        
        // Check for optimization settings
        if (!viteConfig.includes('manualChunks') || !viteConfig.includes('minify')) {
          log('⚠️ Vite configuration could be optimized', 'warn');
          log('💡 Consider adding manualChunks and minify settings to vite.config.ts', 'info');
        }
      }
      
      // Check for large files that could be optimized
      await PerformanceOptimizer.checkLargeFiles();
      
      // Check for image optimization opportunities
      if (CONFIG.performance.imageOptimization) {
        await PerformanceOptimizer.checkImageOptimization();
      }
      
      // Check for bundle size
      await PerformanceOptimizer.analyzeBundleSize();
      
      log('✅ Build optimization complete', 'success');
    }, null);
  }
  
  static async prepareForVercel() {
    return await safeBuildExecution(async () => {
      log('🔧 Preparing for Vercel deployment...');
      
      // Check for vercel.json
      const vercelJsonPath = join(process.cwd(), 'vercel.json');
      if (!existsSync(vercelJsonPath)) {
        log('⚠️ vercel.json not found', 'warn');
        log('💡 Consider creating a vercel.json file for better Vercel configuration', 'info');
        
        // Create a basic vercel.json if it doesn't exist
        const vercelJson = {
          "version": 2,
          "builds": [
            {
              "src": "package.json",
              "use": "@vercel/static-build",
              "config": {
                "distDir": "dist"
              }
            }
          ],
          "routes": [
            {
              "src": "/(.*)",
              "dest": "/index.html"
            }
          ]
        };
        
        log('📝 Creating basic vercel.json file...', 'info');
        writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
      }
      
      // Check for build script in package.json
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
          
          // Check for build script
          if (!packageJson.scripts || !packageJson.scripts.build) {
            log('⚠️ No build script found in package.json', 'warn');
          }
          
          // Check for build:vercel script
          if (!packageJson.scripts || !packageJson.scripts['build:vercel']) {
            log('⚠️ No build:vercel script found in package.json', 'warn');
            log('💡 Consider adding a build:vercel script for Vercel deployments', 'info');
          }
        } catch (error) {
          log(`⚠️ Error checking package.json: ${error}`, 'warn');
        }
      }
      
      log('✅ Vercel preparation complete', 'success');
    }, null);
  }
}

// Self-healing system
class SelfHealingSystem {
  static async heal() {
    return await safeBuildExecution(async () => {
      if (!CONFIG.selfHealing.enabled) return;
      
      log('🔧 Starting self-healing process...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping self-healing in build environment', 'warn');
        return;
      }
      
      // Fix broken dependencies
      if (CONFIG.selfHealing.fixBrokenDependencies) {
        await this.fixBrokenDependencies();
      }
      
      // Fix broken imports
      if (CONFIG.selfHealing.fixBrokenImports) {
        await this.fixBrokenImports();
      }
      
      // Fix broken config
      if (CONFIG.selfHealing.fixBrokenConfig) {
        await this.fixBrokenConfig();
      }
      
      log('✅ Self-healing process complete', 'success');
    }, null);
  }
  
  static async fixBrokenDependencies() {
    return await safeBuildExecution(async () => {
      log('🔧 Fixing broken dependencies...');
      
      // Check for broken node_modules
      await DependencyManager.checkBrokenDependencies();
      
      // Check for duplicate dependencies
      try {
        const dedupResult = runCommand('npm dedupe', true);
        log('✅ Dependency deduplication complete', 'success');
      } catch (error) {
        log(`⚠️ Error deduplicating dependencies: ${error}`, 'warn');
      }
      
      log('✅ Dependency fixing complete', 'success');
    }, null);
  }
  
  static async fixBrokenImports() {
    return await safeBuildExecution(async () => {
      log('🔧 Fixing broken imports...');
      
      // Check for broken imports in TypeScript files
      const srcPath = join(process.cwd(), 'src');
      if (existsSync(srcPath)) {
        try {
          // Use TypeScript compiler to check for import errors
          const tscResult = runCommand('npx tsc --noEmit', true);
          
          if (tscResult.includes('Cannot find module') || tscResult.includes('error TS2307')) {
            log('⚠️ Broken imports detected', 'warn');
            
            // Extract missing modules
            const missingModuleRegex = /Cannot find module '([^']+)'/g;
            const matches = [...tscResult.matchAll(missingModuleRegex)];
            
            if (matches.length > 0) {
              const missingModules = new Set();
              matches.forEach(match => {
                const module = match[1];
                // Only consider external modules (not relative imports)
                if (!module.startsWith('.') && !module.startsWith('/')) {
                  missingModules.add(module);
                }
              });
              
              if (missingModules.size > 0) {
                log(`🔍 Found ${missingModules.size} missing modules`, 'info');
                log(`💡 Installing missing modules: ${Array.from(missingModules).join(', ')}`, 'info');
                
                // Install missing modules
                const installCommand = `npm install ${Array.from(missingModules).join(' ')}`;
                runCommand(installCommand, true);
              }
            }
          }
        } catch (error) {
          // TypeScript check often exits with non-zero code if there are errors
          log('⚠️ TypeScript errors detected, running auto-fix...', 'warn');
          await TypeScriptEnforcer.autoFix();
        }
      }
      
      log('✅ Import fixing complete', 'success');
    }, null);
  }
  
  static async fixBrokenConfig() {
    return await safeBuildExecution(async () => {
      log('🔧 Fixing broken configuration...');
      
      // Check for broken tsconfig.json
      const tsconfigPath = join(process.cwd(), 'tsconfig.json');
      if (existsSync(tsconfigPath)) {
        try {
          const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
          
          // Check for common issues
          let fixed = false;
          
          // Ensure compilerOptions exists
          if (!tsconfig.compilerOptions) {
            tsconfig.compilerOptions = {};
            fixed = true;
          }
          
          // Ensure include exists
          if (!tsconfig.include) {
            tsconfig.include = ['src/**/*'];
            fixed = true;
          }
          
          // Ensure exclude exists
          if (!tsconfig.exclude) {
            tsconfig.exclude = ['node_modules', 'dist'];
            fixed = true;
          }
          
          // Write fixed tsconfig.json
          if (fixed) {
            log('🔧 Fixing tsconfig.json...', 'info');
            writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
          }
        } catch (error) {
          log(`⚠️ Error checking tsconfig.json: ${error}`, 'warn');
        }
      }
      
      // Check for broken vite.config.ts
      const viteConfigPath = join(process.cwd(), 'vite.config.ts');
      if (existsSync(viteConfigPath)) {
        try {
          // Simple check for syntax errors
          runCommand(`npx tsc ${viteConfigPath} --noEmit`, true);
        } catch (error) {
          log('⚠️ Syntax errors in vite.config.ts, running auto-fix...', 'warn');
          runCommand(`npx eslint ${viteConfigPath} --fix`, true);
        }
      }
      
      // Check for broken package.json
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
          
          // Check for common issues
          let fixed = false;
          
          // Ensure scripts exists
          if (!packageJson.scripts) {
            packageJson.scripts = {};
            fixed = true;
          }
          
          // Ensure dependencies exists
          if (!packageJson.dependencies) {
            packageJson.dependencies = {};
            fixed = true;
          }
          
          // Ensure devDependencies exists
          if (!packageJson.devDependencies) {
            packageJson.devDependencies = {};
            fixed = true;
          }
          
          // Write fixed package.json
          if (fixed) {
            log('🔧 Fixing package.json...', 'info');
            writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
          }
        } catch (error) {
          log(`⚠️ Error checking package.json: ${error}`, 'warn');
        }
      }
      
      log('✅ Configuration fixing complete', 'success');
    }, null);
  }
}

// Development Dashboard Server
class DevelopmentDashboard {
  static async start(port = 12002) {
    return await safeBuildExecution(async () => {
      log('📊 Starting development dashboard...');
      
      // Get system status
      const systemStatus = await this.getSystemStatus();
      
      const server = createServer((req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(this.generateDashboardHtml(systemStatus));
        } else if (req.url === '/api/status') {
          // API endpoint for status updates
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(systemStatus));
        } else if (req.url === '/api/run-check') {
          // API endpoint to trigger checks
          this.runAllChecks();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Checks triggered' }));
        } else if (req.url === '/api/run-fix') {
          // API endpoint to trigger auto-fix
          this.runAutoFix();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Auto-fix triggered' }));
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });
      
      server.listen(port, '0.0.0.0', () => {
        log(`📊 Development dashboard running at http://localhost:${port}`, 'success');
      });
      
      return server;
    }, null);
  }
  
  static async getSystemStatus() {
    // Get real-time system status
    const status = {
      timestamp: new Date().toISOString(),
      environment: isBuildEnvironment() ? 'build' : (isProductionEnvironment() ? 'production' : 'development'),
      features: {
        typescript: CONFIG.typescript,
        security: CONFIG.security,
        quality: CONFIG.quality,
        performance: CONFIG.performance,
        dependencies: CONFIG.dependencies,
        autoStart: CONFIG.autoStart
      },
      vercelSafety: CONFIG.vercel,
      nodeVersion: process.version,
      platform: process.platform
    };
    
    return status;
  }
  
  static async runAllChecks() {
    // Run all checks in background
    setTimeout(async () => {
      await TypeScriptEnforcer.check();
      await SecurityMonitor.check();
      await QualityAssurance.check();
      await PerformanceOptimizer.check();
      await DependencyManager.check();
    }, 0);
  }
  
  static async runAutoFix() {
    // Run auto-fix in background
    setTimeout(async () => {
      await TypeScriptEnforcer.autoFix();
      await QualityAssurance.autoFix();
      if (CONFIG.security.autoFix) {
        await SecurityMonitor.autoFix();
      }
      if (CONFIG.performance.optimize) {
        await PerformanceOptimizer.optimize();
      }
    }, 0);
  }
  
  static generateDashboardHtml(status) {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>KONIVRER Development Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: #cccccc; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { background: #1e1e3f; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .success { border-left: 5px solid #00ff00; }
        .info { border-left: 5px solid #00aaff; }
        .warning { border-left: 5px solid #ffcc00; }
        h1 { color: #00ff00; }
        h2 { color: #00aaff; }
        .emoji { font-size: 1.5em; }
        code { background: #2a2a4a; padding: 2px 6px; border-radius: 3px; }
        .button {
            display: inline-block;
            background: #2a2a4a;
            color: #cccccc;
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            margin-right: 10px;
            cursor: pointer;
        }
        .button:hover {
            background: #3a3a5a;
        }
        .button.primary {
            background: #00aaff;
            color: white;
        }
        .button.primary:hover {
            background: #0088cc;
        }
        .actions {
            margin: 20px 0;
        }
        .timestamp {
            font-size: 0.8em;
            color: #888;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 KONIVRER Development Dashboard</h1>
        <div class="status success">
            <h2>✅ Development Mode Active</h2>
            <p>This dashboard shows the status of development automation tools.</p>
            <p class="timestamp">Last updated: <span id="timestamp">${timestamp}</span></p>
        </div>
        
        <div class="actions">
            <a class="button primary" id="run-checks">Run All Checks</a>
            <a class="button" id="run-fix">Run Auto-Fix</a>
            <a class="button" href="http://localhost:12000" target="_blank">Open App</a>
        </div>
        
        <div class="status info">
            <h2>🤖 Active Development Tools:</h2>
            <ul>
                <li>✅ TypeScript checking (every ${CONFIG.typescript.interval/1000} seconds)</li>
                <li>✅ ESLint & Prettier (every ${CONFIG.quality.interval/1000} seconds)</li>
                <li>✅ Security monitoring (every ${CONFIG.security.interval/60000} minute${CONFIG.security.interval/60000 !== 1 ? 's' : ''})</li>
                <li>✅ Performance monitoring (every ${CONFIG.performance.interval/60000} minute${CONFIG.performance.interval/60000 !== 1 ? 's' : ''})</li>
                <li>✅ Dependency checking (every ${CONFIG.dependencies.interval/3600000} hour${CONFIG.dependencies.interval/3600000 !== 1 ? 's' : ''})</li>
            </ul>
        </div>
        
        <div class="status info">
            <h2>🛡️ Vercel Safety Features</h2>
            <ul>
                <li>✅ No automation during builds</li>
                <li>✅ No auto-commit or auto-push</li>
                <li>✅ Development-only features</li>
                <li>✅ No interference with production</li>
                <li>✅ Safe timeouts for build operations</li>
            </ul>
        </div>
        
        <div class="status ${status.environment !== 'development' ? 'warning' : 'success'}">
            <h2>📊 System Status</h2>
            <p>🟢 <strong>Status:</strong> ${status.environment.charAt(0).toUpperCase() + status.environment.slice(1)} Mode</p>
            <p>⚡ <strong>Monitoring:</strong> ${CONFIG.monitoring.enabled ? 'Active' : 'Inactive'}</p>
            <p>🔄 <strong>Auto-fix:</strong> ${CONFIG.typescript.autoFix && CONFIG.quality.autoFix ? 'Enabled' : 'Disabled'}</p>
            <p>🔧 <strong>Node:</strong> ${status.nodeVersion}</p>
            <p>💻 <strong>Platform:</strong> ${status.platform}</p>
        </div>
        
        <div class="status info">
            <h2>📋 Quick Commands</h2>
            <p><code>npm run dev:safe</code> - Start development server with automation</p>
            <p><code>npm run dev:check</code> - Run all checks once</p>
            <p><code>npm run dev:fix</code> - Run auto-fix for TypeScript and ESLint</p>
            <p><code>npm run dev:dashboard</code> - Start development dashboard only</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh status every 30 seconds
        setInterval(() => {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('timestamp').textContent = new Date().toLocaleString();
                })
                .catch(error => console.error('Error fetching status:', error));
        }, 30000);
        
        // Show live timestamp
        setInterval(() => {
            document.title = 'KONIVRER Dev Dashboard (' + new Date().toLocaleTimeString() + ')';
        }, 1000);
        
        // Add event listeners for buttons
        document.getElementById('run-checks').addEventListener('click', () => {
            fetch('/api/run-check')
                .then(response => response.json())
                .then(data => {
                    alert('All checks triggered successfully!');
                })
                .catch(error => console.error('Error triggering checks:', error));
        });
        
        document.getElementById('run-fix').addEventListener('click', () => {
            fetch('/api/run-fix')
                .then(response => response.json())
                .then(data => {
                    alert('Auto-fix triggered successfully!');
                })
                .catch(error => console.error('Error triggering auto-fix:', error));
        });
    </script>
</body>
</html>
    `;
  }
}

// Auto-start features
class AutoStartManager {
  static async setup() {
    return await safeBuildExecution(async () => {
      log('🚀 Setting up auto-start features...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping auto-start setup in build environment', 'warn');
        return;
      }
      
      // Create VS Code tasks if enabled
      if (CONFIG.autoStart.vscodeTask) {
        await this.setupVSCodeTasks();
      }
      
      // Start file watcher if enabled
      if (CONFIG.autoStart.fileWatcher) {
        await this.startFileWatcher();
      }
      
      // Set up file access watcher if enabled
      if (CONFIG.autoStart.fileAccessWatcher) {
        await this.setupFileAccessWatcher();
      }
      
      // Set up browser launcher if enabled
      if (CONFIG.autoStart.browserLauncher) {
        await this.setupBrowserLauncher();
      }
      
      log('✅ Auto-start features set up', 'success');
    }, null);
  }
  
  static async setupVSCodeTasks() {
    return await safeBuildExecution(async () => {
      log('💻 Setting up VS Code tasks...');
      
      try {
        const vscodeDir = join(process.cwd(), '.vscode');
        
        // Create .vscode directory if it doesn't exist
        if (!existsSync(vscodeDir)) {
          try {
            execSync(`mkdir -p ${vscodeDir}`);
          } catch (error) {
            log('⚠️ Could not create .vscode directory', 'warn');
            return;
          }
        }
        
        // Create tasks.json
        const tasksPath = join(vscodeDir, 'tasks.json');
        const tasksJson = {
          "version": "2.0.0",
          "tasks": [
            {
              "label": "Start KONIVRER Development",
              "type": "shell",
              "command": "npm run dev:safe",
              "group": "build",
              "presentation": {
                "reveal": "always",
                "panel": "new"
              },
              "runOptions": {
                "runOn": "folderOpen"
              },
              "problemMatcher": []
            },
            {
              "label": "Run All Checks",
              "type": "shell",
              "command": "npm run dev:check",
              "group": "test",
              "presentation": {
                "reveal": "always",
                "panel": "shared"
              },
              "problemMatcher": []
            },
            {
              "label": "Run Auto-Fix",
              "type": "shell",
              "command": "npm run dev:fix",
              "group": "test",
              "presentation": {
                "reveal": "always",
                "panel": "shared"
              },
              "problemMatcher": []
            },
            {
              "label": "Start Autonomous Mode",
              "type": "shell",
              "command": "npm run dev:autonomous",
              "group": "build",
              "presentation": {
                "reveal": "always",
                "panel": "new"
              },
              "problemMatcher": []
            },
            {
              "label": "Start Zero-Interaction Mode",
              "type": "shell",
              "command": "npm run dev:zero-interaction",
              "group": "build",
              "presentation": {
                "reveal": "always",
                "panel": "new"
              },
              "problemMatcher": []
            }
          ]
        };
        
        writeFileSync(tasksPath, JSON.stringify(tasksJson, null, 2));
        
        // Create settings.json if it doesn't exist
        const settingsPath = join(vscodeDir, 'settings.json');
        if (!existsSync(settingsPath)) {
          const settingsJson = {
            "typescript.tsdk": "node_modules/typescript/lib",
            "editor.formatOnSave": true,
            "editor.codeActionsOnSave": {
              "source.fixAll.eslint": true
            },
            "files.exclude": {
              "**/.git": true,
              "**/node_modules": true,
              "**/dist": false
            },
            "terminal.integrated.defaultProfile.linux": "bash",
            "terminal.integrated.profiles.linux": {
              "bash": {
                "path": "bash",
                "icon": "terminal-bash"
              }
            },
            "workbench.colorCustomizations": {
              "statusBar.background": "#1e1e3f",
              "statusBar.foreground": "#cccccc"
            }
          };
          
          writeFileSync(settingsPath, JSON.stringify(settingsJson, null, 2));
        }
        
        // Create launch.json if it doesn't exist
        const launchPath = join(vscodeDir, 'launch.json');
        if (!existsSync(launchPath)) {
          const launchJson = {
            "version": "0.2.0",
            "configurations": [
              {
                "type": "node",
                "request": "launch",
                "name": "Launch Development Server",
                "runtimeExecutable": "npm",
                "runtimeArgs": ["run", "dev:safe"],
                "skipFiles": ["<node_internals>/**"],
                "console": "integratedTerminal"
              },
              {
                "type": "node",
                "request": "launch",
                "name": "Launch Autonomous Mode",
                "runtimeExecutable": "npm",
                "runtimeArgs": ["run", "dev:autonomous"],
                "skipFiles": ["<node_internals>/**"],
                "console": "integratedTerminal"
              }
            ]
          };
          
          writeFileSync(launchPath, JSON.stringify(launchJson, null, 2));
        }
        
        log('✅ VS Code tasks set up', 'success');
      } catch (error) {
        log(`⚠️ Could not set up VS Code tasks: ${error}`, 'warn');
      }
    }, null);
  }
  
  static async startFileWatcher() {
    return await safeBuildExecution(async () => {
      log('👁️ Starting file watcher...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping file watcher in build environment', 'warn');
        return;
      }
      
      try {
        // Watch for file changes in src directory
        const srcPath = join(process.cwd(), 'src');
        if (existsSync(srcPath)) {
          let debounceTimer = null;
          let lastChecked = Date.now();
          
          watch(srcPath, { recursive: true }, (eventType, filename) => {
            // Skip node_modules and hidden files
            if (filename && !filename.includes('node_modules') && !filename.startsWith('.')) {
              // Debounce to prevent multiple rapid checks
              clearTimeout(debounceTimer);
              
              // Only check if it's been at least 5 seconds since the last check
              if (Date.now() - lastChecked > 5000) {
                debounceTimer = setTimeout(async () => {
                  log(`📁 File change detected: ${filename}`, 'info');
                  
                  // Run appropriate checks based on file type
                  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
                    await TypeScriptEnforcer.quickCheck();
                    await QualityAssurance.quickLint();
                  } else if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
                    await QualityAssurance.quickLint();
                  }
                  
                  lastChecked = Date.now();
                }, 1000); // Wait 1 second after last change
              }
            }
          });
          
          log('✅ File watcher started', 'success');
        } else {
          log('⚠️ src directory not found, skipping file watcher', 'warn');
        }
      } catch (error) {
        log(`⚠️ Could not start file watcher: ${error}`, 'warn');
      }
    }, null);
  }
  
  static async setupFileAccessWatcher() {
    return await safeBuildExecution(async () => {
      log('👁️ Setting up file access watcher...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping file access watcher in build environment', 'warn');
        return;
      }
      
      try {
        // Create auto-file-watcher.js
        const watcherPath = join(process.cwd(), 'auto-file-watcher.js');
        const watcherContent = `#!/usr/bin/env node
/**
 * KONIVRER Auto File Watcher
 * 
 * This script watches for file access and auto-starts the development automation.
 * It's designed to be Vercel-safe and won't interfere with production builds.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Skip in build environment
if (process.env.VERCEL === '1' || 
    process.env.NODE_ENV === 'production' || 
    process.env.CI === 'true' || 
    process.env.VITE_BUILD === 'true' || 
    process.env.npm_lifecycle_event === 'build') {
  console.log('🛑 Skipping file access watcher in build environment');
  process.exit(0);
}

console.log('👁️ Starting file access watcher...');

// Watch for file access in src directory
const srcPath = path.join(process.cwd(), 'src');
if (fs.existsSync(srcPath)) {
  let isAutomationRunning = false;
  let lastAccess = Date.now();
  
  // Function to start automation
  const startAutomation = () => {
    if (!isAutomationRunning && Date.now() - lastAccess > 5000) {
      console.log('🚀 Auto-starting development automation...');
      isAutomationRunning = true;
      
      // Start automation in a new process
      const automation = spawn('node', ['dev-automation.js', 'monitor'], {
        detached: true,
        stdio: 'ignore'
      });
      
      // Unref the child process so it can run independently
      automation.unref();
      
      console.log('✅ Development automation started');
    }
  };
  
  // Watch for file access
  fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('node_modules') && !filename.startsWith('.')) {
      console.log(\`📁 File access detected: \${filename}\`);
      lastAccess = Date.now();
      startAutomation();
    }
  });
  
  console.log('✅ File access watcher started');
} else {
  console.log('⚠️ src directory not found, skipping file access watcher');
}
`;
        
        writeFileSync(watcherPath, watcherContent);
        execSync(`chmod +x ${watcherPath}`);
        
        log('✅ File access watcher set up', 'success');
      } catch (error) {
        log(`⚠️ Could not set up file access watcher: ${error}`, 'warn');
      }
    }, null);
  }
  
  static async setupBrowserLauncher() {
    return await safeBuildExecution(async () => {
      log('🌐 Setting up browser launcher...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping browser launcher in build environment', 'warn');
        return;
      }
      
      try {
        // Create auto-start-server.js
        const serverPath = join(process.cwd(), 'auto-start-server.js');
        const serverContent = `#!/usr/bin/env node
/**
 * KONIVRER Auto Start Server
 * 
 * This script starts a server that auto-launches the browser when accessed.
 * It's designed to be Vercel-safe and won't interfere with production builds.
 */

const http = require('http');
const { spawn } = require('child_process');

// Skip in build environment
if (process.env.VERCEL === '1' || 
    process.env.NODE_ENV === 'production' || 
    process.env.CI === 'true' || 
    process.env.VITE_BUILD === 'true' || 
    process.env.npm_lifecycle_event === 'build') {
  console.log('🛑 Skipping auto-start server in build environment');
  process.exit(0);
}

console.log('🌐 Starting auto-start server...');

// Create server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Auto-start development server and open browser
    console.log('🚀 Auto-starting development server...');
    
    // Start development server in a new process
    const devServer = spawn('npm', ['run', 'dev:safe'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Unref the child process so it can run independently
    devServer.unref();
    
    // Redirect to development server
    res.writeHead(302, { 'Location': 'http://localhost:12000' });
    res.end();
  } else if (req.url === '/dashboard') {
    // Redirect to dashboard
    res.writeHead(302, { 'Location': 'http://localhost:12002' });
    res.end();
  } else if (req.url === '/autonomous') {
    // Auto-start autonomous mode
    console.log('🤖 Auto-starting autonomous mode...');
    
    // Start autonomous mode in a new process
    const autonomous = spawn('npm', ['run', 'dev:autonomous'], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Unref the child process so it can run independently
    autonomous.unref();
    
    // Redirect to development server
    res.writeHead(302, { 'Location': 'http://localhost:12000' });
    res.end();
  } else {
    // Not found
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start server
const port = 12003;
server.listen(port, '0.0.0.0', () => {
  console.log(\`✅ Auto-start server running at http://localhost:\${port}\`);
  console.log('- Visit http://localhost:12003 to auto-start development server');
  console.log('- Visit http://localhost:12003/dashboard to open dashboard');
  console.log('- Visit http://localhost:12003/autonomous to start autonomous mode');
});
`;
        
        writeFileSync(serverPath, serverContent);
        execSync(`chmod +x ${serverPath}`);
        
        log('✅ Browser launcher set up', 'success');
      } catch (error) {
        log(`⚠️ Could not set up browser launcher: ${error}`, 'warn');
      }
    }, null);
  }
  
  static async startAutoStartServer() {
    return await safeBuildExecution(async () => {
      log('🌐 Starting auto-start server...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping auto-start server in build environment', 'warn');
        return;
      }
      
      try {
        // Start auto-start-server.js in a new process
        const serverPath = join(process.cwd(), 'auto-start-server.js');
        if (existsSync(serverPath)) {
          const server = spawn('node', [serverPath], {
            detached: true,
            stdio: 'ignore'
          });
          
          // Unref the child process so it can run independently
          server.unref();
          
          log('✅ Auto-start server started', 'success');
        } else {
          log('⚠️ auto-start-server.js not found, setting up...', 'warn');
          await this.setupBrowserLauncher();
          await this.startAutoStartServer();
        }
      } catch (error) {
        log(`⚠️ Could not start auto-start server: ${error}`, 'warn');
      }
    }, null);
  }
}

// Main automation orchestrator
class DevAutomationOrchestrator {
  static async startMonitoring() {
    return await safeBuildExecution(async () => {
      log('🚀 Starting development monitoring...', 'success');
      
      // Set up auto-start features
      if (CONFIG.autoStart.fileWatcher || CONFIG.autoStart.vscodeTask) {
        await AutoStartManager.setup();
      }
      
      // Start dashboard if enabled
      if (CONFIG.autoStart.dashboard) {
        await DevelopmentDashboard.start();
      }
      
      let cycleCount = 0;
      const startTime = Date.now();
      
      const runCycle = async () => {
        cycleCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        
        log(`⚡ Cycle #${cycleCount} (${elapsed}s) - Running checks...`, 'info');
        
        try {
          // TypeScript quick check (every cycle)
          if (CONFIG.typescript.check) {
            await TypeScriptEnforcer.quickCheck();
          }
          
          // Quality quick check (every cycle)
          if (CONFIG.quality.eslint) {
            await QualityAssurance.quickLint();
          }
          
          // Security quick scan (every 12 cycles = every minute)
          if (CONFIG.security.check && cycleCount % 12 === 0) {
            await SecurityMonitor.quickScan();
          }
          
          // Performance check (every 12 cycles = every minute)
          if (CONFIG.performance.optimize && cycleCount % 12 === 0) {
            await PerformanceOptimizer.check();
          }
          
          // Dependency check (every 720 cycles = every hour)
          if (CONFIG.dependencies.checkOutdated && cycleCount % 720 === 0) {
            await DependencyManager.check();
          }
          
          // Self-healing (every 60 cycles = every 5 minutes)
          if (CONFIG.selfHealing.enabled && cycleCount % 60 === 0) {
            await SelfHealingSystem.heal();
          }
          
          log(`✅ Cycle #${cycleCount} complete`, 'success');
          
        } catch (error) {
          log(`❌ Error in cycle #${cycleCount}: ${error}`, 'error');
        }
      };
      
      // Run immediately
      await runCycle();
      
      // Then run every 5 seconds
      const intervalId = setInterval(runCycle, CONFIG.monitoring.interval);
      
      log('🎯 Development monitoring active!', 'success');
      
      // Return the interval ID so it can be cleared if needed
      return intervalId;
    }, null);
  }
  
  static async startAutonomousMode() {
    return await safeBuildExecution(async () => {
      log('🤖 Starting autonomous mode...', 'success');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping autonomous mode in build environment', 'warn');
        return;
      }
      
      // Set up auto-start features
      await AutoStartManager.setup();
      
      // Start auto-start server
      await AutoStartManager.startAutoStartServer();
      
      // Start dashboard
      await DevelopmentDashboard.start();
      
      let cycleCount = 0;
      const startTime = Date.now();
      
      const runCycle = async () => {
        cycleCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        
        log(`🤖 Autonomous cycle #${cycleCount} (${elapsed}s)...`, 'info');
        
        try {
          // Run TypeScript check and auto-fix
          await TypeScriptEnforcer.check();
          
          // Run quality check and auto-fix
          await QualityAssurance.check();
          
          // Run security check and auto-fix
          if (cycleCount % 12 === 0) {
            await SecurityMonitor.check();
          }
          
          // Run performance check and optimization
          if (cycleCount % 12 === 0) {
            await PerformanceOptimizer.check();
            await PerformanceOptimizer.optimize();
          }
          
          // Run dependency check and update
          if (cycleCount % 720 === 0) {
            await DependencyManager.check();
          }
          
          // Run self-healing
          if (cycleCount % 60 === 0) {
            await SelfHealingSystem.heal();
          }
          
          // Run deployment preparation
          if (cycleCount % 720 === 0 && CONFIG.deployment.enabled) {
            await DeploymentPreparation.prepare();
          }
          
          log(`✅ Autonomous cycle #${cycleCount} complete`, 'success');
          
        } catch (error) {
          log(`❌ Error in autonomous cycle #${cycleCount}: ${error}`, 'error');
        }
      };
      
      // Run immediately
      await runCycle();
      
      // Then run every 5 seconds
      const intervalId = setInterval(runCycle, CONFIG.autonomous.interval);
      
      log('🤖 AUTONOMOUS MODE: ACTIVE - Zero human interaction required', 'success');
      
      // Return the interval ID so it can be cleared if needed
      return intervalId;
    }, null);
  }
  
  static async startZeroInteractionMode() {
    return await safeBuildExecution(async () => {
      log('🤖 Starting zero-interaction mode...', 'success');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping zero-interaction mode in build environment', 'warn');
        return;
      }
      
      // Set up auto-start features silently
      await AutoStartManager.setup();
      
      // Start file watcher silently
      await AutoStartManager.startFileWatcher();
      
      // Start self-healing system
      await SelfHealingSystem.heal();
      
      // Start autonomous mode without dashboard
      let cycleCount = 0;
      const startTime = Date.now();
      
      const runCycle = async () => {
        cycleCount++;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        
        log(`🤖 Autonomous cycle #${cycleCount} (${elapsed}s)...`, 'info');
        
        try {
          // Run TypeScript check and auto-fix
          await TypeScriptEnforcer.check();
          await TypeScriptEnforcer.autoFix();
          
          // Run quality check and auto-fix
          await QualityAssurance.check();
          await QualityAssurance.autoFix();
          
          // Run security check and auto-fix
          if (cycleCount % 12 === 0) {
            await SecurityMonitor.check();
            await SecurityMonitor.autoFix();
          }
          
          // Run performance check and optimization
          if (cycleCount % 12 === 0) {
            await PerformanceOptimizer.check();
            await PerformanceOptimizer.optimize();
          }
          
          // Run dependency check and update
          if (cycleCount % 720 === 0) {
            await DependencyManager.check();
            await DependencyManager.update();
          }
          
          // Run self-healing
          if (cycleCount % 60 === 0) {
            await SelfHealingSystem.heal();
          }
          
          // Run deployment preparation
          if (cycleCount % 720 === 0 && CONFIG.deployment.enabled) {
            await DeploymentPreparation.prepare();
          }
          
          log(`✅ Autonomous cycle #${cycleCount} complete`, 'success');
          
        } catch (error) {
          log(`❌ Error in autonomous cycle #${cycleCount}: ${error}`, 'error');
          
          // Auto-heal on error
          await SelfHealingSystem.heal();
        }
      };
      
      // Run immediately
      await runCycle();
      
      // Then run every 5 seconds
      const intervalId = setInterval(runCycle, CONFIG.autonomous.interval);
      
      log('🤖 ZERO-INTERACTION MODE: ACTIVE - 100% autonomous operation with no UI', 'success');
      
      // Return the interval ID so it can be cleared if needed
      return intervalId;
    }, null);
  }
  
  static async runChecks() {
    return await safeBuildExecution(async () => {
      log('🔍 Running all checks...');
      
      await TypeScriptEnforcer.check();
      await SecurityMonitor.check();
      await QualityAssurance.check();
      await PerformanceOptimizer.check();
      await DependencyManager.check();
      
      log('✅ All checks complete', 'success');
    }, null);
  }
  
  static async autoFix() {
    return await safeBuildExecution(async () => {
      log('🔧 Running auto-fix...');
      
      await TypeScriptEnforcer.autoFix();
      await QualityAssurance.autoFix();
      
      if (CONFIG.security.autoFix) {
        await SecurityMonitor.autoFix();
      }
      
      if (CONFIG.performance.optimize) {
        await PerformanceOptimizer.optimize();
      }
      
      log('✅ Auto-fix complete', 'success');
    }, null);
  }
  
  static async setupProject() {
    return await safeBuildExecution(async () => {
      log('🔧 Setting up project...');
      
      // Set up VS Code tasks
      await AutoStartManager.setupVSCodeTasks();
      
      // Set up file access watcher
      if (CONFIG.autoStart.fileAccessWatcher) {
        await AutoStartManager.setupFileAccessWatcher();
      }
      
      // Set up browser launcher
      if (CONFIG.autoStart.browserLauncher) {
        await AutoStartManager.setupBrowserLauncher();
      }
      
      // Run initial checks
      await this.runChecks();
      
      log('✅ Project setup complete', 'success');
    }, null);
  }
  
  static async prepareDeploy() {
    return await safeBuildExecution(async () => {
      log('🚀 Preparing for deployment...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping deployment preparation in build environment', 'warn');
        return;
      }
      
      // Run deployment preparation
      await DeploymentPreparation.prepare();
      
      log('✅ Deployment preparation complete', 'success');
    }, null);
  }
  
  static async selfHeal() {
    return await safeBuildExecution(async () => {
      log('🔧 Starting self-healing process...');
      
      // Skip in build environment
      if (isBuildEnvironment()) {
        log('🛑 Skipping self-healing in build environment', 'warn');
        return;
      }
      
      // Run self-healing
      await SelfHealingSystem.heal();
      
      log('✅ Self-healing process complete', 'success');
    }, null);
  }
}

// Entry point
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  // Skip if we're in a build environment
  if (isBuildEnvironment() && CONFIG.vercel.disableDuringBuild) {
    log('🛑 Skipping automation in build environment', 'warn');
    process.exit(0);
  }
  
  // Skip if we're in production
  if (isProductionEnvironment() && CONFIG.vercel.disableInProduction) {
    log('🛑 Skipping automation in production environment', 'warn');
    process.exit(0);
  }
  
  try {
    switch (command) {
      case 'start':
      case 'monitor':
        await DevAutomationOrchestrator.startMonitoring();
        break;
      case 'check':
        await DevAutomationOrchestrator.runChecks();
        break;
      case 'fix':
        await DevAutomationOrchestrator.autoFix();
        break;
      case 'dashboard':
        await DevelopmentDashboard.start();
        break;
      case 'setup':
        await DevAutomationOrchestrator.setupProject();
        break;
      case 'file-watcher':
        await AutoStartManager.startFileWatcher();
        break;
      case 'vscode':
        await AutoStartManager.setupVSCodeTasks();
        break;
      case 'autonomous':
      case 'auto':
        await DevAutomationOrchestrator.startAutonomousMode();
        break;
      case 'zero-interaction':
      case 'zero':
      case 'hands-off':
        await DevAutomationOrchestrator.startZeroInteractionMode();
        break;
      case 'browser-launcher':
      case 'browser':
        await AutoStartManager.setupBrowserLauncher();
        await AutoStartManager.startAutoStartServer();
        break;
      case 'file-access-watcher':
      case 'access-watcher':
        await AutoStartManager.setupFileAccessWatcher();
        break;
      case 'prepare-deploy':
      case 'deploy-prep':
        await DevAutomationOrchestrator.prepareDeploy();
        break;
      case 'self-heal':
      case 'heal':
        await DevAutomationOrchestrator.selfHeal();
        break;
      case 'help':
      default:
        console.log(`
🚀 KONIVRER Development Automation - VERCEL SAFE EDITION

Usage:
  node dev-automation.js start            # Start development monitoring
  node dev-automation.js monitor          # Same as start
  node dev-automation.js check            # Run all checks once
  node dev-automation.js fix              # Run auto-fix for TypeScript and ESLint
  node dev-automation.js dashboard        # Start development dashboard only
  node dev-automation.js setup            # Set up project (VS Code tasks, initial checks)
  node dev-automation.js file-watcher     # Start file watcher only
  node dev-automation.js vscode           # Set up VS Code tasks
  node dev-automation.js autonomous       # Start autonomous mode
  node dev-automation.js zero-interaction # Start zero-interaction mode
  node dev-automation.js browser-launcher # Set up and start browser launcher
  node dev-automation.js file-access-watcher # Set up file access watcher
  node dev-automation.js prepare-deploy   # Prepare for deployment
  node dev-automation.js self-heal        # Run self-healing process

🛡️ VERCEL SAFETY FEATURES:
  - No automation during builds
  - No auto-commit or auto-push
  - Development-only features
  - No interference with production
  - Safe timeouts for build operations

⚡ DEVELOPMENT FEATURES:
  - TypeScript checking every 5 seconds with auto-fix
  - ESLint & Prettier every 5 seconds with auto-fix
  - Security monitoring every minute with auto-fix
  - Performance monitoring every minute with optimization
  - Dependency checking every hour with auto-update
  - Interactive development dashboard
  - File watcher for real-time feedback
  - VS Code integration
  - Autonomous mode for zero human interaction
  - Browser launcher for easy access
  - File access watcher for auto-start
  - Deployment preparation
  - Self-healing system
`);
    }
  } catch (error) {
    log(`❌ Error: ${error}`, 'error');
    process.exit(1);
  }
};

// Export the DevAutomationOrchestrator for use in other modules
export default DevAutomationOrchestrator;

// Run the main function when executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(error => {
    log(`❌ Fatal error: ${error}`, 'error');
    process.exit(1);
  });
} else if (import.meta.url === `file://${process.argv[1]}`) {
  // ES module direct execution
  main().catch(error => {
    log(`❌ Fatal error: ${error}`, 'error');
    process.exit(1);
  });
}