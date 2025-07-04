/**
 * KONIVRER AI Recorder Configuration
 * 
 * Configuration for AI development recording and tracking
 */

export default {
  // Recording settings
  recording: {
    enabled: true,
    autoStart: false,
    watchFiles: true,
    includeGitDiff: true,
    maxLogSize: '100MB',
    retentionDays: 30
  },

  // File watching patterns
  watch: {
    include: [
      'src/**/*',
      'scripts/**/*',
      'public/**/*',
      '*.js',
      '*.jsx',
      '*.json',
      '*.md',
      '*.css',
      '*.html'
    ],
    exclude: [
      'node_modules/**',
      'ai-logs/**',
      '.git/**',
      'dist/**',
      'build/**',
      '*.log',
      '.env*'
    ]
  },

  // Activity categorization
  activities: {
    types: [
      'feature',
      'bugfix',
      'refactor',
      'optimization',
      'security',
      'testing',
      'documentation',
      'deployment',
      'maintenance'
    ],
    autoDetect: true
  },

  // Performance monitoring
  performance: {
    trackBuildTimes: true,
    trackTestDuration: true,
    trackBundleSize: true,
    trackLoadTimes: true,
    thresholds: {
      buildTime: 30000, // 30 seconds
      testDuration: 60000, // 1 minute
      bundleSize: 5000000 // 5MB
    }
  },

  // Security monitoring
  security: {
    trackVulnerabilities: true,
    trackFixes: true,
    auditOnChange: true,
    severityLevels: ['low', 'medium', 'high', 'critical']
  },

  // Integration settings
  integration: {
    git: {
      enabled: true,
      trackCommits: true,
      trackBranches: true,
      includeDiffs: true
    },
    npm: {
      enabled: true,
      trackDependencies: true,
      trackScripts: true
    },
    vite: {
      enabled: true,
      trackBuilds: true,
      trackHMR: true
    }
  },

  // Output settings
  output: {
    format: 'json',
    includeTimestamps: true,
    includeContext: true,
    generateSummary: true,
    generateMetrics: true
  },

  // Notification settings
  notifications: {
    console: true,
    file: true,
    webhook: false, // Can be configured for external integrations
    email: false
  }
};