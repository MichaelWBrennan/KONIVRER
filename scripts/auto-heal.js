#!/usr/bin/env node

/**
 * 🔧 Auto-Healing Script
 * Automatically detects and fixes common repository issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AutoHealer {
  constructor() {
    this.fixes = [];
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      {
        info: '📋',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        fix: '🔧',
      }[type] || '📋';

    console.log(`${prefix} [${timestamp}] ${message}`);

    if (type === 'fix') this.fixes.push(message);
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
  }

  async runCommand(command, description, options = {}) {
    try {
      this.log(`Running: ${description}`, 'info');
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options,
      });
      this.log(`✅ ${description} completed`, 'success');
      return { success: true, output: result };
    } catch (error) {
      this.log(`❌ ${description} failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async fixDependencyIssues() {
    this.log('🔍 Checking dependency health...', 'info');

    // 1. Fix npm audit issues
    const auditResult = await this.runCommand(
      'npm audit fix --force',
      'Fixing security vulnerabilities',
      { silent: true },
    );

    if (auditResult.success) {
      this.log('Security vulnerabilities auto-fixed', 'fix');
    }

    // 2. Clean and reinstall dependencies
    if (fs.existsSync('node_modules')) {
      const reinstallResult = await this.runCommand(
        'rm -rf node_modules package-lock.json && npm install',
        'Cleaning and reinstalling dependencies',
      );

      if (reinstallResult.success) {
        this.log('Dependencies cleaned and reinstalled', 'fix');
      }
    }

    // 3. Deduplicate dependencies
    await this.runCommand('npm dedupe', 'Deduplicating dependencies', {
      silent: true,
    });

    // 4. Check for unused dependencies
    try {
      const depcheckResult = await this.runCommand(
        'npx depcheck --json',
        'Checking for unused dependencies',
        { silent: true },
      );

      if (depcheckResult.success) {
        const unused = JSON.parse(depcheckResult.output);
        if (unused.dependencies && unused.dependencies.length > 0) {
          this.log(
            `Found ${unused.dependencies.length} unused dependencies: ${unused.dependencies.join(', ')}`,
            'warning',
          );

          // Auto-remove unused dependencies (be careful with this)
          for (const dep of unused.dependencies.slice(0, 3)) {
            // Only remove first 3 to be safe
            await this.runCommand(
              `npm uninstall ${dep}`,
              `Removing unused dependency: ${dep}`,
              { silent: true },
            );
            this.log(`Removed unused dependency: ${dep}`, 'fix');
          }
        }
      }
    } catch (error) {
      this.log('Could not check for unused dependencies', 'warning');
    }
  }

  async fixCodeQualityIssues() {
    this.log('🎨 Fixing code quality issues...', 'info');

    // 1. Fix ESLint issues
    const eslintResult = await this.runCommand(
      'npx eslint . --fix --ext .js,.jsx,.ts,.tsx',
      'Auto-fixing ESLint issues',
      { silent: true },
    );

    if (eslintResult.success) {
      this.log('ESLint auto-fixes applied', 'fix');
    }

    // 2. Format code with Prettier
    const prettierResult = await this.runCommand(
      'npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md,yml,yaml}"',
      'Formatting code with Prettier',
      { silent: true },
    );

    if (prettierResult.success) {
      this.log('Code formatting applied', 'fix');
    }

    // 3. Fix package.json formatting
    if (fs.existsSync('package.json')) {
      try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        this.log('package.json formatting fixed', 'fix');
      } catch (error) {
        this.log('Could not fix package.json formatting', 'warning');
      }
    }
  }

  async fixBuildIssues() {
    this.log('🔧 Checking build health...', 'info');

    // 1. Try to build
    const buildResult = await this.runCommand(
      'npm run build',
      'Testing build process',
      { silent: true },
    );

    if (!buildResult.success) {
      this.log('Build failed, attempting fixes...', 'warning');

      // 2. Install missing TypeScript types
      const typesResult = await this.runCommand(
        'npm install --save-dev @types/node @types/react @types/react-dom',
        'Installing common TypeScript types',
        { silent: true },
      );

      if (typesResult.success) {
        this.log('TypeScript types installed', 'fix');
      }

      // 3. Try build again
      const retryBuildResult = await this.runCommand(
        'npm run build',
        'Retrying build after fixes',
        { silent: true },
      );

      if (retryBuildResult.success) {
        this.log('Build fixed successfully', 'fix');
      } else {
        this.log('Build still failing - manual intervention required', 'error');
      }
    } else {
      this.log('Build is healthy', 'success');
    }
  }

  async fixGitIssues() {
    this.log('📝 Checking Git repository health...', 'info');

    // 1. Fix .gitignore if missing or incomplete
    const gitignoreContent = `
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# temporary folders
tmp/
temp/
`;

    if (!fs.existsSync('.gitignore')) {
      fs.writeFileSync('.gitignore', gitignoreContent.trim());
      this.log('Created .gitignore file', 'fix');
    } else {
      const currentGitignore = fs.readFileSync('.gitignore', 'utf8');
      if (!currentGitignore.includes('node_modules')) {
        fs.appendFileSync('.gitignore', '\n' + gitignoreContent);
        this.log('Updated .gitignore file', 'fix');
      }
    }

    // 2. Clean up tracked files that should be ignored
    const filesToRemove = [
      'node_modules',
      'dist',
      'build',
      '.DS_Store',
      'Thumbs.db',
      '*.log',
    ];

    for (const pattern of filesToRemove) {
      try {
        await this.runCommand(
          `git rm -r --cached ${pattern}`,
          `Removing ${pattern} from Git tracking`,
          { silent: true },
        );
        this.log(`Removed ${pattern} from Git tracking`, 'fix');
      } catch (error) {
        // File might not be tracked, which is fine
      }
    }
  }

  async fixDocumentationIssues() {
    this.log('📋 Checking documentation...', 'info');

    // 1. Create README.md if missing
    if (!fs.existsSync('README.md')) {
      const readmeContent = `# KONIVRER Deck Database

A comprehensive card database application for the KONIVRER trading card game.

## 🎯 Features

- 🔍 Advanced card search and filtering
- 🃏 Interactive deck building tools
- 🖼️ High-quality card image display
- ⚡ Fast and responsive interface
- 🔒 Secure and reliable

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
\`\`\`

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm 8+

### Setup
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the development server: \`npm start\`
4. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts
- \`npm start\` - Start development server
- \`npm run build\` - Build for production
- \`npm test\` - Run tests
- \`npm run lint\` - Run ESLint
- \`npm run format\` - Format code with Prettier

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions, please [create an issue](../../issues/new).
`;

      fs.writeFileSync('README.md', readmeContent);
      this.log('Created README.md file', 'fix');
    }

    // 2. Create CONTRIBUTING.md if missing
    if (!fs.existsSync('CONTRIBUTING.md')) {
      const contributingContent = `# Contributing to KONIVRER Deck Database

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Development Setup
1. Fork the repository
2. Clone your fork: \`git clone https://github.com/YOUR_USERNAME/KONIVRER-deck-database.git\`
3. Install dependencies: \`npm install\`
4. Create a branch: \`git checkout -b feature/your-feature-name\`

### Development Workflow
1. Make your changes
2. Test your changes: \`npm test\`
3. Lint your code: \`npm run lint\`
4. Format your code: \`npm run format\`
5. Commit your changes: \`git commit -m "feat: your feature description"\`
6. Push to your fork: \`git push origin feature/your-feature-name\`
7. Create a pull request

## 📝 Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Screenshots if applicable

## 💡 Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Consider the impact on existing functionality
- Provide mockups or examples if helpful

## 🔍 Code Review Process

All contributions go through code review:
- Automated checks must pass
- At least one maintainer review required
- Address feedback promptly
- Keep discussions constructive

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
`;

      fs.writeFileSync('CONTRIBUTING.md', contributingContent);
      this.log('Created CONTRIBUTING.md file', 'fix');
    }
  }

  async fixSecurityIssues() {
    this.log('🔒 Checking security configuration...', 'info');

    // 1. Update npm to latest version
    await this.runCommand(
      'npm install -g npm@latest',
      'Updating npm to latest version',
      { silent: true },
    );

    // 2. Run security audit
    const auditResult = await this.runCommand(
      'npm audit --audit-level=moderate',
      'Running security audit',
      { silent: true },
    );

    if (
      !auditResult.success &&
      auditResult.output &&
      auditResult.output.includes('vulnerabilities')
    ) {
      // Try to fix automatically
      await this.runCommand(
        'npm audit fix --force',
        'Auto-fixing security vulnerabilities',
      );
      this.log('Security vulnerabilities auto-fixed', 'fix');
    }

    // 3. Check for .env files in git
    try {
      const envFiles = execSync('git ls-files | grep -E "\.env"', {
        encoding: 'utf8',
      }).trim();
      if (envFiles) {
        this.log(
          'Warning: .env files found in git history - consider removing them',
          'warning',
        );
      }
    } catch (error) {
      // No .env files found, which is good
    }
  }

  async commitFixes() {
    if (this.fixes.length === 0) {
      this.log('No fixes to commit', 'info');
      return;
    }

    this.log('📝 Committing auto-fixes...', 'info');

    // Check if there are changes to commit
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (!status.trim()) {
        this.log('No changes to commit', 'info');
        return;
      }

      // Configure git if needed
      try {
        execSync('git config user.name', { encoding: 'utf8' });
      } catch (error) {
        execSync('git config user.name "Auto-Healer"');
        execSync('git config user.email "auto-healer@konivrer.com"');
      }

      // Add all changes
      execSync('git add .');

      // Create commit message
      const commitMessage = `🔧 Auto-heal: Applied ${this.fixes.length} automatic fixes

${this.fixes.map(fix => `- ${fix}`).join('\n')}

Generated by auto-healing script at ${new Date().toISOString()}`;

      // Commit changes
      execSync(`git commit -m "${commitMessage}"`);
      this.log('Auto-fixes committed successfully', 'success');
    } catch (error) {
      this.log(`Failed to commit fixes: ${error.message}`, 'error');
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      fixes: this.fixes,
      warnings: this.warnings,
      errors: this.errors,
      summary: {
        totalFixes: this.fixes.length,
        totalWarnings: this.warnings.length,
        totalErrors: this.errors.length,
        status: this.errors.length === 0 ? 'success' : 'partial',
      },
    };

    // Write report to file
    fs.writeFileSync('auto-heal-report.json', JSON.stringify(report, null, 2));

    // Generate markdown report
    const markdownReport = `# 🔧 Auto-Healing Report

**Generated:** ${report.timestamp}
**Status:** ${report.summary.status.toUpperCase()}

## 📊 Summary
- ✅ **Fixes Applied:** ${report.summary.totalFixes}
- ⚠️ **Warnings:** ${report.summary.totalWarnings}
- ❌ **Errors:** ${report.summary.totalErrors}

## 🔧 Fixes Applied
${report.fixes.length > 0 ? report.fixes.map(fix => `- ${fix}`).join('\n') : 'No fixes were needed.'}

## ⚠️ Warnings
${report.warnings.length > 0 ? report.warnings.map(warning => `- ${warning}`).join('\n') : 'No warnings.'}

## ❌ Errors
${report.errors.length > 0 ? report.errors.map(error => `- ${error}`).join('\n') : 'No errors.'}

---
*This report was generated automatically by the auto-healing script.*
`;

    fs.writeFileSync('auto-heal-report.md', markdownReport);
    this.log('Auto-healing report generated', 'success');

    return report;
  }

  async heal() {
    this.log('🚀 Starting auto-healing process...', 'info');

    try {
      await this.fixGitIssues();
      await this.fixDependencyIssues();
      await this.fixCodeQualityIssues();
      await this.fixBuildIssues();
      await this.fixDocumentationIssues();
      await this.fixSecurityIssues();

      await this.commitFixes();
      const report = await this.generateReport();

      this.log(
        `🎉 Auto-healing completed! Applied ${report.summary.totalFixes} fixes.`,
        'success',
      );

      return report;
    } catch (error) {
      this.log(`💥 Auto-healing failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const healer = new AutoHealer();

  healer
    .heal()
    .then(report => {
      console.log('\n📋 Auto-healing completed successfully!');
      console.log(`📊 Report saved to: auto-heal-report.json`);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Auto-healing failed:', error.message);
      process.exit(1);
    });
}

export default AutoHealer;
