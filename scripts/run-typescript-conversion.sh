#!/bin/bash

# Run TypeScript conversion script
# This script converts all JavaScript files to TypeScript

# Change to repository directory
REPO_DIR="$(dirname "$(dirname "$0")")"
cd "$REPO_DIR" || exit 1

echo "=== TypeScript Conversion ==="
echo "Started at: $(date)"
echo "Repository: $REPO_DIR"

# Make sure we have the latest code
echo "Pulling latest changes..."
git fetch origin
git checkout main
git pull origin main

# Create a new branch for conversion
BRANCH_NAME="convert-to-typescript-only-$(date +%Y%m%d)"
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Install ts-node if needed
if ! command -v ts-node &> /dev/null; then
  echo "Installing ts-node..."
  npm install -g ts-node
fi

# Run the conversion script
echo "Running TypeScript conversion script..."
ts-node scripts/convert-to-typescript.ts

# Check for remaining JavaScript files
JS_FILES=$(find src -name "*.js" | wc -l)
echo "Remaining JavaScript files in src: $JS_FILES"

# Commit changes
echo "Committing changes..."
git add .
git config user.name "TypeScript Conversion Bot"
git config user.email "typescript-bot@all-hands.dev"
git commit -m "Convert repository to TypeScript only"

# Push changes
echo "Pushing changes..."
git push origin "$BRANCH_NAME"

# Create pull request using GitHub CLI if available
if command -v gh &> /dev/null; then
  echo "Creating pull request..."
  gh pr create \
    --title "Convert repository to TypeScript only" \
    --body "This PR converts the repository to use TypeScript exclusively.

## Changes

- Converted all JavaScript files to TypeScript
- Updated configuration files to enforce TypeScript
- Added GitHub Action to enforce TypeScript
- Added TypeScript conversion guide

## TypeScript Only Policy

This PR establishes a TypeScript-only policy for the repository. All code must be written in TypeScript, not JavaScript.

See the TYPESCRIPT_GUIDE.md file for more information." \
    --base main \
    --head "$BRANCH_NAME" \
    --label "typescript,automated-pr,self-healing"
else
  echo "GitHub CLI not available. Please create a pull request manually."
fi

echo "TypeScript conversion completed at: $(date)"
echo "======================================="