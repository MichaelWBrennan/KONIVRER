#!/bin/bash
# Auto-start service that runs in background

while true; do
    # Check if automation is running
    if ! pgrep -f "automation/all-in-one.ts" > /dev/null; then
        echo "🔄 Automation not running, restarting..."
        ./auto-start.sh
    fi
    
    # Wait 30 seconds before checking again
    sleep 30
done
