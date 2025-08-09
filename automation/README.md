# Git Automation System

This directory contains the autonomous git operations system for KONIVRER, designed to handle complex git automation commands safely and intelligently.

## Overview

The git automation system provides:

- **Safe Command Processing**: Validates and prepares git operations without executing destructive commands
- **Intelligent Fallback**: Gracefully handles non-existent commits and provides alternatives  
- **Autonomous Branch Management**: Creates timestamp-based automation branches
- **Comprehensive Reporting**: Generates detailed automation reports
- **Safety-First Approach**: All destructive operations require manual confirmation

## Components

### 1. Git Operations Engine (`git-operations-engine.ts`)

TypeScript-based engine that provides core git operation capabilities:

- Commit validation and existence checking
- Hard reset preparation (safe mode)
- Autonomous branch creation with timestamps
- Repository status and branch information
- Configurable safety modes and validation

**Key Features:**
- Built-in safety checks
- Dry-run mode for testing
- Comprehensive error handling
- Integration with autonomous orchestrator

### 2. Autonomous Git Handler (`autonomous-git-handler.sh`)

Bash script that implements the main git automation workflow:

- Processes complex git command sequences
- Validates target commits
- Prepares hard reset operations safely
- Creates autonomous update branches
- Generates automation reports

**Usage:**
```bash
./automation/autonomous-git-handler.sh
```

### 3. Main Automation Entry Point (`main.cjs`)

Node.js script that serves as the primary interface for git automation:

- Orchestrates the complete automation workflow
- Provides comprehensive logging and feedback
- Integrates with the broader automation system
- Generates summary reports

**Usage:**
```bash
node automation/main.cjs
```

### 4. Autonomous Orchestrator Integration

The git operations engine is fully integrated with the autonomous orchestrator system:

- Handles `git-operation` action types
- Supports hard reset preparation
- Manages autonomous branch creation
- Updates automation reports automatically

## Supported Operations

### Command Processing

The system can process complex git automation commands like:

```bash
git reset --hard <commit> && git push origin HEAD:"<branch-name>" --force
```

**Example:**
```bash
git reset --hard ea8efd86909efee671639483298578409008466e && git push origin HEAD:"AUTO: Autonomous automation update - Fri Aug  8 23:24:23 UTC 2025" --force
```

### Safety Features

1. **Commit Validation**: Checks if target commits exist before attempting operations
2. **Fallback Handling**: Uses current commit as baseline when target doesn't exist
3. **Preparation Mode**: Prepares commands without executing destructive operations
4. **Branch Availability**: Checks if branch names are available before creation
5. **Comprehensive Logging**: Provides detailed feedback on all operations

### Generated Reports

Each automation run generates:

- **automation-report.md**: Detailed technical report
- Console output with real-time status updates
- Manual execution commands for optional implementation
- Safety warnings and backup recommendations

## Configuration

### Git Operations Engine Options

```typescript
interface GitOperationConfig {
  silentMode: boolean;        // Suppress console output
  dryRun: boolean;           // Prepare only, don't execute
  maxRetries: number;        // Command retry attempts
  timeoutMs: number;         // Command timeout
  validationEnabled: boolean; // Enable safety checks
}
```

### Default Configuration

- Silent Mode: `true` (minimal output)
- Dry Run: `false` (preparation + safe execution)
- Max Retries: `3`
- Timeout: `30000ms`
- Validation: `true` (all safety checks enabled)

## Safety Guidelines

### Important Notes

1. **No Destructive Operations**: The system prepares git operations but doesn't execute destructive commands automatically
2. **Manual Confirmation Required**: Hard resets and force pushes require manual execution
3. **Backup Recommendations**: Always backup before executing prepared commands
4. **Validation First**: All operations are validated before preparation
5. **Graceful Fallbacks**: Non-existent commits are handled intelligently

### Execution Flow

1. **Validation Phase**: Check commit existence and repository state
2. **Preparation Phase**: Prepare git operations safely
3. **Reporting Phase**: Generate comprehensive reports
4. **Manual Phase**: Provide commands for optional execution

## Integration Examples

### With Autonomous Orchestrator

```typescript
// Handle git operations
await this.executeAction({
  type: 'git-operation',
  action: 'hard-reset',
  commitSha: 'ea8efd86909efee671639483298578409008466e'
});

await this.executeAction({
  type: 'git-operation', 
  action: 'create-autonomous-branch',
  timestamp: 'Fri Aug  8 23:24:23 UTC 2025'
});
```

### Direct Usage

```bash
# Run complete automation workflow
node automation/main.cjs

# Run git handler directly  
./automation/autonomous-git-handler.sh

# Check automation results
cat automation-report.md
```

## Files Generated

- `automation-report.md`: Complete automation report
- Console logs: Real-time operation feedback
- Error logs: Any issues encountered during processing

## Future Enhancements

- **GitHub API Integration**: Direct branch creation and PR management
- **Advanced Conflict Resolution**: Automatic merge conflict handling  
- **Rollback Capabilities**: Automatic operation reversal
- **Integration Testing**: Automated validation of git operations
- **Webhook Support**: Event-driven automation triggers

## Support

For issues or questions about the git automation system:

1. Check the generated `automation-report.md` for detailed information
2. Review console logs for specific error messages
3. Verify git repository status and permissions
4. Ensure all required dependencies are installed

## Security Considerations

- All operations are logged for audit purposes
- No sensitive information is exposed in logs or reports
- Destructive operations require explicit manual confirmation
- Safety checks prevent accidental data loss
- Comprehensive validation before any git operations