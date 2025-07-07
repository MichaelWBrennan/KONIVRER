#!/bin/bash
# Auto-start service that runs in background 24/7/365

# Log file for the service
LOG_FILE="auto-service-continuous.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Starting continuous automation service (24/7/365)"
log "📝 Logging to $LOG_FILE"

# Make sure we have the latest code
if [ -d ".git" ]; then
    log "🔄 Pulling latest code from repository"
    git pull origin main || log "⚠️ Git pull failed, continuing with existing code"
fi

# Function to start the automation
start_automation() {
    log "🤖 Starting automation process"
    
    # Kill any existing automation processes
    pkill -f "automation/all-in-one.ts" 2>/dev/null || true
    
    # Start the automation with the every-second command for continuous operation
    nohup npm run every-second > automation-continuous.log 2>&1 &
    AUTOMATION_PID=$!
    
    log "✅ Automation started with PID: $AUTOMATION_PID"
    echo $AUTOMATION_PID > .automation.pid
}

# Function to check system resources
check_resources() {
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
    MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    
    log "📊 System status: CPU: ${CPU_USAGE}%, Memory: ${MEM_USAGE}%"
    
    # Check if bc is installed
    if command -v bc >/dev/null 2>&1; then
        # If resources are critically low, take action
        if (( $(echo "$CPU_USAGE > 95" | bc -l) )) || (( $(echo "$MEM_USAGE > 95" | bc -l) )); then
            log "⚠️ System resources critical! Restarting automation..."
            start_automation
        fi
    else
        # Fallback method if bc is not installed
        if [ "${CPU_USAGE%.*}" -gt 95 ] || [ "${MEM_USAGE%.*}" -gt 95 ]; then
            log "⚠️ System resources critical! Restarting automation..."
            start_automation
        fi
    fi
}

# Start automation initially
start_automation

# Main continuous loop - runs forever
while true; do
    # Check if automation is running
    if ! pgrep -f "automation/all-in-one.ts" > /dev/null; then
        log "🔄 Automation not running, restarting..."
        start_automation
    else
        # Log that automation is still running
        AUTOMATION_PID=$(cat .automation.pid 2>/dev/null || echo 'Unknown')
        log "✅ Automation running (PID: $AUTOMATION_PID)"
    fi
    
    # Check system resources
    check_resources
    
    # Run the heal command to fix any issues
    log "🔧 Running auto-heal process"
    npm run auto-heal > auto-heal.log 2>&1 || log "⚠️ Auto-heal failed"
    
    # Wait 1 second before checking again (for true 24/7/365 continuous operation)
    sleep 1
done
