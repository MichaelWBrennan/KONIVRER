#!/usr/bin/env node

/**
 * 🤖 KONIVRER Automation Health Check
 * 
 * This script performs comprehensive health checks on the automation system
 * and provides recommendations for fixing issues.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class AutomationHealthChecker {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      success: `${colors.green}✅${colors.reset}`,
      error: `${colors.red}❌${colors.reset}`,
      warning: `${colors.yellow}⚠️${colors.reset}`,
      info: `${colors.blue}ℹ️${colors.reset}`
    };
    
    console.log(`${prefix[type]} ${message}`);
  }

  async checkDependencies() {
    this.log('Checking dependency health...', 'info');
    
    try {
      // Check for vulnerabilities
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      
      if (audit.metadata.vulnerabilities.total === 0) {
        this.log('No security vulnerabilities found', 'success');
        this.results.passed++;
      } else {
        this.log(`Found ${audit.metadata.vulnerabilities.total} security vulnerabilities`, 'error');
        this.results.failed++;
        this.results.issues.push({
          type: 'security',
          message: `${audit.metadata.vulnerabilities.total} vulnerabilities found`,
          fix: 'Run: npm audit fix --force'
        });
      }

      // Check for outdated packages
      try {
        execSync('npm outdated --json', { encoding: 'utf8' });
        this.log('All dependencies are up to date', 'success');
        this.results.passed++;
      } catch (error) {
        const outdated = JSON.parse(error.stdout || '{}');
        const outdatedCount = Object.keys(outdated).length;
        
        if (outdatedCount > 0) {
          this.log(`Found ${outdatedCount} outdated packages`, 'warning');
          this.results.warnings++;
          
          // Categorize updates
          const majorUpdates = [];
          const minorUpdates = [];
          const patchUpdates = [];
          
          Object.entries(outdated).forEach(([pkg, info]) => {
            const current = info.current.split('.');
            const latest = info.latest.split('.');
            
            if (parseInt(latest[0]) > parseInt(current[0])) {
              majorUpdates.push(pkg);
            } else if (parseInt(latest[1]) > parseInt(current[1])) {
              minorUpdates.push(pkg);
            } else {
              patchUpdates.push(pkg);
            }
          });
          
          if (majorUpdates.length > 0) {
            this.results.issues.push({
              type: 'major-updates',
              message: `Major updates available: ${majorUpdates.join(', ')}`,
              fix: 'Manual review required for breaking changes'
            });
          }
          
          if (minorUpdates.length > 0) {
            this.results.issues.push({
              type: 'minor-updates',
              message: `Minor updates available: ${minorUpdates.join(', ')}`,
              fix: 'Run: npx npm-check-updates -u --target minor'
            });
          }
          
          if (patchUpdates.length > 0) {
            this.results.issues.push({
              type: 'patch-updates',
              message: `Patch updates available: ${patchUpdates.join(', ')}`,
              fix: 'Run: npx npm-check-updates -u --target patch'
            });
          }
        }
      }
      
    } catch (error) {
      this.log('Failed to check dependencies', 'error');
      this.results.failed++;
      this.results.issues.push({
        type: 'dependency-check',
        message: 'Unable to check dependency status',
        fix: 'Check npm installation and network connectivity'
      });
    }
  }

  async checkBuildHealth() {
    this.log('Checking build health...', 'info');
    
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.log('Build process successful', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('Build process failed', 'error');
      this.results.failed++;
      this.results.issues.push({
        type: 'build-failure',
        message: 'Build process is failing',
        fix: 'Check build logs and fix compilation errors'
      });
    }
  }

  async checkTestHealth() {
    this.log('Checking test health...', 'info');
    
    try {
      execSync('npm run test -- --run', { stdio: 'pipe' });
      this.log('Test suite passed', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('Test suite failed', 'error');
      this.results.failed++;
      this.results.issues.push({
        type: 'test-failure',
        message: 'Test suite is failing',
        fix: 'Review test failures and fix broken tests'
      });
    }
  }

  async checkWorkflowHealth() {
    this.log('Checking GitHub Actions workflows...', 'info');
    
    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      this.log('No GitHub Actions workflows found', 'warning');
      this.results.warnings++;
      return;
    }

    const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    
    workflows.forEach(workflow => {
      try {
        const content = fs.readFileSync(path.join(workflowDir, workflow), 'utf8');
        
        // Check for common issues
        if (content.includes('continue-on-error: true')) {
          this.log(`Workflow ${workflow} has error suppression`, 'warning');
          this.results.warnings++;
        }
        
        if (content.includes('npm audit fix --force')) {
          this.log(`Workflow ${workflow} uses aggressive audit fixes`, 'warning');
          this.results.warnings++;
        }
        
        this.log(`Workflow ${workflow} appears healthy`, 'success');
        this.results.passed++;
        
      } catch (error) {
        this.log(`Failed to read workflow ${workflow}`, 'error');
        this.results.failed++;
      }
    });
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bold}🤖 AUTOMATION HEALTH REPORT${colors.reset}`);
    console.log('='.repeat(60));
    
    console.log(`\n${colors.green}✅ Passed: ${this.results.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${this.results.failed}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Warnings: ${this.results.warnings}${colors.reset}`);
    
    if (this.results.issues.length > 0) {
      console.log(`\n${colors.bold}🔧 ISSUES & FIXES:${colors.reset}`);
      this.results.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${colors.yellow}${issue.type.toUpperCase()}${colors.reset}`);
        console.log(`   Problem: ${issue.message}`);
        console.log(`   Fix: ${colors.blue}${issue.fix}${colors.reset}`);
      });
    }
    
    // Overall health score
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const score = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;
    
    console.log(`\n${colors.bold}📊 OVERALL HEALTH SCORE: ${score}%${colors.reset}`);
    
    if (score >= 80) {
      console.log(`${colors.green}🎉 Automation system is healthy!${colors.reset}`);
    } else if (score >= 60) {
      console.log(`${colors.yellow}⚠️  Automation system needs attention${colors.reset}`);
    } else {
      console.log(`${colors.red}🚨 Automation system requires immediate fixes${colors.reset}`);
    }
    
    console.log('\n' + '='.repeat(60));
  }

  async run() {
    console.log(`${colors.bold}🤖 Starting KONIVRER Automation Health Check...${colors.reset}\n`);
    
    await this.checkDependencies();
    await this.checkBuildHealth();
    await this.checkTestHealth();
    await this.checkWorkflowHealth();
    
    this.generateReport();
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run the health check
const checker = new AutomationHealthChecker();
checker.run().catch(error => {
  console.error(`${colors.red}❌ Health check failed:${colors.reset}`, error);
  process.exit(1);
});