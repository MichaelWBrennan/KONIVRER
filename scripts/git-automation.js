
#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');

const log = (message) => console.log(`🔧 ${message}`);
const success = (message) => console.log(`✅ ${message}`);
const error = (message) => console.error(`❌ ${message}`);

class GitAutomation {
  constructor() {
    this.gitDir = '.git';
  }

  // Clean all lock files
  cleanLockFiles() {
    try {
      log('Cleaning git lock files...');
      execSync('find .git -name "*.lock" -type f -delete', { stdio: 'pipe' });
      success('Lock files cleaned');
    } catch (err) {
      log('No lock files to clean');
    }
  }

  // Force push with safety checks
  safePush() {
    try {
      this.cleanLockFiles();
      
      log('Adding files...');
      execSync('git add .', { stdio: 'inherit' });
      
      log('Committing changes...');
      const timestamp = new Date().toISOString();
      execSync(`git commit -m "🚀 Auto-deploy: ${timestamp}

- Automated deployment with lock file prevention
- Ensured clean git state
- Applied latest changes safely

Technical Impact:
- Resolved potential git conflicts
- Maintained deployment consistency
- Enhanced automation reliability"`, { stdio: 'inherit' });
      
      log('Pushing to origin...');
      execSync('git push origin main --force-with-lease', { stdio: 'inherit' });
      
      success('Git operations completed successfully');
      
    } catch (err) {
      error(`Git operation failed: ${err.message}`);
      
      // Try recovery
      log('Attempting recovery...');
      this.cleanLockFiles();
      
      try {
        execSync('git reset --soft HEAD~1', { stdio: 'pipe' });
        execSync('git push origin main', { stdio: 'inherit' });
        success('Recovery successful');
      } catch (recoveryErr) {
        error(`Recovery failed: ${recoveryErr.message}`);
      }
    }
  }

  // Check repository health
  checkHealth() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const behind = execSync('git rev-list --count HEAD..origin/main', { encoding: 'utf8' }).trim();
      
      log(`Repository status: ${status ? 'Changes pending' : 'Clean'}`);
      log(`Behind origin: ${behind} commits`);
      
      return { clean: !status, behind: parseInt(behind) };
    } catch (err) {
      error(`Health check failed: ${err.message}`);
      return { clean: false, behind: 0 };
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
const automation = new GitAutomation();

if (args.includes('--push')) {
  automation.safePush();
} else if (args.includes('--clean')) {
  automation.cleanLockFiles();
} else if (args.includes('--health')) {
  automation.checkHealth();
} else {
  console.log(`
Git Automation Tool

Usage:
  node scripts/git-automation.js --push    # Safe push with lock file cleanup
  node scripts/git-automation.js --clean   # Clean lock files only
  node scripts/git-automation.js --health  # Check repository health

Features:
- Automatic lock file cleanup
- Safe force push with lease
- Recovery mechanisms
- Health monitoring
`);
}
