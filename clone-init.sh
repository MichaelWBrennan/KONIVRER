#!/bin/bash
# KONIVRER Clone Initialization
# This script runs automatically when the repository is cloned

# Make auto-init.sh executable
chmod +x auto-init.sh

# Make setup-hooks.js executable
chmod +x setup-hooks.js

# Set up Git hooks
node setup-hooks.js

# Start the auto-init system
./auto-init.sh &

echo "✅ KONIVRER repository initialized successfully!"
echo "🌐 The application will start automatically in your browser."