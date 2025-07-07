#!/bin/bash

# KONIVRER Auto Self-Healing and Self-Optimizing Startup Script
# This script starts the self-healing and self-optimizing system in the background

echo "🚀 Starting KONIVRER Self-Healing and Self-Optimizing System..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the self-healing and self-optimizing system in the background
nohup npm run self-heal > logs/self-healing-optimizer.log 2>&1 &
SELF_HEAL_PID=$!

# Save the PID to a file for later reference
echo $SELF_HEAL_PID > .self-heal.pid

echo "✅ Self-Healing and Self-Optimizing System started with PID $SELF_HEAL_PID"
echo "📝 Logs are being written to logs/self-healing-optimizer.log"
echo "📊 To monitor logs in real-time, run: npm run self-heal:logs"
echo "🛑 To stop the system, run: ./auto-self-heal-stop.sh"