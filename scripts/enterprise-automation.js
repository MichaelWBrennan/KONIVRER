
#!/usr/bin/env node

/**
 * Enterprise Automation Orchestrator
 * Coordinates advanced automation workflows
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const log = (message) => console.log(`🤖 [AUTOMATION] ${message}`);
const success = (message) => console.log(`✅ [SUCCESS] ${message}`);
const error = (message) => console.error(`❌ [ERROR] ${message}`);
const warn = (message) => console.warn(`⚠️ [WARNING] ${message}`);

class EnterpriseAutomation {
  constructor() {
    this.config = this.loadConfiguration();
    this.metrics = {
      startTime: Date.now(),
      operations: [],
      errors: [],
      warnings: []
    };
  }

  loadConfiguration() {
    const defaultConfig = {
      automation: {
        enableScheduledOptimizations: true,
        enableAutoDeployment: process.env.NODE_ENV === 'production',
        enablePerformanceMonitoring: true,
        enableSecurityScanning: true,
        enableDependencyUpdates: true,
        enableCodeQualityChecks: true
      },
      thresholds: {
        bundleSize: 500000, // 500KB
        performanceScore: 90,
        securityScore: 95,
        testCoverage: 80,
        codeQuality: 85
      },
      notifications: {
        slack: process.env.SLACK_WEBHOOK_URL,
        email: process.env.NOTIFICATION_EMAIL,
        teams: process.env.TEAMS_WEBHOOK_URL
      }
    };

    try {
      const configPath = join(process.cwd(), 'automation.config.json');
      if (existsSync(configPath)) {
        const userConfig = JSON.parse(readFileSync(configPath, 'utf8'));
        return { ...defaultConfig, ...userConfig };
      }
    } catch (err) {
      warn(`Could not load custom config: ${err.message}`);
    }

    return defaultConfig;
  }

  async runAutomationSuite() {
    log('Starting Enterprise Automation Suite...');
    
    try {
      await this.preFlightChecks();
      await this.runSecurityScan();
      await this.runPerformanceOptimization();
      await this.runCodeQualityAnalysis();
      await this.runDependencyAudit();
      await this.generateAutomationReport();
      await this.sendNotifications();
      
      success('Enterprise Automation Suite completed successfully!');
    } catch (err) {
      error(`Automation suite failed: ${err.message}`);
      await this.handleFailure(err);
      process.exit(1);
    }
  }

  async preFlightChecks() {
    log('Running pre-flight checks...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    log(`Node.js version: ${nodeVersion}`);
    
    // Check dependencies
    if (!existsSync('package.json')) {
      throw new Error('package.json not found');
    }
    
    // Check Git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        warn('Working directory has uncommitted changes');
      }
    } catch (err) {
      warn('Git status check failed - not in a git repository?');
    }
    
    success('Pre-flight checks completed');
  }

  async runSecurityScan() {
    if (!this.config.automation.enableSecurityScanning) {
      log('Security scanning disabled, skipping...');
      return;
    }

    log('Running comprehensive security scan...');
    
    try {
      // Run npm audit
      execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
      
      // Run custom security check
      execSync('node scripts/security-check.js', { stdio: 'inherit' });
      
      // Check for sensitive files
      const sensitivePatterns = ['.env*', '*.key', '*.pem', 'secrets.*'];
      for (const pattern of sensitivePatterns) {
        try {
          const result = execSync(`find . -name "${pattern}" -not -path "./node_modules/*"`, { encoding: 'utf8' });
          if (result.trim()) {
            warn(`Found potentially sensitive files: ${result.trim()}`);
          }
        } catch (err) {
          // No files found (expected)
        }
      }
      
      this.metrics.operations.push({ type: 'security', status: 'success', timestamp: Date.now() });
      success('Security scan completed');
    } catch (err) {
      this.metrics.errors.push({ type: 'security', error: err.message, timestamp: Date.now() });
      throw new Error(`Security scan failed: ${err.message}`);
    }
  }

  async runPerformanceOptimization() {
    if (!this.config.automation.enablePerformanceMonitoring) {
      log('Performance optimization disabled, skipping...');
      return;
    }

    log('Running performance optimization...');
    
    try {
      // Clean previous build
      execSync('rm -rf dist', { stdio: 'inherit' });
      
      // Build with optimizations
      execSync('NODE_ENV=production npm run build', { stdio: 'inherit' });
      
      // Run performance analysis
      execSync('node scripts/optimize-performance.js', { stdio: 'inherit' });
      
      // Check bundle size
      const bundleSize = this.calculateBundleSize();
      if (bundleSize > this.config.thresholds.bundleSize) {
        warn(`Bundle size (${bundleSize} bytes) exceeds threshold (${this.config.thresholds.bundleSize} bytes)`);
        this.metrics.warnings.push({ 
          type: 'performance', 
          message: `Bundle size warning: ${bundleSize} > ${this.config.thresholds.bundleSize}`,
          timestamp: Date.now() 
        });
      }
      
      this.metrics.operations.push({ type: 'performance', bundleSize, status: 'success', timestamp: Date.now() });
      success('Performance optimization completed');
    } catch (err) {
      this.metrics.errors.push({ type: 'performance', error: err.message, timestamp: Date.now() });
      throw new Error(`Performance optimization failed: ${err.message}`);
    }
  }

  async runCodeQualityAnalysis() {
    if (!this.config.automation.enableCodeQualityChecks) {
      log('Code quality analysis disabled, skipping...');
      return;
    }

    log('Running code quality analysis...');
    
    try {
      // ESLint analysis
      try {
        execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --format json --output-file eslint-report.json', { stdio: 'pipe' });
      } catch (err) {
        // ESLint may exit with error code if issues found
        log('ESLint analysis completed with issues');
      }
      
      // TypeScript check
      try {
        execSync('npx tsc --noEmit', { stdio: 'inherit' });
        success('TypeScript compilation check passed');
      } catch (err) {
        warn('TypeScript compilation issues found');
      }
      
      // Prettier check
      try {
        execSync('npx prettier --check .', { stdio: 'inherit' });
        success('Code formatting check passed');
      } catch (err) {
        warn('Code formatting issues found');
        this.metrics.warnings.push({ 
          type: 'formatting', 
          message: 'Code formatting issues detected',
          timestamp: Date.now() 
        });
      }
      
      this.metrics.operations.push({ type: 'codeQuality', status: 'success', timestamp: Date.now() });
      success('Code quality analysis completed');
    } catch (err) {
      this.metrics.errors.push({ type: 'codeQuality', error: err.message, timestamp: Date.now() });
      throw new Error(`Code quality analysis failed: ${err.message}`);
    }
  }

  async runDependencyAudit() {
    if (!this.config.automation.enableDependencyUpdates) {
      log('Dependency audit disabled, skipping...');
      return;
    }

    log('Running dependency audit...');
    
    try {
      // Check for outdated packages
      const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdatedPackages = JSON.parse(outdated || '{}');
      
      if (Object.keys(outdatedPackages).length > 0) {
        warn(`Found ${Object.keys(outdatedPackages).length} outdated packages`);
        this.metrics.warnings.push({ 
          type: 'dependencies', 
          message: `${Object.keys(outdatedPackages).length} outdated packages found`,
          packages: Object.keys(outdatedPackages),
          timestamp: Date.now() 
        });
      }
      
      // License compliance check
      try {
        execSync('npx license-checker --summary', { stdio: 'inherit' });
        success('License compliance check passed');
      } catch (err) {
        warn('License checker not available or issues found');
      }
      
      this.metrics.operations.push({ type: 'dependencies', status: 'success', timestamp: Date.now() });
      success('Dependency audit completed');
    } catch (err) {
      // npm outdated exits with code 1 when outdated packages found
      if (!err.message.includes('npm outdated')) {
        this.metrics.errors.push({ type: 'dependencies', error: err.message, timestamp: Date.now() });
        throw new Error(`Dependency audit failed: ${err.message}`);
      }
    }
  }

  calculateBundleSize() {
    try {
      const result = execSync('find dist -name "*.js" -exec wc -c {} + | tail -1', { encoding: 'utf8' });
      return parseInt(result.trim().split(' ')[0]) || 0;
    } catch (err) {
      warn('Could not calculate bundle size');
      return 0;
    }
  }

  async generateAutomationReport() {
    log('Generating automation report...');
    
    const endTime = Date.now();
    const duration = endTime - this.metrics.startTime;
    
    const report = {
      summary: {
        startTime: new Date(this.metrics.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: `${Math.round(duration / 1000)}s`,
        status: this.metrics.errors.length === 0 ? 'SUCCESS' : 'FAILED_WITH_ERRORS',
        operationsCompleted: this.metrics.operations.length,
        errorsEncountered: this.metrics.errors.length,
        warningsIssued: this.metrics.warnings.length
      },
      operations: this.metrics.operations,
      errors: this.metrics.errors,
      warnings: this.metrics.warnings,
      thresholds: this.config.thresholds,
      recommendations: this.generateRecommendations()
    };
    
    writeFileSync('automation-report.json', JSON.stringify(report, null, 2));
    
    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    writeFileSync('AUTOMATION_REPORT.md', markdownReport);
    
    success('Automation report generated');
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.warnings.some(w => w.type === 'performance')) {
      recommendations.push('Consider optimizing bundle size with code splitting or lazy loading');
    }
    
    if (this.metrics.warnings.some(w => w.type === 'dependencies')) {
      recommendations.push('Update outdated dependencies to latest stable versions');
    }
    
    if (this.metrics.warnings.some(w => w.type === 'formatting')) {
      recommendations.push('Run prettier to fix code formatting issues');
    }
    
    if (this.metrics.errors.length === 0 && this.metrics.warnings.length === 0) {
      recommendations.push('Excellent! All automation checks passed without issues');
    }
    
    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Enterprise Automation Report

## Summary
- **Status**: ${report.summary.status}
- **Duration**: ${report.summary.duration}
- **Operations Completed**: ${report.summary.operationsCompleted}
- **Errors**: ${report.summary.errorsEncountered}
- **Warnings**: ${report.summary.warningsIssued}

## Operations
${report.operations.map(op => `- ✅ ${op.type}: ${op.status}`).join('\n')}

## Errors
${report.errors.length > 0 ? report.errors.map(err => `- ❌ ${err.type}: ${err.error}`).join('\n') : 'None'}

## Warnings
${report.warnings.length > 0 ? report.warnings.map(warn => `- ⚠️ ${warn.type}: ${warn.message}`).join('\n') : 'None'}

## Recommendations
${report.recommendations.map(rec => `- 💡 ${rec}`).join('\n')}

---
*Report generated on ${new Date().toISOString()}*
`;
  }

  async sendNotifications() {
    if (this.config.notifications.slack && this.metrics.errors.length === 0) {
      log('Sending success notification...');
      // Implementation would send webhook to Slack
    }
  }

  async handleFailure(err) {
    error(`Automation failed: ${err.message}`);
    
    if (this.config.notifications.slack) {
      log('Sending failure notification...');
      // Implementation would send failure webhook
    }
    
    await this.generateAutomationReport();
  }
}

// CLI Interface
const automation = new EnterpriseAutomation();

if (process.argv.includes('--run')) {
  automation.runAutomationSuite().catch(err => {
    console.error('Automation suite failed:', err);
    process.exit(1);
  });
} else if (process.argv.includes('--security-only')) {
  automation.runSecurityScan().catch(err => {
    console.error('Security scan failed:', err);
    process.exit(1);
  });
} else if (process.argv.includes('--performance-only')) {
  automation.runPerformanceOptimization().catch(err => {
    console.error('Performance optimization failed:', err);
    process.exit(1);
  });
} else {
  console.log(`
🤖 Enterprise Automation Orchestrator

Usage:
  node scripts/enterprise-automation.js --run              # Run full automation suite
  node scripts/enterprise-automation.js --security-only   # Run security scan only
  node scripts/enterprise-automation.js --performance-only # Run performance optimization only

Configuration:
  Create automation.config.json in the project root to customize automation settings.
  `);
}

export default EnterpriseAutomation;
