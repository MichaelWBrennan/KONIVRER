# Dependabot Auto-Merge Configuration

This repository is configured with automated Dependabot pull request merging to keep dependencies up to date with minimal manual intervention.

## How it works

### Automatic Merging

- **Patch updates** (e.g., 1.0.0 → 1.0.1): Automatically merged after tests pass
- **Minor updates** (e.g., 1.0.0 → 1.1.0): Automatically merged after tests pass
- **Major updates** (e.g., 1.0.0 → 2.0.0): Automatically merged after tests pass, with special notification

### Process Flow

1. Dependabot creates a pull request for dependency updates
2. The CI/CD workflow runs automatically (lint, test, build, security)
3. The auto-merge workflow waits for all status checks to complete (up to 30 minutes)
4. If tests pass:
   - **All updates (patch, minor, major)**: PR is automatically approved and merged
   - **Major updates**: A detailed comment is added noting the major version change with links to release notes
5. If tests fail: A detailed comment is added explaining the failure with next steps

### Status Checks Required

The auto-merge workflow waits for these checks to pass:

- ✅ Lint checks (`npm run lint`)
- ✅ Test execution (`npm run test`)
- ✅ Build process (`npm run build`)
- ✅ Security audit
- ✅ Any other checks matching the pattern: `(build|test|lint|ci|security).*`

### Configuration Files

- `.github/workflows/dependabot-auto-merge.yml` - Auto-merge workflow
- `.github/dependabot.yml` - Dependabot configuration
- `.github/workflows/ci.yml` - CI/CD workflow

### Security Considerations

- Uses `pull_request_target` for secure handling of external PRs
- Only processes PRs from `dependabot[bot]`
- Requires all status checks to pass before merging
- Special notification for major updates to highlight potential breaking changes
- Source branch is deleted after successful merge

### Manual Override

To manually merge a Dependabot PR:

```bash
gh pr merge --squash <PR_NUMBER>
```

To disable auto-merge for a specific PR, add the label `no-auto-merge`. The workflow will automatically skip PRs with this label.

### Monitoring

Check the Actions tab to monitor the auto-merge workflow execution and review any failures or manual intervention requirements.

### Troubleshooting

If the auto-merge workflow fails:

1. Check the GitHub Actions logs for details
2. Verify that all required status checks are passing
3. Ensure the PR doesn't have the `no-auto-merge` label if you want it to be auto-merged
4. For persistent issues, you can manually approve and merge the PR
