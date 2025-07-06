#!/bin/bash

# Cron job script to automatically fix TypeScript errors
# Recommended to run daily via crontab:
# 0 0 * * * /path/to/repo/scripts/cron-typescript-fix.sh >> /path/to/logs/typescript-fix.log 2>&1

# Change to repository directory
REPO_DIR="$(dirname "$(dirname "$0")")"
cd "$REPO_DIR" || exit 1

echo "=== TypeScript Auto-Fix Cron Job ==="
echo "Started at: $(date)"
echo "Repository: $REPO_DIR"

# Make sure we have the latest code
echo "Pulling latest changes..."
git fetch origin
git checkout main
git pull origin main

# Create a new branch for fixes
BRANCH_NAME="auto-fix-typescript-$(date +%Y%m%d)"
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Count initial errors
INITIAL_ERRORS=$(npx tsc --noEmit 2>&1 | grep -o "error TS" | wc -l)
echo "Initial TypeScript errors: $INITIAL_ERRORS"

if [ "$INITIAL_ERRORS" -eq 0 ]; then
  echo "No TypeScript errors found. Exiting."
  exit 0
fi

# Run the auto-fix script
echo "Running TypeScript auto-fix..."
npm run fix:typescript:auto

# Count remaining errors
REMAINING_ERRORS=$(npx tsc --noEmit 2>&1 | grep -o "error TS" | wc -l)
echo "Remaining TypeScript errors: $REMAINING_ERRORS"

# Calculate fixed errors
FIXED_ERRORS=$((INITIAL_ERRORS - REMAINING_ERRORS))
echo "Fixed $FIXED_ERRORS TypeScript errors"

# Commit and push changes if any errors were fixed
if [ "$FIXED_ERRORS" -gt 0 ]; then
  echo "Committing changes..."
  git add .
  git config user.name "TypeScript Auto-Fix Bot"
  git config user.email "typescript-bot@all-hands.dev"
  git commit -m "Auto-fix TypeScript errors ($FIXED_ERRORS errors fixed, $REMAINING_ERRORS remaining)"
  
  echo "Pushing changes..."
  git push origin "$BRANCH_NAME"
  
  # Create pull request using GitHub CLI if available
  if command -v gh &> /dev/null; then
    echo "Creating pull request..."
    gh pr create \
      --title "Auto-fix TypeScript errors" \
      --body "This PR was automatically created by the TypeScript Auto-Fix cron job.

- Fixed $FIXED_ERRORS TypeScript errors
- $REMAINING_ERRORS errors still remain

The changes were made automatically to fix TypeScript type errors.
Please review the changes carefully before merging." \
      --base main \
      --head "$BRANCH_NAME" \
      --label "typescript,automated-pr,self-healing"
  else
    echo "GitHub CLI not available. Please create a pull request manually."
  fi
else
  echo "No errors were fixed. No changes to commit."
fi

echo "TypeScript Auto-Fix completed at: $(date)"
echo "======================================="