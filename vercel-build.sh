#!/bin/bash

# Vercel Build Script - Optimized for fast builds
# This script ensures autonomous systems are disabled during Vercel builds

echo "🚀 Starting Vercel-optimized build process..."

# Set aggressive build environment variables
export NODE_ENV=production
export VERCEL=1
export VITE_BUILD=true
export CI=true

# Kill any existing processes that might interfere
echo "🧹 Cleaning up any existing processes..."
pkill -f "automation" 2>/dev/null || true
pkill -f "autonomous" 2>/dev/null || true

# Clear any cached data that might cause issues
echo "🗑️ Clearing caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Ensure dependencies are installed (postinstall already disabled)
echo "📦 Installing dependencies..."
npm ci --silent --no-audit --no-fund

# Run the build with timeout protection
echo "🔨 Building application with timeout protection..."
timeout 300 npm run build || {
    echo "❌ Build timed out after 5 minutes"
    echo "🔍 Checking for hanging processes..."
    ps aux | grep -E "(node|npm|vite)" | grep -v grep
    echo "🛑 Killing any hanging processes..."
    pkill -f "node" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    exit 1
}

echo "✅ Vercel build completed successfully!"

# Verify build output
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "📊 Build verification passed"
    ls -la dist/
else
    echo "❌ Build verification failed - missing dist directory or index.html"
    exit 1
fi

echo "🎉 Build process finished!"