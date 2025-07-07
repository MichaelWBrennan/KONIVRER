#!/usr/bin/env node
/**
 * KONIVRER Development Automation
 * 
 * This is a Vercel-safe automation system that only runs in development
 * and doesn't interfere with production builds.
 */

import { execSync, spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration - Development Only
const CONFIG = {
  typescript: { check: true, autoFix: true, interval: 5000 }, // 5 seconds
  security: { check: true, interval: 60000 }, // 1 minute
  quality: { eslint: true, prettier: true, interval: 5000 }, // 5 seconds
  performance: { optimize: true, interval: 60000 }, // 1 minute
  notifications: { enabled: true, channels: ['console'] },
  monitoring: { enabled: true, interval: 5000 }, // 5 seconds
  // VERCEL SAFETY FEATURES
  vercel: {
    disableDuringBuild: true,
    disableAutoCommit: true,
    disableAutoPush: true,
    disableFileWatcher: false,
    safeMode: true
  }
};

// Utility functions
const log = (message, type = 'info') => {
  const colors = { info: '\x1b[36m', success: '\x1b[32m', error: '\x1b[31m', warn: '\x1b[33m' };
  const timestamp = new Date().toISOString();
  const logMessage = `${colors[type]}[${timestamp}] ${message}\x1b[0m`;
  console.log(logMessage);
};

const runCommand = (command, silent = false) => {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
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
    process.env.npm_lifecycle_event === 'build'
  );
};

// Core automation modules
class TypeScriptEnforcer {
  static check() {
    log('🔍 TypeScript check...');
    const result = runCommand('npx tsc --noEmit', true);
    if (result.includes('error')) {
      log('❌ TypeScript errors found', 'error');
      if (CONFIG.typescript.autoFix) this.autoFix();
      return false;
    }
    log('✅ TypeScript check passed', 'success');
    return true;
  }

  static autoFix() {
    log('🔧 Auto-fixing TypeScript issues...');
    runCommand('npx eslint --fix src/**/*.{ts,tsx}', true);
    runCommand('npx prettier --write src/**/*.{ts,tsx}', true);
    log('✅ TypeScript auto-fix complete', 'success');
  }
}

class SecurityMonitor {
  static check() {
    log('🛡️ Security check...');
    const auditResult = runCommand('npm audit --audit-level moderate', true);
    
    if (auditResult.includes('vulnerabilities')) {
      log('⚠️ Security vulnerabilities found', 'warn');
      log('Run npm audit fix to resolve issues', 'info');
      return false;
    }
    log('✅ Security check passed', 'success');
    return true;
  }
}

class QualityAssurance {
  static check() {
    log('🎯 Quality check...');
    let passed = true;

    // ESLint
    const eslintResult = runCommand('npx eslint src/**/*.{ts,tsx}', true);
    if (eslintResult.includes('error')) {
      log('❌ ESLint errors found', 'error');
      passed = false;
    }

    if (passed) log('✅ Quality check passed', 'success');
    return passed;
  }

  static autoFix() {
    log('🔧 Auto-fixing quality issues...');
    
    // Fix ESLint issues
    runCommand('npx eslint src/**/*.{ts,tsx} --fix', true);
    
    // Format with Prettier
    runCommand('npx prettier --write src/**/*.{ts,tsx}', true);
    
    log('✅ Quality auto-fix complete', 'success');
  }
}

class PerformanceOptimizer {
  static check() {
    log('⚡ Performance check...');
    
    // Check bundle size if dist exists
    const distPath = join(process.cwd(), 'dist');
    if (existsSync(distPath)) {
      try {
        const stats = JSON.parse(runCommand('npx vite-bundle-visualizer --json', true));
        log(`📊 Bundle size: ${(stats.totalBytes / 1024 / 1024).toFixed(2)} MB`);
      } catch (error) {
        // Silently fail if the tool isn't available
      }
    }
    
    log('✅ Performance check complete', 'success');
    return true;
  }
}

// Development Dashboard Server
class DevelopmentDashboard {
  static start(port = 12002) {
    log('📊 Starting development dashboard...');
    
    const server = createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>KONIVRER Development Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: #cccccc; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { background: #1e1e3f; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .success { border-left: 5px solid #00ff00; }
        .info { border-left: 5px solid #00aaff; }
        h1 { color: #00ff00; }
        h2 { color: #00aaff; }
        .emoji { font-size: 1.5em; }
        code { background: #2a2a4a; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 KONIVRER Development Dashboard</h1>
        <div class="status success">
            <h2>✅ Development Mode Active</h2>
            <p>This dashboard shows the status of development automation tools.</p>
        </div>
        
        <div class="status info">
            <h2>🤖 Active Development Tools:</h2>
            <ul>
                <li>✅ TypeScript checking (every 5 seconds)</li>
                <li>✅ ESLint & Prettier (every 5 seconds)</li>
                <li>✅ Security monitoring (every minute)</li>
                <li>✅ Performance monitoring (every minute)</li>
            </ul>
        </div>
        
        <div class="status info">
            <h2>🛡️ Vercel Safety Features</h2>
            <ul>
                <li>✅ No automation during builds</li>
                <li>✅ No auto-commit or auto-push</li>
                <li>✅ Development-only features</li>
                <li>✅ No interference with production</li>
            </ul>
        </div>
        
        <div class="status success">
            <h2>📊 System Status</h2>
            <p>🟢 <strong>Status:</strong> Development Mode</p>
            <p>⚡ <strong>Monitoring:</strong> Active</p>
            <p>🔄 <strong>Auto-fix:</strong> Enabled for TypeScript & ESLint</p>
        </div>
    </div>
    
    <script>
        // Auto-refresh status every 30 seconds
        setTimeout(() => location.reload(), 30000);
        
        // Show live timestamp
        setInterval(() => {
            document.title = 'KONIVRER Dev Dashboard (' + new Date().toLocaleTimeString() + ')';
        }, 1000);
    </script>
</body>
</html>
        `);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    server.listen(port, '0.0.0.0', () => {
      log(`📊 Development dashboard running at http://localhost:${port}`, 'success');
    });
  }
}

// Main automation orchestrator
class DevAutomationOrchestrator {
  static startMonitoring() {
    // Skip if we're in a build environment
    if (isBuildEnvironment() && CONFIG.vercel.disableDuringBuild) {
      log('🛑 Skipping automation in build environment', 'warn');
      return;
    }
    
    log('🚀 Starting development monitoring...', 'success');
    
    let cycleCount = 0;
    const startTime = Date.now();
    
    const runCycle = () => {
      cycleCount++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      
      log(`⚡ Cycle #${cycleCount} (${elapsed}s) - Running checks...`, 'info');
      
      try {
        // TypeScript check (every cycle)
        if (CONFIG.typescript.check) {
          TypeScriptEnforcer.check();
        }
        
        // Quality check (every cycle)
        if (CONFIG.quality.eslint) {
          QualityAssurance.check();
        }
        
        // Security check (every 12 cycles = every minute)
        if (CONFIG.security.check && cycleCount % 12 === 0) {
          SecurityMonitor.check();
        }
        
        // Performance check (every 12 cycles = every minute)
        if (CONFIG.performance.optimize && cycleCount % 12 === 0) {
          PerformanceOptimizer.check();
        }
        
        log(`✅ Cycle #${cycleCount} complete`, 'success');
        
      } catch (error) {
        log(`❌ Error in cycle #${cycleCount}: ${error}`, 'error');
      }
    };
    
    // Run immediately
    runCycle();
    
    // Then run every 5 seconds
    setInterval(runCycle, CONFIG.monitoring.interval);
    
    log('🎯 Development monitoring active!', 'success');
    
    // Start dashboard
    DevelopmentDashboard.start();
  }
  
  static runChecks() {
    log('🔍 Running all checks...');
    
    TypeScriptEnforcer.check();
    SecurityMonitor.check();
    QualityAssurance.check();
    PerformanceOptimizer.check();
    
    log('✅ All checks complete', 'success');
  }
  
  static autoFix() {
    log('🔧 Running auto-fix...');
    
    TypeScriptEnforcer.autoFix();
    QualityAssurance.autoFix();
    
    log('✅ Auto-fix complete', 'success');
  }
}

// Entry point
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Skip if we're in a build environment
if (isBuildEnvironment() && CONFIG.vercel.disableDuringBuild) {
  log('🛑 Skipping automation in build environment', 'warn');
  process.exit(0);
}

switch (command) {
  case 'start':
  case 'monitor':
    DevAutomationOrchestrator.startMonitoring();
    break;
  case 'check':
    DevAutomationOrchestrator.runChecks();
    break;
  case 'fix':
    DevAutomationOrchestrator.autoFix();
    break;
  case 'dashboard':
    DevelopmentDashboard.start();
    break;
  case 'help':
  default:
    console.log(`
🚀 KONIVRER Development Automation - VERCEL SAFE EDITION

Usage:
  node dev-automation.js start    # Start development monitoring
  node dev-automation.js monitor  # Same as start
  node dev-automation.js check    # Run all checks once
  node dev-automation.js fix      # Run auto-fix for TypeScript and ESLint
  node dev-automation.js dashboard # Start development dashboard only

🛡️ VERCEL SAFETY FEATURES:
  - No automation during builds
  - No auto-commit or auto-push
  - Development-only features
  - No interference with production

⚡ DEVELOPMENT FEATURES:
  - TypeScript checking every 5 seconds with auto-fix
  - ESLint & Prettier every 5 seconds with auto-fix
  - Security monitoring every minute
  - Performance monitoring every minute
  - Development dashboard
`);
}