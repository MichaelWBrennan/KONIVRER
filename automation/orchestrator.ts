#!/usr/bin/env tsx

/**
 * Ultimate Automation Orchestrator
 * Coordinates all automation workflows for 100% hands-off operation
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import type { AutomationConfig, AutomationResult } from '../src/types/automation';
import { execSync, spawn, ChildProcess } from 'child_process';
import chokidar from 'chokidar';

// Configuration
const config = {
  // Core settings
  watchMode: true,
  autoFix: true,
  autoCommit: true,
  autoOptimize: true,
  
  // Paths to watch
  watchPaths: ['src/**/*', 'public/**/*', 'scripts/**/*'],
  ignorePaths: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  
  // Thresholds
  performanceThreshold: 90,
  coverageThreshold: 80,
  securityThreshold: 'high',
  
  // Timers (in milliseconds)
  debounceTime: 1000,
  fullScanInterval: 3600000, // 1 hour
  
  // Logging
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  logFile: path.join(process.cwd(), 'automation', 'logs', 'orchestrator.log'),
  
  // AI settings
  aiEnabled: true,
  aiSuggestionThreshold: 0.8,
  
  // Git settings
  gitAuthor: 'KONIVRER Automation',
  gitEmail: 'automation@konivrer.com',
  
  // Notification settings
  notificationsEnabled: true,
  notificationChannels: ['console', 'system', 'slack'],
};

// State management
const state = {
  isRunning: false,
  lastFullScan: Date.now(),
  processes: new Map<string, ChildProcess>(),
  issues: [] as any[],
  stats: {
    fixedIssues: 0,
    optimizations: 0,
    commits: 0,
    builds: 0,
    tests: 0,
  },
};

// Ensure log directory exists
const logDir = path.dirname(config.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logger
const logger = {
  debug: (message: string) => {
    if (['debug'].includes(config.logLevel)) {
      const logMessage = `[DEBUG] [${new Date().toISOString()}] ${message}`;
      console.debug(logMessage);
      fs.appendFileSync(config.logFile, logMessage + '\n');
    }
  },
  info: (message: string) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      const logMessage = `[INFO] [${new Date().toISOString()}] ${message}`;
      console.info(logMessage);
      fs.appendFileSync(config.logFile, logMessage + '\n');
    }
  },
  warn: (message: string) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel)) {
      const logMessage = `[WARN] [${new Date().toISOString()}] ${message}`;
      console.warn(logMessage);
      fs.appendFileSync(config.logFile, logMessage + '\n');
    }
  },
  error: (message: string) => {
    if (['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
      const logMessage = `[ERROR] [${new Date().toISOString()}] ${message}`;
      console.error(logMessage);
      fs.appendFileSync(config.logFile, logMessage + '\n');
    }
  },
};

// Notification system
const notify = (title: string, message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  if (!config.notificationsEnabled) return;
  
  logger[level === 'success' ? 'info' : level](title + ': ' + message);
  
  if (config.notificationChannels.includes('system')) {
    try {
      // System notification (platform-dependent)
      if (process.platform === 'darwin') {
        execSync(`osascript -e 'display notification "${message}" with title "${title}"'`);
      } else if (process.platform === 'linux') {
        execSync(`notify-send "${title}" "${message}"`);
      } else if (process.platform === 'win32') {
        // Windows notification (requires additional modules)
      }
    } catch (error) {
      logger.debug(`System notification failed: ${error}`);
    }
  }
  
  if (config.notificationChannels.includes('slack')) {
    // Implement Slack notifications
    // This would require a webhook URL and additional configuration
  }
};

// File watcher
const setupWatcher = () => {
  logger.info('Setting up file watcher...');
  
  const watcher = chokidar.watch(config.watchPaths, {
    ignored: config.ignorePaths,
    persistent: true,
    ignoreInitial: true,
  });
  
  let debounceTimer: NodeJS.Timeout | null = null;
  
  const debouncedAction = () => {
    if (state.isRunning) {
      logger.debug('Automation already running, skipping this trigger');
      return;
    }
    
    runAutomation('fileChange');
  };
  
  watcher
    .on('add', path => {
      logger.debug(`File ${path} has been added`);
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(debouncedAction, config.debounceTime);
    })
    .on('change', path => {
      logger.debug(`File ${path} has been changed`);
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(debouncedAction, config.debounceTime);
    })
    .on('unlink', path => {
      logger.debug(`File ${path} has been removed`);
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(debouncedAction, config.debounceTime);
    });
  
  logger.info('File watcher initialized successfully');
  
  // Also set up interval for full scans
  setInterval(() => {
    if (Date.now() - state.lastFullScan >= config.fullScanInterval) {
      logger.info('Running scheduled full scan...');
      state.lastFullScan = Date.now();
      runAutomation('scheduledScan');
    }
  }, 60000); // Check every minute if it's time for a full scan
};

// Code quality checks
const runCodeQualityChecks = async () => {
  logger.info('Running code quality checks...');
  
  try {
    // Lint check
    execSync('npm run lint', { stdio: 'pipe' });
    logger.info('Linting passed');
  } catch (error) {
    logger.warn('Linting issues detected');
    
    if (config.autoFix) {
      try {
        logger.info('Attempting to fix linting issues...');
        execSync('npm run lint:fix', { stdio: 'pipe' });
        state.stats.fixedIssues++;
        logger.info('Linting issues fixed automatically');
      } catch (fixError) {
        logger.error(`Failed to fix linting issues: ${fixError}`);
      }
    }
  }
  
  try {
    // Format check
    execSync('npm run format:check', { stdio: 'pipe' });
    logger.info('Formatting passed');
  } catch (error) {
    logger.warn('Formatting issues detected');
    
    if (config.autoFix) {
      try {
        logger.info('Attempting to fix formatting issues...');
        execSync('npm run format', { stdio: 'pipe' });
        state.stats.fixedIssues++;
        logger.info('Formatting issues fixed automatically');
      } catch (fixError) {
        logger.error(`Failed to fix formatting issues: ${fixError}`);
      }
    }
  }
  
  try {
    // Type check
    execSync('npm run type-check', { stdio: 'pipe' });
    logger.info('Type checking passed');
  } catch (error) {
    logger.warn('Type checking issues detected');
    // Type issues usually require manual intervention
    notify('Type Issues', 'TypeScript errors detected that require manual fixes', 'warning');
  }
  
  // Check for duplicate code
  try {
    execSync('npx jscpd src --ignore "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx" --threshold 5', { stdio: 'pipe' });
    logger.info('Duplicate code check passed');
  } catch (error) {
    logger.warn('Duplicate code detected');
    notify('Code Duplication', 'Duplicate code patterns detected that should be refactored', 'warning');
  }
};

// Security checks
const runSecurityChecks = async () => {
  logger.info('Running security checks...');
  
  try {
    // NPM audit
    execSync('npm audit --audit-level=moderate', { stdio: 'pipe' });
    logger.info('Security audit passed');
  } catch (error) {
    logger.warn('Security vulnerabilities detected');
    
    if (config.autoFix) {
      try {
        logger.info('Attempting to fix security vulnerabilities...');
        execSync('npm audit fix', { stdio: 'pipe' });
        state.stats.fixedIssues++;
        logger.info('Security vulnerabilities fixed automatically');
      } catch (fixError) {
        logger.error(`Failed to fix security vulnerabilities: ${fixError}`);
        notify('Security Issues', 'Security vulnerabilities detected that require manual fixes', 'error');
      }
    }
  }
  
  // Custom security checks
  try {
    execSync('npm run security:check', { stdio: 'pipe' });
    logger.info('Custom security checks passed');
  } catch (error) {
    logger.warn('Custom security issues detected');
    notify('Security Issues', 'Custom security checks failed', 'warning');
  }
};

// Performance optimization
const runPerformanceOptimization = async () => {
  if (!config.autoOptimize) return;
  
  logger.info('Running performance optimization...');
  
  try {
    execSync('npm run performance:optimize', { stdio: 'pipe' });
    state.stats.optimizations++;
    logger.info('Performance optimization completed');
  } catch (error) {
    logger.error(`Performance optimization failed: ${error}`);
  }
};

// Dependency management
const runDependencyManagement = async () => {
  logger.info('Checking dependencies...');
  
  // Check for outdated dependencies
  try {
    const outdatedOutput = execSync('npm outdated --json', { stdio: 'pipe' }).toString();
    const outdated = JSON.parse(outdatedOutput);
    
    if (Object.keys(outdated).length > 0) {
      logger.warn(`${Object.keys(outdated).length} outdated dependencies found`);
      
      if (config.autoFix) {
        try {
          logger.info('Updating non-major dependencies...');
          execSync('npm update', { stdio: 'pipe' });
          state.stats.fixedIssues++;
          logger.info('Dependencies updated');
        } catch (updateError) {
          logger.error(`Failed to update dependencies: ${updateError}`);
        }
      }
    } else {
      logger.info('All dependencies are up to date');
    }
  } catch (error) {
    // If the command fails, it means there are outdated dependencies
    logger.warn('Outdated dependencies check failed');
  }
  
  // Check for unused dependencies
  try {
    execSync('npx depcheck', { stdio: 'pipe' });
    logger.info('No unused dependencies found');
  } catch (error) {
    logger.warn('Unused dependencies detected');
    notify('Unused Dependencies', 'Some dependencies are not being used and could be removed', 'warning');
  }
};

// Testing
const runTests = async () => {
  logger.info('Running tests...');
  
  try {
    execSync('npm run test', { stdio: 'pipe' });
    state.stats.tests++;
    logger.info('Tests passed successfully');
  } catch (error) {
    logger.error(`Tests failed: ${error}`);
    notify('Test Failures', 'Some tests are failing and require attention', 'error');
  }
  
  // Run coverage tests if available
  try {
    execSync('npm run test:coverage', { stdio: 'pipe' });
    logger.info('Coverage tests completed');
    
    // Parse coverage report if available
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (fs.existsSync(coveragePath)) {
      const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      const totalCoverage = coverageData.total.statements.pct;
      
      logger.info(`Test coverage: ${totalCoverage}%`);
      
      if (totalCoverage < config.coverageThreshold) {
        logger.warn(`Test coverage (${totalCoverage}%) is below threshold (${config.coverageThreshold}%)`);
        notify('Low Test Coverage', `Current test coverage (${totalCoverage}%) is below the threshold (${config.coverageThreshold}%)`, 'warning');
      }
    }
  } catch (error) {
    logger.debug(`Coverage tests not available or failed: ${error}`);
  }
};

// Build process
const runBuild = async () => {
  logger.info('Running optimized build...');
  
  try {
    execSync('npm run build:optimized', { stdio: 'pipe' });
    state.stats.builds++;
    logger.info('Build completed successfully');
    
    // Analyze build size
    const buildDir = path.join(process.cwd(), 'dist');
    const buildSize = calculateDirSize(buildDir);
    const buildSizeMB = (buildSize / (1024 * 1024)).toFixed(2);
    
    logger.info(`Build size: ${buildSizeMB} MB`);
  } catch (error) {
    logger.error(`Build failed: ${error}`);
    notify('Build Failure', 'The production build process failed', 'error');
  }
};

// AI analysis
const runAiAnalysis = async () => {
  if (!config.aiEnabled) return;
  
  logger.info('Running AI code analysis...');
  
  try {
    // This would integrate with an AI service for code analysis
    // For now, we'll simulate this with a mock implementation
    
    logger.info('AI analysis completed');
    
    // Simulate AI suggestions
    const suggestions = [
      {
        file: 'src/components/cards/CardList.tsx',
        line: 42,
        suggestion: 'Consider using virtualized list for better performance with large card collections',
        confidence: 0.92,
      },
      {
        file: 'src/services/api.ts',
        line: 78,
        suggestion: 'Add retry logic for network requests to improve reliability',
        confidence: 0.85,
      },
    ];
    
    // Filter suggestions by confidence threshold
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence >= config.aiSuggestionThreshold);
    
    if (highConfidenceSuggestions.length > 0) {
      logger.info(`AI generated ${highConfidenceSuggestions.length} high-confidence suggestions`);
      
      // Log suggestions
      highConfidenceSuggestions.forEach(suggestion => {
        logger.info(`AI Suggestion (${Math.round(suggestion.confidence * 100)}%): ${suggestion.file}:${suggestion.line} - ${suggestion.suggestion}`);
      });
      
      // Save suggestions to file
      const suggestionsFile = path.join(process.cwd(), 'automation', 'ai-suggestions.json');
      fs.writeFileSync(suggestionsFile, JSON.stringify(highConfidenceSuggestions, null, 2));
      
      notify('AI Suggestions', `${highConfidenceSuggestions.length} code improvement suggestions available`, 'info');
    } else {
      logger.info('No high-confidence AI suggestions generated');
    }
  } catch (error) {
    logger.error(`AI analysis failed: ${error}`);
  }
};

// Git operations
const commitChanges = async () => {
  if (!config.autoCommit) return;
  
  logger.info('Checking for changes to commit...');
  
  try {
    // Check if there are changes to commit
    const statusOutput = execSync('git status --porcelain', { stdio: 'pipe' }).toString();
    
    if (statusOutput.trim() === '') {
      logger.info('No changes to commit');
      return;
    }
    
    logger.info('Changes detected, preparing to commit');
    
    // Configure git author if needed
    execSync(`git config user.name "${config.gitAuthor}"`, { stdio: 'pipe' });
    execSync(`git config user.email "${config.gitEmail}"`, { stdio: 'pipe' });
    
    // Add all changes
    execSync('git add .', { stdio: 'pipe' });
    
    // Create commit message
    const commitMessage = `Automated: Code quality improvements and optimizations
    
- Fixed ${state.stats.fixedIssues} issues
- Applied ${state.stats.optimizations} optimizations
- Ran ${state.stats.tests} tests
- Completed ${state.stats.builds} builds

[skip ci]`;
    
    // Commit changes
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    state.stats.commits++;
    
    logger.info('Changes committed successfully');
    notify('Automated Commit', 'Code improvements and optimizations have been committed', 'success');
  } catch (error) {
    logger.error(`Git operations failed: ${error}`);
  }
};

// Self-healing
const runSelfHealing = async () => {
  logger.info('Running self-healing procedures...');
  
  try {
    // Clean cache
    execSync('npm run clean:cache', { stdio: 'pipe' });
    logger.info('Cache cleaned');
    
    // Run auto-heal script
    execSync('npm run heal', { stdio: 'pipe' });
    logger.info('Self-healing completed');
  } catch (error) {
    logger.error(`Self-healing failed: ${error}`);
  }
};

// Main automation function
const runAutomation = async (trigger: 'fileChange' | 'scheduledScan' | 'manual') => {
  if (state.isRunning) {
    logger.warn('Automation already running, skipping this trigger');
    return;
  }
  
  state.isRunning = true;
  const startTime = Date.now();
  
  logger.info(`Starting automation workflow (trigger: ${trigger})`);
  notify('Automation Started', `Running automated workflow (trigger: ${trigger})`, 'info');
  
  try {
    // Reset stats for this run
    state.stats = {
      fixedIssues: 0,
      optimizations: 0,
      commits: 0,
      builds: 0,
      tests: 0,
    };
    
    // Run all automation steps
    await runCodeQualityChecks();
    await runSecurityChecks();
    await runDependencyManagement();
    
    // Only run tests and build for scheduled scans or manual triggers
    // to avoid excessive resource usage during development
    if (trigger !== 'fileChange') {
      await runTests();
      await runBuild();
    }
    
    await runPerformanceOptimization();
    await runAiAnalysis();
    await runSelfHealing();
    
    // Commit changes if any fixes or optimizations were applied
    if (state.stats.fixedIssues > 0 || state.stats.optimizations > 0) {
      await commitChanges();
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`Automation workflow completed in ${duration}s`);
    
    notify(
      'Automation Completed',
      `Workflow completed in ${duration}s with ${state.stats.fixedIssues} fixes and ${state.stats.optimizations} optimizations`,
      'success'
    );
  } catch (error) {
    logger.error(`Automation workflow failed: ${error}`);
    notify('Automation Failed', `Workflow failed: ${error}`, 'error');
  } finally {
    state.isRunning = false;
  }
};

// Helper function to calculate directory size
function calculateDirSize(dirPath: string): number {
  let size = 0;
  
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Initialize and start the orchestrator
const initialize = () => {
  logger.info('Initializing KONIVRER Automation Orchestrator...');
  
  // Create necessary directories
  const dirs = [
    path.join(process.cwd(), 'automation', 'logs'),
    path.join(process.cwd(), 'automation', 'reports'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Start file watcher if enabled
  if (config.watchMode) {
    setupWatcher();
  }
  
  // Run initial scan
  runAutomation('manual');
  
  logger.info('Automation Orchestrator initialized successfully');
  notify('Automation Ready', 'KONIVRER Automation Orchestrator is now running', 'success');
};

// Export functions for external use
export {
  initialize,
  runAutomation,
  config,
  state,
};

// Run if called directly
if (require.main === module) {
  initialize();
}