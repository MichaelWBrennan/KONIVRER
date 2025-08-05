#!/usr/bin/env node
/**
 * Real Security Score Calculator for KONIVRER
 * Calculates a comprehensive security score based on multiple factors
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Real Security Score Calculator v1.0');
console.log('=====================================\n');

class SecurityScoreCalculator {
  constructor() {
    this.score = 0;
    this.maxScore = 1000;
    this.results = {};
    this.startTime = Date.now();
  }

  async calculateScore() {
    console.log('📊 Calculating comprehensive security score...\n');

    // 1. Code Quality & Security (300 points)
    await this.checkCodeQuality();
    
    // 2. Dependency Security (200 points)
    await this.checkDependencySecurity();
    
    // 3. Configuration Security (200 points)
    await this.checkConfigurationSecurity();
    
    // 4. Secret Management (150 points)
    await this.checkSecretManagement();
    
    // 5. Security Headers & CSP (100 points)
    await this.checkSecurityHeaders();
    
    // 6. Build Security (50 points)
    await this.checkBuildSecurity();

    return this.generateReport();
  }

  async checkCodeQuality() {
    console.log('🔍 Analyzing code quality and security...');
    
    try {
      // Run ESLint and capture output
      const lintOutput = execSync('npm run lint', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 60000 
      });
      
      this.results.codeQuality = {
        errors: 0,
        warnings: 0,
        score: 300,
        status: 'excellent'
      };
      this.score += 300;
      
    } catch (error) {
      // Parse ESLint output for errors and warnings
      const output = error.stdout || error.stderr || '';
      const errorMatch = output.match(/(\d+) problems \((\d+) errors?, (\d+) warnings?\)/);
      
      if (errorMatch) {
        const totalProblems = parseInt(errorMatch[1]);
        const errors = parseInt(errorMatch[2]);
        const warnings = parseInt(errorMatch[3]);
        
        // Calculate score based on issues (severe penalty for errors)
        const errorPenalty = errors * 3; // 3 points per error
        const warningPenalty = warnings * 1; // 1 point per warning
        const codeScore = Math.max(0, 300 - errorPenalty - warningPenalty);
        
        this.results.codeQuality = {
          errors,
          warnings,
          totalProblems,
          score: codeScore,
          status: errors === 0 ? (warnings < 50 ? 'good' : 'needs_improvement') : 'critical'
        };
        this.score += codeScore;
        
        console.log(`   - Errors: ${errors} (${errorPenalty} points deducted)`);
        console.log(`   - Warnings: ${warnings} (${warningPenalty} points deducted)`);
        console.log(`   - Code Quality Score: ${codeScore}/300`);
      } else {
        // Fallback if parsing fails
        this.results.codeQuality = {
          errors: 'unknown',
          warnings: 'unknown',
          score: 150, // Conservative score
          status: 'unknown'
        };
        this.score += 150;
      }
    }
  }

  async checkDependencySecurity() {
    console.log('📦 Checking dependency security...');
    
    try {
      // Run npm audit
      const auditOutput = execSync('npm audit --json', { 
        encoding: 'utf8',
        timeout: 30000
      });
      
      const auditData = JSON.parse(auditOutput);
      const vulnerabilities = auditData.metadata?.vulnerabilities || {};
      
      const critical = vulnerabilities.critical || 0;
      const high = vulnerabilities.high || 0;
      const moderate = vulnerabilities.moderate || 0;
      const low = vulnerabilities.low || 0;
      
      // Calculate dependency score
      const criticalPenalty = critical * 50;
      const highPenalty = high * 20;
      const moderatePenalty = moderate * 5;
      const lowPenalty = low * 1;
      
      const depScore = Math.max(0, 200 - criticalPenalty - highPenalty - moderatePenalty - lowPenalty);
      
      this.results.dependencySecurity = {
        critical,
        high,
        moderate,
        low,
        totalVulnerabilities: critical + high + moderate + low,
        score: depScore,
        status: critical === 0 && high === 0 ? 'secure' : 'vulnerable'
      };
      
      this.score += depScore;
      
      console.log(`   - Critical: ${critical}, High: ${high}, Moderate: ${moderate}, Low: ${low}`);
      console.log(`   - Dependency Score: ${depScore}/200`);
      
    } catch (error) {
      // If npm audit passes (exit code 0), no vulnerabilities
      if (error.status === 0) {
        this.results.dependencySecurity = {
          critical: 0,
          high: 0,
          moderate: 0,
          low: 0,
          totalVulnerabilities: 0,
          score: 200,
          status: 'secure'
        };
        this.score += 200;
        console.log('   - No vulnerabilities found - Perfect score!');
      } else {
        // Conservative fallback
        this.results.dependencySecurity = {
          score: 100,
          status: 'unknown'
        };
        this.score += 100;
        console.log('   - Could not determine dependency security status');
      }
    }
  }

  async checkConfigurationSecurity() {
    console.log('⚙️ Analyzing security configuration...');
    
    let configScore = 0;
    const configChecks = {
      securityConfig: false,
      deepsourceConfig: false,
      semgrepRules: false,
      secretsBaseline: false,
      githubWorkflows: false
    };
    
    // Check for security configuration files
    if (fs.existsSync('security.config.js')) {
      configChecks.securityConfig = true;
      configScore += 50;
    }
    
    if (fs.existsSync('.deepsource.toml')) {
      configChecks.deepsourceConfig = true;
      configScore += 30;
    }
    
    if (fs.existsSync('.semgrep-ai-rules.yml')) {
      configChecks.semgrepRules = true;
      configScore += 40;
    }
    
    if (fs.existsSync('.secrets.baseline')) {
      configChecks.secretsBaseline = true;
      configScore += 30;
    }
    
    // Check for security workflows
    const workflowDir = '.github/workflows';
    if (fs.existsSync(workflowDir)) {
      const workflows = fs.readdirSync(workflowDir);
      const securityWorkflows = workflows.filter(f => 
        f.includes('security') || f.includes('audit') || f.includes('scan')
      );
      
      if (securityWorkflows.length > 0) {
        configChecks.githubWorkflows = true;
        configScore += 50;
      }
    }
    
    this.results.configurationSecurity = {
      ...configChecks,
      score: configScore,
      status: configScore > 150 ? 'excellent' : configScore > 100 ? 'good' : 'needs_improvement'
    };
    
    this.score += configScore;
    console.log(`   - Configuration Score: ${configScore}/200`);
  }

  async checkSecretManagement() {
    console.log('🔐 Checking secret management...');
    
    let secretScore = 150; // Start with full score
    const issues = [];
    
    try {
      // Check for common secret patterns in code
      const secretPatterns = [
        /api[_-]?key[\s]*=[\s]*['""][^'"]+['"']/gi,
        /secret[\s]*=[\s]*['""][^'"]+['"']/gi,
        /password[\s]*=[\s]*['""][^'"]+['"']/gi,
        /token[\s]*=[\s]*['""][^'"]+['"']/gi,
        /sk_[a-zA-Z0-9]+/gi,
        /pk_[a-zA-Z0-9]+/gi
      ];
      
      const srcFiles = this.getSourceFiles('src');
      let secretsFound = 0;
      
      for (const file of srcFiles) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          for (const pattern of secretPatterns) {
            if (pattern.test(content)) {
              secretsFound++;
              issues.push(`Potential secret in ${file}`);
            }
          }
        } catch (e) {
          // Skip files that can't be read
        }
      }
      
      // Deduct points for found secrets
      const secretPenalty = secretsFound * 30;
      secretScore = Math.max(0, secretScore - secretPenalty);
      
      this.results.secretManagement = {
        secretsFound,
        issues,
        score: secretScore,
        status: secretsFound === 0 ? 'secure' : 'vulnerable'
      };
      
      this.score += secretScore;
      console.log(`   - Potential secrets found: ${secretsFound}`);
      console.log(`   - Secret Management Score: ${secretScore}/150`);
      
    } catch (error) {
      this.results.secretManagement = {
        score: 100,
        status: 'unknown'
      };
      this.score += 100;
    }
  }

  async checkSecurityHeaders() {
    console.log('🛡️ Checking security headers configuration...');
    
    let headerScore = 0;
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options', 
      'X-XSS-Protection',
      'Referrer-Policy',
      'Strict-Transport-Security'
    ];
    
    try {
      if (fs.existsSync('security.config.js')) {
        const configContent = fs.readFileSync('security.config.js', 'utf8');
        
        for (const header of requiredHeaders) {
          if (configContent.includes(header)) {
            headerScore += 20;
          }
        }
        
        // Check for CSP
        if (configContent.includes('Content-Security-Policy') || configContent.includes('csp')) {
          headerScore += 50; // CSP is worth extra points
        }
      }
      
      this.results.securityHeaders = {
        score: headerScore,
        status: headerScore >= 80 ? 'excellent' : headerScore >= 50 ? 'good' : 'needs_improvement'
      };
      
      this.score += headerScore;
      console.log(`   - Security Headers Score: ${headerScore}/100`);
      
    } catch (error) {
      this.results.securityHeaders = {
        score: 0,
        status: 'missing'
      };
      console.log('   - No security headers configuration found');
    }
  }

  async checkBuildSecurity() {
    console.log('🏗️ Checking build security...');
    
    let buildScore = 0;
    
    try {
      // Check package.json for security scripts
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};
      
      // Look for security-related scripts
      const securityScripts = Object.keys(scripts).filter(script =>
        script.includes('security') || script.includes('audit') || script.includes('scan')
      );
      
      buildScore += securityScripts.length * 10;
      
      // Check for TypeScript (better type safety)
      if (fs.existsSync('tsconfig.json')) {
        buildScore += 20;
      }
      
      // Check for proper gitignore
      if (fs.existsSync('.gitignore')) {
        const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
        if (gitignoreContent.includes('node_modules') && 
            gitignoreContent.includes('.env')) {
          buildScore += 20;
        }
      }
      
      this.results.buildSecurity = {
        securityScripts: securityScripts.length,
        score: Math.min(buildScore, 50),
        status: buildScore >= 40 ? 'secure' : 'needs_improvement'
      };
      
      this.score += Math.min(buildScore, 50);
      console.log(`   - Build Security Score: ${Math.min(buildScore, 50)}/50`);
      
    } catch (error) {
      this.results.buildSecurity = {
        score: 0,
        status: 'unknown'
      };
    }
  }

  getSourceFiles(dir) {
    const files = [];
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
          files.push(...this.getSourceFiles(fullPath));
        } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.ts') || item.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip directories that can't be read
    }
    return files;
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const percentage = ((this.score / this.maxScore) * 100).toFixed(1);
    const grade = this.getSecurityGrade(percentage);
    
    console.log('\n🎯 SECURITY SCORE REPORT');
    console.log('========================\n');
    
    console.log(`📊 Overall Security Score: ${this.score}/${this.maxScore} (${percentage}%)`);
    console.log(`🏆 Security Grade: ${grade}`);
    console.log(`⏱️ Analysis Duration: ${duration}s\n`);
    
    console.log('📋 Detailed Breakdown:');
    console.log('======================');
    
    const breakdown = [
      { name: 'Code Quality & Security', result: this.results.codeQuality, max: 300 },
      { name: 'Dependency Security', result: this.results.dependencySecurity, max: 200 },
      { name: 'Configuration Security', result: this.results.configurationSecurity, max: 200 },
      { name: 'Secret Management', result: this.results.secretManagement, max: 150 },
      { name: 'Security Headers', result: this.results.securityHeaders, max: 100 },
      { name: 'Build Security', result: this.results.buildSecurity, max: 50 }
    ];
    
    for (const item of breakdown) {
      const score = item.result?.score || 0;
      const percent = ((score / item.max) * 100).toFixed(1);
      const status = item.result?.status || 'unknown';
      
      console.log(`   ${item.name}: ${score}/${item.max} (${percent}%) - ${status}`);
    }
    
    console.log('\n🔍 Recommendations:');
    console.log('===================');
    
    const recommendations = this.getRecommendations();
    for (const rec of recommendations) {
      console.log(`   • ${rec}`);
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      score: this.score,
      maxScore: this.maxScore,
      percentage: parseFloat(percentage),
      grade,
      duration: parseFloat(duration),
      breakdown: this.results,
      recommendations
    };
    
    fs.writeFileSync('security-score-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to security-score-report.json');
    
    return report;
  }

  getSecurityGrade(percentage) {
    if (percentage >= 95) return 'A+ (Excellent)';
    if (percentage >= 90) return 'A (Very Good)';
    if (percentage >= 85) return 'B+ (Good)';
    if (percentage >= 80) return 'B (Acceptable)';
    if (percentage >= 70) return 'C+ (Needs Improvement)';
    if (percentage >= 60) return 'C (Poor)';
    return 'F (Critical Issues)';
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.results.codeQuality?.errors > 0) {
      recommendations.push(`Fix ${this.results.codeQuality.errors} ESLint errors`);
    }
    
    if (this.results.codeQuality?.warnings > 50) {
      recommendations.push('Reduce ESLint warnings for better code quality');
    }
    
    if (this.results.dependencySecurity?.critical > 0) {
      recommendations.push('URGENT: Fix critical dependency vulnerabilities');
    }
    
    if (this.results.dependencySecurity?.high > 0) {
      recommendations.push('Fix high severity dependency vulnerabilities');
    }
    
    if (this.results.secretManagement?.secretsFound > 0) {
      recommendations.push('Remove hardcoded secrets from source code');
    }
    
    if (this.results.configurationSecurity?.score < 150) {
      recommendations.push('Improve security configuration and tooling');
    }
    
    if (this.results.securityHeaders?.score < 80) {
      recommendations.push('Implement comprehensive security headers');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent security posture! Consider quantum-ready cryptography');
    }
    
    return recommendations;
  }
}

// Run if called directly
if (require.main === module) {
  const calculator = new SecurityScoreCalculator();
  calculator.calculateScore()
    .then(report => {
      process.exit(report.percentage >= 90 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Security analysis failed:', error.message);
      process.exit(2);
    });
}

module.exports = SecurityScoreCalculator;