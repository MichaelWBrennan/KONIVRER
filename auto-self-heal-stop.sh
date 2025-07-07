#!/bin/bash

# KONIVRER Auto Self-Healing and Self-Optimizing Stop Script
# This script stops the self-healing and self-optimizing system

echo "🛑 Stopping KONIVRER Self-Healing and Self-Optimizing System..."

# Check if PID file exists
if [ -f .self-heal.pid ]; then
  # Read PID from file
  SELF_HEAL_PID=$(cat .self-heal.pid)
  
  # Check if process is running
  if ps -p $SELF_HEAL_PID > /dev/null; then
    # Kill the process
    kill $SELF_HEAL_PID
    echo "✅ Self-Healing and Self-Optimizing System stopped (PID $SELF_HEAL_PID)"
  else
    echo "⚠️ Self-Healing and Self-Optimizing System is not running (PID $SELF_HEAL_PID)"
  fi
  
  # Remove PID file
  rm .self-heal.pid
else
  echo "⚠️ Self-Healing and Self-Optimizing System is not running (no PID file found)"
fi