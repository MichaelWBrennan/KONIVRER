
#!/usr/bin/env tsx

import { execSync } from 'child_process';

class QualityAssurance {
  async runQualityChecks(): Promise<void> {
    console.log('🎯 Running comprehensive quality checks...');

    const checks = [
      { name: 'TypeScript Check', command: 'npm run type-check:strict' },
      { name: 'ESLint', command: 'npm run lint:fix' },
      { name: 'Prettier', command: 'npm run format' },
      { name: 'Tests', command: 'npm run test:coverage' },
      { name: 'Build', command: 'npm run build:optimized' },
      { name: 'Bundle Analysis', command: 'npm run bundle:analyze' }
    ];

    for (const check of checks) {
      try {
        console.log(`🔍 Running ${check.name}...`);
        execSync(check.command, { stdio: 'inherit' });
        console.log(`✅ ${check.name} passed`);
      } catch (error) {
        console.error(`❌ ${check.name} failed:, error`);
        
        // Attempt auto-fix for certain checks
        if (check.name === 'ESLint' || check.name === 'Prettier') {
          try {
            console.log(`🔧 Auto-fixing ${check.name}...`);
            execSync(check.command, { stdio: 'inherit' });
            console.log(`✅ ${check.name} auto-fixed`);
          } catch (fixError) {
            console.error(`❌ Auto-fix failed for ${check.name}`);
          }
        }
      }
    }

    console.log('🎉 Quality checks completed');
  }
}

const qa = new QualityAssurance();
qa.runQualityChecks();
