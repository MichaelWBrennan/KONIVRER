#!/bin/bash

# Vercel Build Script - Ultra-aggressive build optimization
# This script ensures NO autonomous systems can run during Vercel builds

echo "🚀 Starting ultra-aggressive Vercel build process..."

# Set MAXIMUM build environment variables for detection
export NODE_ENV=production
export VERCEL=1
export VITE_BUILD=true
export CI=true
export BUILD_ENV=production
export VERCEL_ENV=production
export KONIVRER_BUILD_ID=vercel-build
export npm_lifecycle_event=build
export npm_command=run-script
export DISABLE_AUTONOMOUS=true
export FORCE_BUILD_MODE=true

# Kill ANY processes that might interfere with build
echo "🧹 Ultra-aggressive process cleanup..."
pkill -f "automation" 2>/dev/null || true
pkill -f "autonomous" 2>/dev/null || true
pkill -f "all-in-one" 2>/dev/null || true
pkill -f "tsx" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "pm2" 2>/dev/null || true
pkill -f "forever" 2>/dev/null || true

# Kill any node processes that might be hanging
echo "🔪 Killing any hanging node processes..."
ps aux | grep -E "(automation|autonomous|all-in-one)" | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null || true

# Clear any cached data that might cause issues
echo "🗑️ Clearing caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Ensure dependencies are installed (postinstall already disabled)
echo "📦 Installing dependencies..."
npm ci --include=dev --silent --no-audit --no-fund

# Run the build with AGGRESSIVE timeout protection
echo "🔨 Building application with ultra-aggressive timeout protection..."
echo "📊 Environment check before build:"
env | grep -E "(NODE_ENV|VERCEL|CI|BUILD)" | sort

# Use a much shorter timeout for Vercel builds
timeout 120 npm run build || {
    echo "❌ Build timed out after 2 minutes - this indicates autonomous systems are still running"
    echo "🔍 Checking for hanging processes..."
    ps aux | grep -E "(node|npm|vite|tsx|automation|autonomous)" | grep -v grep
    echo "🛑 Emergency kill of ALL node processes..."
    pkill -9 -f "node" 2>/dev/null || true
    pkill -9 -f "vite" 2>/dev/null || true
    pkill -9 -f "tsx" 2>/dev/null || true
    pkill -9 -f "npm" 2>/dev/null || true
    echo "💀 Build failed due to hanging processes - autonomous systems not properly disabled"
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