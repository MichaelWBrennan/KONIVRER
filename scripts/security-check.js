
import AIRecorder from './ai-recorder.js';

// Initialize AI Recorder for security session
const aiRecorder = new AIRecorder();

// Record security scan start
await aiRecorder.recordSecurityEvent('scan', 'Starting comprehensive security check', 'medium');
#!/usr/bin/env node

// MIT License
//
// Copyright (c) 2025 KONIVRER Team
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Security check script for KONIVRER project
 * Validates security configurations and headers
 */

class SecurityChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }

  error(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  warning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  checkVercelConfig() {
    this.log('Checking Vercel configuration...');

    try {
      const vercelConfigPath = path.join(process.cwd(), 'vercel.json');

      if (!fs.existsSync(vercelConfigPath)) {
        this.warning('vercel.json not found');
        return;
      }

      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

      // Check for security headers
      if (!config.headers) {
        this.warning('No security headers configured in vercel.json');
        return;
      }

      const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
      ];

      const configuredHeaders = config.headers.flatMap(rule =>
        rule.headers ? rule.headers.map(h => h.key) : [],
      );

      requiredHeaders.forEach(header => {
        if (!configuredHeaders.includes(header)) {
          this.warning(`Missing security header: ${header}`);
        }
      });

      this.log('Vercel configuration check completed');
    } catch (error) {
      this.error(`Error checking Vercel config: ${error.message}`);
    }
  }

  checkPackageJson() {
    this.log('Checking package.json security...');

    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      // Check for security-related scripts
      if (packageJson.scripts) {
        const securityScripts = [
          'audit',
          'security-check',
          'vulnerability-check',
        ];
        const hasSecurityScript = securityScripts.some(script =>
          Object.keys(packageJson.scripts).some(key => key.includes(script)),
        );

        if (!hasSecurityScript) {
          this.warning('No security-related scripts found in package.json');
        }
      }

      // Check for known vulnerable packages (basic check)
      const vulnerablePackages = ['lodash@4.17.20', 'axios@0.21.0'];
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      Object.entries(dependencies).forEach(([name, version]) => {
        const packageSpec = `${name}@${version}`;
        if (vulnerablePackages.some(vuln => packageSpec.includes(vuln))) {
          this.error(`Potentially vulnerable package detected: ${packageSpec}`);
        }
      });

      this.log('Package.json security check completed');
    } catch (error) {
      this.error(`Error checking package.json: ${error.message}`);
    }
  }

  checkEnvironmentFiles() {
    this.log('Checking for exposed environment files...');

    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.development',
    ];

    sensitiveFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        // Check if file is in .gitignore
        const gitignorePath = path.join(process.cwd(), '.gitignore');
        if (fs.existsSync(gitignorePath)) {
          const gitignore = fs.readFileSync(gitignorePath, 'utf8');
          if (!gitignore.includes(file)) {
            this.error(`Environment file ${file} exists but not in .gitignore`);
          }
        } else {
          this.error(`Environment file ${file} exists but no .gitignore found`);
        }
      }
    });

    this.log('Environment files check completed');
  }

  checkSourceCode() {
    this.log('Checking source code for security issues...');

    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) {
      this.warning('src directory not found');
      return;
    }

    this.scanDirectory(srcDir);
    this.log('Source code security check completed');
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.scanDirectory(filePath);
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        this.scanFile(filePath);
      }
    });
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for potential security issues
      const securityPatterns = [
        {
          pattern: /eval\s*\(/,
          message: 'Use of eval() detected',
          severity: 'error',
        },
        {
          pattern: /innerHTML\s*=/,
          message: 'Use of innerHTML detected',
          severity: 'warning',
        },
        {
          pattern: /document\.write\s*\(/,
          message: 'Use of document.write() detected',
          severity: 'warning',
        },
        {
          pattern: /window\.location\s*=/,
          message: 'Direct window.location assignment detected',
          severity: 'warning',
        },
        {
          pattern: /(password|secret|key|token)\s*[:=]\s*['"][^'"]+['"]/,
          message: 'Potential hardcoded secret detected',
          severity: 'error',
        },
      ];

      securityPatterns.forEach(({ pattern, message, severity }) => {
        if (pattern.test(content)) {
          const method =
            severity === 'error'
              ? this.error.bind(this)
              : this.warning.bind(this);
          method(`${filePath}: ${message}`);
        }
      });
    } catch (error) {
      this.warning(`Could not scan file ${filePath}: ${error.message}`);
    }
  }

  generateReport() {
    this.log('Generating security report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        status: this.errors.length === 0 ? 'PASS' : 'FAIL',
      },
      errors: this.errors,
      warnings: this.warnings,
    };

    // Write report to file
    const reportPath = path.join(process.cwd(), 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Security report written to ${reportPath}`);
    return report;
  }

  run() {
    this.log('Starting security check...');

    this.checkVercelConfig();
    this.checkPackageJson();
    this.checkEnvironmentFiles();
    this.checkSourceCode();

    const report = this.generateReport();

    this.log(`Security check completed. Status: ${report.summary.status}`);
    this.log(
      `Errors: ${report.summary.errors}, Warnings: ${report.summary.warnings}`,
    );

    // Exit with error code if there are errors
    if (report.summary.errors > 0) {
      process.exit(1);
    }
  }
}

// Run security check if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new SecurityChecker();
  checker.run();
}

export default SecurityChecker;
