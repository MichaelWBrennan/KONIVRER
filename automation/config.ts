/**
 * KONIVRER Automation Configuration
 * 
 * This file contains all configuration options for the automation system.
 * Edit this file to customize the behavior of the automation orchestrator.
 */

import path from 'path';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isCIEnvironment = !!process.env.CI;

// Base configuration
const config = {
  // Core settings
  watchMode: !isCIEnvironment, // Disable watch mode in CI environments
  autoFix: true,
  autoCommit: !isCIEnvironment, // Don't auto-commit in CI environments
  autoOptimize: true,
  
  // Paths to watch
  watchPaths: ['src/**/*', 'public/**/*', 'scripts/**/*', 'automation/**/*'],
  ignorePaths: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/coverage/**',
    '**/automation/logs/**',
    '**/automation/reports/**',
  ],
  
  // Thresholds
  performanceThreshold: 90,
  coverageThreshold: 80,
  securityThreshold: 'high',
  
  // Timers (in milliseconds)
  debounceTime: 1000,
  fullScanInterval: 3600000, // 1 hour
  
  // Logging
  logLevel: isProduction ? 'info' : 'debug',
  logFile: path.join(process.cwd(), 'automation', 'logs', 'orchestrator.log'),
  
  // AI settings
  aiEnabled: true,
  aiSuggestionThreshold: 0.8,
  
  // Git settings
  gitAuthor: 'KONIVRER Automation',
  gitEmail: 'automation@konivrer.com',
  
  // Notification settings
  notificationsEnabled: true,
  notificationChannels: ['console'],
  
  // Integration settings
  integrations: {
    slack: {
      enabled: false,
      webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
      channel: '#automation',
    },
    discord: {
      enabled: false,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    },
    teams: {
      enabled: false,
      webhookUrl: process.env.TEAMS_WEBHOOK_URL || '',
    },
    email: {
      enabled: false,
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS || '',
      fromEmail: process.env.FROM_EMAIL || 'automation@konivrer.com',
      toEmail: process.env.TO_EMAIL || '',
    },
    jira: {
      enabled: false,
      host: process.env.JIRA_HOST || '',
      username: process.env.JIRA_USERNAME || '',
      apiToken: process.env.JIRA_API_TOKEN || '',
      project: process.env.JIRA_PROJECT || '',
    },
    github: {
      enabled: false,
      token: process.env.GITHUB_TOKEN || '',
      owner: process.env.GITHUB_OWNER || '',
      repo: process.env.GITHUB_REPO || '',
    },
  },
  
  // CI/CD settings
  cicd: {
    enabled: isCIEnvironment,
    provider: process.env.CI_PROVIDER || 'github',
    skipCiKeyword: '[skip ci]',
  },
  
  // Performance settings
  performance: {
    bundleAnalysis: true,
    imageOptimization: true,
    codeMinification: true,
    treeshaking: true,
    lazyLoading: true,
  },
  
  // Security settings
  security: {
    auditLevel: 'moderate',
    scanSecrets: true,
    scanDependencies: true,
    scanCode: true,
  },
  
  // Testing settings
  testing: {
    runUnitTests: true,
    runIntegrationTests: true,
    runE2ETests: false,
    generateCoverage: true,
  },
  
  // Self-healing settings
  selfHealing: {
    enabled: true,
    autoFixLinting: true,
    autoFixFormatting: true,
    autoFixDependencies: true,
    autoCleanCache: true,
  },
};

// Environment-specific overrides
if (isProduction) {
  // Production-specific settings
  config.autoCommit = false;
  config.notificationChannels = ['console', 'slack'];
  config.fullScanInterval = 86400000; // 24 hours in production
  config.testing.runE2ETests = true;
} else if (isCIEnvironment) {
  // CI-specific settings
  config.watchMode = false;
  config.autoCommit = false;
  config.notificationChannels = ['console'];
  config.testing.runE2ETests = true;
}

export default config;