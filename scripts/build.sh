#!/bin/bash

# Aggressive Build Script for Vercel
# Ensures all autonomous systems are completely disabled

echo "🚀 Starting optimized build process..."

# Set all possible environment variables to disable autonomous systems
export NODE_ENV=production
export VERCEL=1
export CI=1
export BUILD_ENV=production
export npm_lifecycle_event=build
export npm_command=run-script

# Kill any existing node processes that might interfere
pkill -f "node" 2>/dev/null || true
pkill -f "tsx" 2>/dev/null || true

# Clear any existing intervals or timeouts
echo "🧹 Clearing any existing processes..."

# Run the build with timeout to prevent hanging
echo "📦 Building application..."
timeout 300 npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed or timed out after 5 minutes"
    exit 1
fi

echo "🎉 Build process finished!"