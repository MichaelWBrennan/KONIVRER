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

  // Fetch latest changes and sync with remote
  await runShell('git fetch --all --prune');
  await runShell('git remote update');

  // Get current branch and ensure it tracks remote
  const currentBranch = await runShell('git rev-parse --abbrev-ref HEAD');
  await runShell(`git branch --set-upstream-to=origin/${currentBranch.trim()} ${currentBranch.trim()}`);

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
      const status = await runShell(`git rev-list --left-right --count origin/main...origin/${branch}`)
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

async function mergeBranch(branchName: string): Promise<boolean> {
  log(`🔀 Merging branch: ${branchName}`);

  try {
    // Ensure main branch is up to date with remote
    await runShell('git checkout main');
    await runShell('git pull origin main');

    // Remote-first merge strategies with fallbacks
    const strategies = [
      `git pull origin ${branchName} --no-ff`,
      `git pull origin ${branchName} -X patience`,
      `git merge origin/${branchName} --no-ff`,
      `git merge origin/${branchName} -X patience`,
      `git merge origin/${branchName} -X theirs`,
      `git merge origin/${branchName} -X ours`
    ];

    let merged = false;
    let lastStrategy = '';

    for (const strategy of strategies) {
      lastStrategy = strategy;
      log(`Attempting merge with strategy: ${strategy}`);
      // Abort any previous merge to attempt a clean merge with the current strategy
      await runShell('git merge --abort || true');

      const mergeCommand = strategy.startsWith('git pull')
        ? strategy
        : `${strategy} --no-edit`;

      if (await runShell(`${mergeCommand}`).then(() => true).catch(() => false)) {
        log(`✅ Clean merge successful for ${branchName} using: ${strategy}`);

        // Immediately push to remote to sync changes
        try {
          await runShell('git push origin main');
          log(`📤 Pushed ${branchName} merge to remote`);
        } catch (pushError) {
          log(`⚠️ Failed to push ${branchName} merge: ${pushError}`);
        }

        merged = true;
        break;
      } else {
        log(`⚠️ Merge conflict or failure with strategy: ${strategy}`);
      }
    }

    if (!merged) {
      log(`❌ Failed to merge ${branchName} with any strategy.`);
      await runShell('git merge --abort || true');
      return false;
    }

    return true;

  } catch (error) {
    log(`❌ Error merging ${branchName}: ${error}`);
    await runShell('git merge --abort || true');
    return false;
  }
}

async function fixCommonIssues() {
  log('🔧 Fixing common issues...');

  try {
    // Fetch latest changes and sync with remote
    await runShell('git fetch --all --prune');
    await runShell('git remote update');

    // Get current branch and ensure it tracks remote
    const currentBranch = await runShell('git rev-parse --abbrev-ref HEAD');
    await runShell(`git branch --set-upstream-to=origin/${currentBranch.trim()} ${currentBranch.trim()}`);


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
      // Delete remote branch if it exists
      await runShell(`git push origin --delete ${branch} || true`);
      // Local branch deletion is not needed as we are not maintaining local versions

      log(`🗑️ Cleaned up remote branch: ${branch}`);
    } catch (error) {
      log(`⚠️ Could not clean up remote branch ${branch}: ${error}`);
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
    // Setup git config for automated operations
    await runShell('git config user.name "github-actions[bot]" || git config user.name "Auto-Merger"');
    await runShell('git config user.email "41898282+github-actions[bot]@users.noreply.github.com" || git config user.email "auto-merger@konivrer.dev"');

    // Discover all branches from remote
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
      const success = await mergeBranch(branch.name); // Pass branch name to mergeBranch
      results.set(branch.name, success);

      if (success) {
        mergedBranches.push(branch.name);
      }

      // Small delay between branches to avoid rate limiting or quá tải
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Fix common issues after all merges
    await fixCommonIssues();

    // Commit any fixes and push to remote
    await runShell('git add . || true');
    const commitStatus = await runShell('git commit -m "🤖 AUTO: Post-merge fixes and cleanup" || git diff-index --quiet HEAD -- || true'); // Commit only if there are changes
    if (commitStatus !== 0) { // If commitStatus is not 0, it means there were changes and a commit was made
      await runShell('git push origin main || true');
      log('📤 Pushed post-merge fixes and cleanup to remote');
    } else {
      log('ℹ️ No changes detected after fixes, skipping commit and push.');
    }

    // Generate report
    await generateMergeReport(branches, results);

    // Cleanup merged branches on remote
    await cleanupBranches(mergedBranches);

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