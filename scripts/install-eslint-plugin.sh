#!/bin/bash

# Install ESLint plugin to enforce TypeScript-only policy

# Change to repository directory
REPO_DIR="$(dirname "$(dirname "$0")")"
cd "$REPO_DIR" || exit 1

echo "=== Installing ESLint Plugin ==="
echo "Started at: $(date)"
echo "Repository: $REPO_DIR"

# Create a symlink to the ESLint plugin
echo "Creating symlink to ESLint plugin..."
mkdir -p node_modules/eslint-plugin-typescript-only
ln -sf "$REPO_DIR/eslint-plugins/index.js" node_modules/eslint-plugin-typescript-only/index.js
ln -sf "$REPO_DIR/eslint-plugins/no-js-files.js" node_modules/eslint-plugin-typescript-only/no-js-files.js
ln -sf "$REPO_DIR/eslint-plugins/package.json" node_modules/eslint-plugin-typescript-only/package.json

echo "ESLint plugin installed successfully."
echo "You can now use the 'typescript-only/no-js-files' rule in your ESLint configuration."
echo "======================================="