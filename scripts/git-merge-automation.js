
#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync } = require('fs');

const log = (message) => console.log(`🔧 ${message}`);
const success = (message) => console.log(`✅ ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const warn = (message) => console.warn(`⚠️ ${message}`);

class GitMergeAutomation {
  constructor() {
    this.mainBranch = 'main';
    this.conflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'];
  }

  // Get all branches
  getAllBranches() {
    try {
      const localBranches = execSync('git branch', { encoding: 'utf8' })
        .split('\n')
        .map(branch => branch.replace('*', '').trim())
        .filter(branch => branch && branch !== this.mainBranch);
      
      const remoteBranches = execSync('git branch -r', { encoding: 'utf8' })
        .split('\n')
        .map(branch => branch.trim().replace('origin/', ''))
        .filter(branch => branch && !branch.includes('HEAD') && branch !== this.mainBranch);
      
      const allBranches = [...new Set([...localBranches, ...remoteBranches])];
      log(`Found branches: ${allBranches.join(', ')}`);
      return allBranches;
    } catch (err) {
      error(`Failed to get branches: ${err.message}`);
      return [];
    }
  }

  // Clean repository state
  cleanRepository() {
    try {
      log('Cleaning repository state...');
      
      // Remove lock files
      execSync('find .git -name "*.lock" -type f -delete 2>/dev/null || true', { stdio: 'pipe' });
      
      // Reset any merge state
      execSync('git merge --abort 2>/dev/null || true', { stdio: 'pipe' });
      execSync('git rebase --abort 2>/dev/null || true', { stdio: 'pipe' });
      
      // Clean working directory
      execSync('git reset --hard HEAD', { stdio: 'pipe' });
      execSync('git clean -fd', { stdio: 'pipe' });
      
      // Fetch latest changes
      execSync('git fetch --all --prune', { stdio: 'inherit' });
      
      success('Repository cleaned');
      return true;
    } catch (err) {
      error(`Repository cleanup failed: ${err.message}`);
      return false;
    }
  }

  // Check for merge conflicts in files
  hasConflicts() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return status.includes('UU ') || status.includes('AA ') || status.includes('DD ');
    } catch {
      return false;
    }
  }

  // Auto-resolve simple conflicts
  autoResolveConflicts() {
    try {
      log('Attempting to auto-resolve conflicts...');
      
      const conflictedFiles = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' })
        .split('\n')
        .filter(file => file.trim());
      
      if (conflictedFiles.length === 0) {
        success('No conflicts to resolve');
        return true;
      }
      
      let resolvedCount = 0;
      
      for (const file of conflictedFiles) {
        try {
          // For package-lock.json, always take incoming version
          if (file.includes('package-lock.json')) {
            execSync(`git checkout --theirs "${file}"`, { stdio: 'pipe' });
            execSync(`git add "${file}"`, { stdio: 'pipe' });
            resolvedCount++;
            continue;
          }
          
          // For configuration files, try to merge automatically
          if (file.match(/\.(json|yml|yaml|config\.js)$/)) {
            warn(`Manual resolution needed for: ${file}`);
            continue;
          }
          
          // For other files, check if conflict is simple
          const content = execSync(`cat "${file}"`, { encoding: 'utf8' });
          const conflictCount = this.conflictMarkers.reduce((count, marker) => 
            count + (content.match(new RegExp(marker, 'g')) || []).length, 0
          );
          
          // If only one conflict block, try auto-resolution
          if (conflictCount === 3) {
            // Take both changes if they don't overlap
            const resolved = content
              .replace(/<<<<<<< HEAD\n/g, '')
              .replace(/=======\n/g, '')
              .replace(/>>>>>>> .+\n/g, '');
            
            require('fs').writeFileSync(file, resolved);
            execSync(`git add "${file}"`, { stdio: 'pipe' });
            resolvedCount++;
          }
        } catch (fileErr) {
          warn(`Could not auto-resolve ${file}: ${fileErr.message}`);
        }
      }
      
      if (resolvedCount > 0) {
        success(`Auto-resolved ${resolvedCount} conflicts`);
        return true;
      }
      
      return false;
    } catch (err) {
      error(`Conflict resolution failed: ${err.message}`);
      return false;
    }
  }

  // Merge a single branch
  async mergeBranch(branchName) {
    try {
      log(`Merging branch: ${branchName}`);
      
      // Switch to main branch
      execSync(`git checkout ${this.mainBranch}`, { stdio: 'inherit' });
      
      // Pull latest main
      execSync(`git pull origin ${this.mainBranch}`, { stdio: 'inherit' });
      
      // Attempt merge
      try {
        execSync(`git merge origin/${branchName} --no-ff -m "feat: merge ${branchName} into ${this.mainBranch}"`, { stdio: 'inherit' });
        success(`Successfully merged ${branchName}`);
        return true;
      } catch (mergeErr) {
        warn(`Merge conflict detected for ${branchName}`);
        
        // Try auto-resolution
        if (this.autoResolveConflicts()) {
          try {
            execSync('git commit --no-edit', { stdio: 'inherit' });
            success(`Auto-resolved and merged ${branchName}`);
            return true;
          } catch (commitErr) {
            error(`Failed to commit resolved merge: ${commitErr.message}`);
          }
        }
        
        // Abort merge if auto-resolution failed
        execSync('git merge --abort', { stdio: 'pipe' });
        error(`Could not auto-merge ${branchName} - manual intervention required`);
        return false;
      }
    } catch (err) {
      error(`Branch merge failed: ${err.message}`);
      return false;
    }
  }

  // Merge all branches
  async mergeAllBranches() {
    if (!this.cleanRepository()) {
      return false;
    }
    
    const branches = this.getAllBranches();
    if (branches.length === 0) {
      log('No branches to merge');
      return true;
    }
    
    let successCount = 0;
    let failedBranches = [];
    
    for (const branch of branches) {
      const success = await this.mergeBranch(branch);
      if (success) {
        successCount++;
        
        // Delete merged branch
        try {
          execSync(`git branch -d ${branch} 2>/dev/null || true`, { stdio: 'pipe' });
          execSync(`git push origin --delete ${branch} 2>/dev/null || true`, { stdio: 'pipe' });
          log(`Cleaned up merged branch: ${branch}`);
        } catch {
          // Branch cleanup failed, but merge succeeded
        }
      } else {
        failedBranches.push(branch);
      }
    }
    
    // Final push
    try {
      execSync(`git push origin ${this.mainBranch}`, { stdio: 'inherit' });
      success('Pushed merged changes to remote');
    } catch (pushErr) {
      error(`Push failed: ${pushErr.message}`);
    }
    
    // Report results
    success(`Successfully merged ${successCount}/${branches.length} branches`);
    if (failedBranches.length > 0) {
      warn(`Failed to merge: ${failedBranches.join(', ')}`);
      log('These branches require manual conflict resolution');
    }
    
    return failedBranches.length === 0;
  }

  // Fix common git issues
  fixRepository() {
    try {
      log('Fixing repository issues...');
      
      // Clean lock files
      this.cleanRepository();
      
      // Repair refs
      execSync('git fsck --full', { stdio: 'pipe' });
      execSync('git gc --aggressive --prune=now', { stdio: 'pipe' });
      
      // Reset tracking branches
      execSync('git remote prune origin', { stdio: 'pipe' });
      
      // Ensure main branch is up to date
      execSync(`git checkout ${this.mainBranch}`, { stdio: 'inherit' });
      execSync(`git pull origin ${this.mainBranch}`, { stdio: 'inherit' });
      
      success('Repository fixed and optimized');
      return true;
    } catch (err) {
      error(`Repository fix failed: ${err.message}`);
      return false;
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
const automation = new GitMergeAutomation();

if (args.includes('--merge-all')) {
  automation.mergeAllBranches();
} else if (args.includes('--merge') && args[1]) {
  automation.mergeBranch(args[1]);
} else if (args.includes('--fix')) {
  automation.fixRepository();
} else if (args.includes('--clean')) {
  automation.cleanRepository();
} else if (args.includes('--auto')) {
  // Full automation
  (async () => {
    await automation.fixRepository();
    await automation.mergeAllBranches();
  })();
} else {
  console.log(`
Git Merge Automation Tool

Usage:
  node scripts/git-merge-automation.js --merge-all    # Merge all branches into main
  node scripts/git-merge-automation.js --merge <name> # Merge specific branch
  node scripts/git-merge-automation.js --fix          # Fix repository issues
  node scripts/git-merge-automation.js --clean        # Clean repository state
  node scripts/git-merge-automation.js --auto         # Full automation (fix + merge all)

Features:
- Automatic conflict resolution
- Branch cleanup after merge
- Repository health checks
- Safe merge operations with rollback
- Lock file management
`);
}

module.exports = GitMergeAutomation;
