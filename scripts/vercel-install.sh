#!/bin/bash

# Vercel install script to prevent node-sass issues
echo "Starting custom Vercel install process..."

# Set environment variables to prevent node-sass compilation
export SKIP_NODE_SASS_TESTS=true
export NODE_SASS_BINARY_SITE=false
export NODE_SASS_BINARY_CACHE_PATH=false
export NPM_CONFIG_OPTIONAL=false

# Remove any existing node-sass references
echo "Cleaning up any node-sass references..."
rm -rf node_modules/.bin/node-sass 2>/dev/null || true
rm -rf node_modules/node-sass 2>/dev/null || true

# Install dependencies with npm overrides
echo "Installing dependencies with npm overrides..."
npm ci --no-optional --ignore-scripts

# Verify sass is installed instead of node-sass
echo "Verifying sass installation..."
if npm ls sass > /dev/null 2>&1; then
    echo "✅ sass is installed successfully"
else
    echo "⚠️  sass not found, installing manually..."
    npm install sass --save-dev
fi

# Check that node-sass is not installed
if npm ls node-sass > /dev/null 2>&1; then
    echo "❌ node-sass found, this should not happen"
    exit 1
else
    echo "✅ node-sass successfully avoided"
fi

echo "Custom install process completed successfully!"