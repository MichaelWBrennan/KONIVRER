
#!/usr/bin/env ts-node
import { runShell, log } from './ts/utils';

async function ensureRemoteSync() {
  log('🔄 Ensuring remote synchronization...');
  
  try {
    // Always fetch latest from all remotes
    await runShell('git fetch --all --prune');
    await runShell('git remote update');
    
    // Check if we're behind remote
    const status = await runShell('git status -uno');
    if (status.includes('behind')) {
      log('📥 Pulling latest changes from remote...');
      await runShell('git pull --rebase=false');
    }
    
    // Check if we have unpushed commits
    if (status.includes('ahead')) {
      log('📤 Pushing local changes to remote...');
      await runShell('git push');
    }
    
    log('✅ Repository synchronized with remote');
  } catch (error) {
    log(`❌ Remote sync failed: ${error}`);
    throw error;
  }
}

async function main() {
  await ensureRemoteSync();
  
  // Run merge automation with remote focus
  await runShell('npx ts-node scripts/merge-and-fix-all.ts');
}

if (require.main === module) {
  main().catch(console.error);
}

export { ensureRemoteSync };
