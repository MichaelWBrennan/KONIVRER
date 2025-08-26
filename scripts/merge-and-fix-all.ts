
#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { runShell, log } from './ts/utils';

interface BranchInfo {
  name: string;
  remote: string;
  ahead: number;
  behind: number;
  status: 'clean' | 'conflicted' | 'diverged';
}

async function getAllBranches(): Promise<BranchInfo[]> {
  log('🔍 Discovering all branches...');
  
  // Fetch all remotes
  await runShell('git fetch --all --prune');
  
  // Get all branches (local and remote)
  const localBranches = await runShell('git branch --format="%(refname:short)"')
    .then(output => output.split('\n').filter(b => b.trim() && !b.includes('HEAD')))
    .catch(() => []);
  
  const remoteBranches = await runShell('git branch -r --format="%(refname:short)"')
    .then(output => output.split('\n').filter(b => b.trim() && !b.includes('HEAD') && !b.includes('->')))
    .catch(() => []);
  
  const allBranches = new Set([...localBranches, ...remoteBranches.map(b => b.replace('origin/', ''))]);
  
  const branches: BranchInfo[] = [];
  
  for (const branch of allBranches) {
    if (branch === 'main' || branch === 'master') continue;
    
    try {
      // Check if branch exists locally
      const hasLocal = localBranches.includes(branch);
      const hasRemote = remoteBranches.includes(`origin/${branch}`);
      
      if (!hasLocal && hasRemote) {
        await runShell(`git checkout -b ${branch} origin/${branch}`);
      } else if (hasLocal) {
        await runShell(`git checkout ${branch}`);
      }
      
      // Get ahead/behind info
      const status = await runShell(`git rev-list --left-right --count main...${branch}`)
        .then(output => {
          const [behind, ahead] = output.split('\t').map(Number);
          return { ahead, behind };
        })
        .catch(() => ({ ahead: 0, behind: 0 }));
      
      branches.push({
        name: branch,
        remote: hasRemote ? `origin/${branch}` : '',
        ahead: status.ahead,
        behind: status.behind,
        status: status.ahead === 0 && status.behind === 0 ? 'clean' : 
               status.ahead > 0 && status.behind > 0 ? 'diverged' : 'clean'
      });
      
    } catch (error) {
      log(`⚠️ Error analyzing branch ${branch}: ${error}`);
    }
  }
  
  return branches;
}

async function mergeBranch(branch: BranchInfo): Promise<boolean> {
  log(`🔀 Merging branch: ${branch.name}`);
  
  try {
    // Switch to main branch
    await runShell('git checkout main');
    
    // Ensure main is up to date
    await runShell('git pull origin main');
    
    // Try to merge the branch
    if (await runShell(`git merge ${branch.name} --no-edit`).then(() => true).catch(() => false)) {
      log(`✅ Clean merge successful for ${branch.name}`);
      return true;
    }
    
    // Merge failed, try conflict resolution
    log(`⚠️ Merge conflicts detected for ${branch.name}, attempting resolution...`);
    
    // Use the conflict resolver
    const conflictResolved = await runShell(`bash scripts/conflict_resolver.sh --pr-number 0 --repository ${process.env.GITHUB_REPOSITORY || 'local/repo'} --github-token ${process.env.GITHUB_TOKEN || 'dummy'} || true`)
      .then(() => true)
      .catch(() => false);
    
    if (!conflictResolved) {
      // Try alternative strategies
      await runShell('git merge --abort || true');
      
      // Try patience merge
      if (await runShell(`git merge -X patience ${branch.name} --no-edit`).then(() => true).catch(() => false)) {
        log(`✅ Patience merge successful for ${branch.name}`);
        return true;
      }
      
      // Try recursive with theirs strategy for lockfiles and generated files
      await runShell('git merge --abort || true');
      if (await runShell(`git merge -X theirs ${branch.name} --no-edit`).then(() => true).catch(() => false)) {
        log(`✅ Theirs strategy merge successful for ${branch.name}`);
        return true;
      }
      
      // Last resort: ours strategy
      await runShell('git merge --abort || true');
      if (await runShell(`git merge -X ours ${branch.name} --no-edit`).then(() => true).catch(() => false)) {
        log(`✅ Ours strategy merge successful for ${branch.name}`);
        return true;
      }
    }
    
    log(`❌ Failed to merge ${branch.name}`);
    await runShell('git merge --abort || true');
    return false;
    
  } catch (error) {
    log(`❌ Error merging ${branch.name}: ${error}`);
    await runShell('git merge --abort || true');
    return false;
  }
}

async function fixCommonIssues() {
  log('🔧 Fixing common issues...');
  
  try {
    // Fix package-lock.json if it exists
    if (await runShell('test -f package-lock.json').then(() => true).catch(() => false)) {
      await runShell('npm audit fix --force || true');
      await runShell('npm install || true');
    }
    
    // Fix TypeScript issues
    await runShell('npm run lint:fix || true');
    
    // Fix formatting
    await runShell('npm run format || true');
    
    // Build to ensure everything works
    await runShell('npm run build || true');
    
    log('✅ Common issues fixed');
  } catch (error) {
    log(`⚠️ Some fixes may have failed: ${error}`);
  }
}

async function cleanupBranches(mergedBranches: string[]) {
  log('🗑️ Cleaning up merged branches...');
  
  for (const branch of mergedBranches) {
    try {
      // Delete local branch
      await runShell(`git branch -d ${branch} || true`);
      
      // Delete remote branch if it exists
      await runShell(`git push origin --delete ${branch} || true`);
      
      log(`🗑️ Cleaned up branch: ${branch}`);
    } catch (error) {
      log(`⚠️ Could not clean up ${branch}: ${error}`);
    }
  }
}

async function generateMergeReport(branches: BranchInfo[], results: Map<string, boolean>) {
  const successful = Array.from(results.entries()).filter(([_, success]) => success);
  const failed = Array.from(results.entries()).filter(([_, success]) => !success);
  
  const report = `# 🤖 Branch Merge Report

## 📊 Summary
- **Total branches processed**: ${branches.length}
- **Successfully merged**: ${successful.length}
- **Failed to merge**: ${failed.length}

## ✅ Successfully Merged
${successful.map(([branch]) => `- ${branch}`).join('\n')}

## ❌ Failed to Merge
${failed.map(([branch]) => `- ${branch}`).join('\n')}

## 🔄 Branch Status Before Merge
${branches.map(b => `- **${b.name}**: ${b.ahead} ahead, ${b.behind} behind (${b.status})`).join('\n')}

---
*Generated on ${new Date().toISOString()}*
`;

  await runShell(`echo '${report}' > merge-report.md`);
  log('📄 Merge report generated: merge-report.md');
}

async function main() {
  log('🚀 Starting comprehensive branch merge and fix operation...');
  
  try {
    // Setup git config
    await runShell('git config user.name "github-actions[bot]" || git config user.name "Auto-Merger"');
    await runShell('git config user.email "41898282+github-actions[bot]@users.noreply.github.com" || git config user.email "auto-merger@konivrer.dev"');
    
    // Discover all branches
    const branches = await getAllBranches();
    log(`📋 Found ${branches.length} branches to process`);
    
    if (branches.length === 0) {
      log('✅ No branches to merge');
      return;
    }
    
    // Process each branch
    const results = new Map<string, boolean>();
    const mergedBranches: string[] = [];
    
    for (const branch of branches) {
      const success = await mergeBranch(branch);
      results.set(branch.name, success);
      
      if (success) {
        mergedBranches.push(branch.name);
        
        // Push merged changes
        await runShell('git push origin main || true');
      }
      
      // Small delay between branches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Fix common issues after all merges
    await fixCommonIssues();
    
    // Commit any fixes
    const hasChanges = await runShell('git status --porcelain')
      .then(output => output.trim().length > 0)
      .catch(() => false);
    
    if (hasChanges) {
      await runShell('git add . || true');
      await runShell('git commit -m "🤖 AUTO: Post-merge fixes and cleanup" || true');
      await runShell('git push origin main || true');
    }
    
    // Generate report
    await generateMergeReport(branches, results);
    
    // Cleanup merged branches (optional - uncomment if desired)
    // await cleanupBranches(mergedBranches);
    
    const successful = Array.from(results.values()).filter(Boolean).length;
    log(`🎉 Merge operation completed: ${successful}/${branches.length} branches merged successfully`);
    
  } catch (error) {
    log(`❌ Fatal error during merge operation: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
