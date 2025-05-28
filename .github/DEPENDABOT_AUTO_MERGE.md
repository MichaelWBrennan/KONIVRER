# Dependabot Auto-Merge Configuration

This repository is configured with automated Dependabot pull request merging to keep dependencies up to date with minimal manual intervention.

## How it works

### Automatic Merging
- **Patch updates** (e.g., 1.0.0 → 1.0.1): Automatically merged after tests pass
- **Minor updates** (e.g., 1.0.0 → 1.1.0): Automatically merged after tests pass
- **Major updates** (e.g., 1.0.0 → 2.0.0): Requires manual review due to potential breaking changes

### Process Flow
1. Dependabot creates a pull request for dependency updates
2. The "Build and Test" workflow runs automatically
3. The auto-merge workflow waits for all status checks to complete
4. If tests pass:
   - **Patch/Minor**: PR is automatically approved and merged
   - **Major**: A comment is added requesting manual review
5. If tests fail: A comment is added explaining the failure

### Status Checks Required
The auto-merge workflow waits for these checks to pass:
- ✅ Lint checks (`npm run lint`)
- ✅ Build process (`npm run build`)
- ✅ Build output validation

### Configuration Files
- `.github/workflows/dependabot-auto-merge.yml` - Auto-merge workflow
- `.github/dependabot.yml` - Dependabot configuration
- `.github/workflows/npm-gulp.yml` - Build and test workflow

### Security Considerations
- Uses `pull_request_target` for secure handling of external PRs
- Only processes PRs from `dependabot[bot]`
- Requires all status checks to pass before merging
- Major updates always require manual review

### Manual Override
To manually merge a Dependabot PR:
```bash
gh pr merge --squash <PR_NUMBER>
```

To disable auto-merge for a specific PR, add the label `no-auto-merge`.

### Monitoring
Check the Actions tab to monitor the auto-merge workflow execution and review any failures or manual intervention requirements.