#!/bin/bash

# Run Advanced TypeScript Conversion
# This script converts all JavaScript files to TypeScript using the advanced conversion tool

# Change to repository directory
REPO_DIR="$(dirname "$(dirname "$0")")"
cd "$REPO_DIR" || exit 1

echo "=== Advanced TypeScript Conversion ==="
echo "Started at: $(date)"
echo "Repository: $REPO_DIR"

# Make sure we have the latest code
echo "Pulling latest changes..."
git fetch origin
git checkout main
git pull origin main

# Create a new branch for conversion
BRANCH_NAME="advanced-typescript-conversion-$(date +%Y%m%d)"
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
echo "Running advanced TypeScript conversion script..."
ts-node scripts/advanced-typescript-conversion.ts --verbose

# Check for remaining JavaScript files
JS_FILES=$(find src -name "*.js" | wc -l)
echo "Remaining JavaScript files in src: $JS_FILES"

# Update tsconfig.json to enforce TypeScript
echo "Updating tsconfig.json..."
node -e "
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.allowJs = false;
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
console.log('Updated tsconfig.json to enforce TypeScript');
"

# Commit changes
echo "Committing changes..."
git add .
git config user.name "TypeScript Conversion Bot"
git config user.email "typescript-bot@all-hands.dev"
git commit -m "Convert repository to TypeScript only using advanced conversion"

# Push changes
echo "Pushing changes..."
git push origin "$BRANCH_NAME"

# Create pull request using GitHub CLI if available
if command -v gh &> /dev/null; then
  echo "Creating pull request..."
  gh pr create \
    --title "Convert repository to TypeScript only (Advanced)" \
    --body "This PR converts the repository to use TypeScript exclusively using the advanced conversion tool.

## Changes

- Converted all JavaScript files to TypeScript with proper type annotations
- Added interfaces for object literals
- Added proper typing for React components
- Updated configuration files to enforce TypeScript
- Improved code quality with better type definitions

## TypeScript Only Policy

This PR establishes a TypeScript-only policy for the repository. All code must be written in TypeScript, not JavaScript.

See the TYPESCRIPT_GUIDE.md file for more information." \
    --base main \
    --head "$BRANCH_NAME" \
    --label "typescript,automated-pr,self-healing"
else
  echo "GitHub CLI not available. Please create a pull request manually."
fi

echo "Advanced TypeScript conversion completed at: $(date)"
echo "======================================="