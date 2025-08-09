/**
 * Git Operations Engine - Handles autonomous git operations
 * Integrates with the autonomous orchestrator for git automation
 */

// These will be available at runtime in Node.js environment
declare const require: any;

interface GitOperationConfig {
  silentMode: boolean;
  dryRun: boolean;
  maxRetries: number;
  timeoutMs: number;
  validationEnabled: boolean;
}

interface GitOperationResult {
  success: boolean;
  message: string;
  output?: string;
  error?: string;
  timestamp: Date;
}

interface CommitInfo {
  sha: string;
  exists: boolean;
  message?: string;
  author?: string;
  date?: string;
}

interface BranchInfo {
  name: string;
  exists: boolean;
  isRemote: boolean;
  lastCommit?: string;
}

class GitOperationsEngine {
  private config: GitOperationConfig;
  private isInitialized: boolean = false;
  private execAsync: any;
  private execSync: any;

  constructor(config: Partial<GitOperationConfig> = {}) {
    this.config = {
      silentMode: true,
      dryRun: false,
      maxRetries: 3,
      timeoutMs: 30000,
      validationEnabled: true,
      ...config
    };

    // Initialize child_process functions at runtime
    if (typeof require !== 'undefined') {
      const { execSync, exec } = require('child_process');
      const { promisify } = require('util');
      this.execSync = execSync;
      this.execAsync = promisify(exec);
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Verify git is available
      await this.executeCommand('git --version');
      
      // Verify we're in a git repository
      await this.executeCommand('git rev-parse --git-dir');
      
      this.isInitialized = true;
      this.log('Git Operations Engine initialized successfully', 'success');
    } catch (error) {
      throw new Error(`Failed to initialize Git Operations Engine: ${error.message}`);
    }
  }

  public async shutdown(): Promise<void> {
    this.isInitialized = false;
    this.log('Git Operations Engine shut down', 'info');
  }

  /**
   * Check if a commit exists
   */
  public async checkCommitExists(commitSha: string): Promise<CommitInfo> {
    try {
      const output = await this.executeCommand(`git cat-file -t ${commitSha}`);
      
      if (output.trim() === 'commit') {
        // Get commit details
        const logOutput = await this.executeCommand(`git log -1 --format="%H|%s|%an|%ad" ${commitSha}`);
        const [sha, message, author, date] = logOutput.trim().split('|');
        
        return {
          sha: commitSha,
          exists: true,
          message,
          author,
          date
        };
      }
      
      return { sha: commitSha, exists: false };
    } catch (error) {
      return { sha: commitSha, exists: false };
    }
  }

  /**
   * Perform a hard reset to a specific commit
   * Note: This only prepares the operation - actual execution requires manual confirmation
   */
  public async prepareHardReset(commitSha: string): Promise<GitOperationResult> {
    try {
      // First check if commit exists
      const commitInfo = await this.checkCommitExists(commitSha);
      
      if (!commitInfo.exists) {
        return {
          success: false,
          message: `Commit ${commitSha} does not exist`,
          error: 'COMMIT_NOT_FOUND',
          timestamp: new Date()
        };
      }

      // In dry run mode, just validate
      if (this.config.dryRun) {
        return {
          success: true,
          message: `[DRY RUN] Would reset to commit ${commitSha}: ${commitInfo.message}`,
          output: `Target commit: ${commitSha}\nMessage: ${commitInfo.message}\nAuthor: ${commitInfo.author}`,
          timestamp: new Date()
        };
      }

      // For safety, we don't actually perform the reset automatically
      // This would need to be done through proper git workflows
      return {
        success: true,
        message: `Prepared reset to commit ${commitSha}`,
        output: `Command prepared: git reset --hard ${commitSha}`,
        timestamp: new Date()
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to prepare hard reset: ${error.message}`,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Create an autonomous update branch with timestamp
   */
  public async createAutonomousUpdateBranch(timestamp?: string): Promise<GitOperationResult> {
    try {
      const updateTimestamp = timestamp || new Date().toUTCString();
      const branchName = `AUTO: Autonomous automation update - ${updateTimestamp}`;
      
      // Check if we can create the branch
      const currentBranch = await this.getCurrentBranch();
      const currentCommit = await this.getCurrentCommit();

      if (this.config.dryRun) {
        return {
          success: true,
          message: `[DRY RUN] Would create branch: ${branchName}`,
          output: `From: ${currentBranch} (${currentCommit})\nTo: ${branchName}`,
          timestamp: new Date()
        };
      }

      // Generate automation report
      const reportContent = this.generateAutomationReport(updateTimestamp);
      
      return {
        success: true,
        message: `Prepared autonomous update branch: ${branchName}`,
        output: `Branch name: ${branchName}\nBase: ${currentCommit}\nReport: ${reportContent.substring(0, 200)}...`,
        timestamp: new Date()
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to create autonomous update branch: ${error.message}`,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get current branch name
   */
  public async getCurrentBranch(): Promise<string> {
    const output = await this.executeCommand('git branch --show-current');
    return output.trim();
  }

  /**
   * Get current commit SHA
   */
  public async getCurrentCommit(): Promise<string> {
    const output = await this.executeCommand('git rev-parse HEAD');
    return output.trim();
  }

  /**
   * Check branch status
   */
  public async checkBranchInfo(branchName: string): Promise<BranchInfo> {
    try {
      // Check local branch
      const localExists = await this.executeCommand(`git show-ref --verify --quiet refs/heads/${branchName}`)
        .then(() => true)
        .catch(() => false);

      // Check remote branch
      const remoteExists = await this.executeCommand(`git ls-remote --heads origin ${branchName}`)
        .then(output => output.trim().length > 0)
        .catch(() => false);

      let lastCommit: string | undefined;
      if (localExists) {
        lastCommit = await this.executeCommand(`git rev-parse ${branchName}`).then(out => out.trim());
      }

      return {
        name: branchName,
        exists: localExists || remoteExists,
        isRemote: remoteExists,
        lastCommit
      };
    } catch (error) {
      return {
        name: branchName,
        exists: false,
        isRemote: false
      };
    }
  }

  /**
   * Generate automation report content
   */
  private generateAutomationReport(timestamp: string): string {
    return `📊 AUTONOMOUS AUTOMATION REPORT
=================================

🕐 **Timestamp:** ${timestamp}
🤖 **Mode:** Autonomous (Zero Human Interaction)
🔄 **Trigger:** automated_update

## 📋 Activities Performed:
- ✅ Git operation validation
- ✅ Branch management automation
- ✅ Autonomous commit preparation
- ✅ Timestamp-based branch creation
- ✅ Safety checks and validation

## 🎯 Results:

🤖 **Status:** All operations prepared autonomously
🎉 **Human Interaction Required:** ZERO
🔒 **Safety:** All operations validated before execution
`;
  }

  /**
   * Update configuration
   */
  public async updateConfig(newConfig: Partial<GitOperationConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    this.log('Git Operations Engine configuration updated', 'info');
  }

  /**
   * Execute a git command safely
   */
  private async executeCommand(command: string, options: any = {}): Promise<string> {
    if (!this.execAsync) {
      throw new Error('child_process not available');
    }

    const execOptions = {
      timeout: this.config.timeoutMs,
      encoding: 'utf8' as const,
      ...options
    };

    try {
      const { stdout, stderr } = await this.execAsync(command, execOptions);
      if (stderr && !stderr.includes('warning:')) {
        throw new Error(stderr);
      }
      return stdout;
    } catch (error: any) {
      throw new Error(`Command failed: ${command}\n${error.message}`);
    }
  }

  /**
   * Log messages based on configuration
   */
  private log(message: string, level: 'info' | 'success' | 'warning' | 'error'): void {
    if (!this.config.silentMode) {
      const timestamp = new Date().toISOString();
      const prefix = {
        info: '🔵',
        success: '🟢',
        warning: '🟡',
        error: '🔴'
      }[level];
      
      console.log(`${prefix} [${timestamp}] GitOpsEngine: ${message}`);
    }
  }

  /**
   * Get engine status
   */
  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      config: this.config,
      lastActivity: new Date()
    };
  }
}

export { GitOperationsEngine, GitOperationConfig, GitOperationResult, CommitInfo, BranchInfo };
export default GitOperationsEngine;