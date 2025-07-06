
#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { promises as fs } from 'fs';

class SecurityMonitor {
  async runSecurityScan(): Promise<void> {
    console.log('🛡️  Running comprehensive security scan...');

    try {
      // NPM audit
      console.log('📦 Running npm audit...');
      execSync('npm audit --audit-level moderate', { stdio: 'inherit' });

      // Check for secrets
      console.log('🔍 Scanning for secrets...');
      execSync('npx secretlint "**/*"', { stdio: 'inherit' });

      // License check
      console.log('📄 Checking licenses...');
      execSync('npx license-checker --summary', { stdio: 'inherit' });

      // Dependency check
      console.log('🔗 Checking dependencies...');
      execSync('npx depcheck', { stdio: 'inherit' });

      console.log('✅ Security scan completed successfully');
    } catch (error) {
      console.error('❌ Security issues found:', error);
      
      // Auto-fix common issues
      try {
        console.log('🔧 Attempting auto-fix...');
        execSync('npm audit fix --force', { stdio: 'inherit' });
        console.log('✅ Auto-fix completed');
      } catch (fixError) {
        console.error('❌ Auto-fix failed:', fixError);
      }
    }
  }
}

const monitor = new SecurityMonitor();
monitor.runSecurityScan();
