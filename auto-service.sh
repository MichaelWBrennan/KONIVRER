#!/bin/bash
# Auto-start service that runs in background 24/7/365
# Optimized for resource efficiency to prevent SIGKILL

# Log file for the service
LOG_FILE="auto-service-continuous.log"

# Function to log with timestamp (with reduced disk I/O)
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local message="[$timestamp] $1"
    echo "$message" >> "$LOG_FILE"
    # Only print to console if not too verbose
    if [[ "$1" != *"running"* ]] || [[ "$VERBOSE" == "true" ]]; then
        echo "$message"
    fi
}

# Configuration
CHECK_INTERVAL=60       # Check automation every 60 seconds instead of 1 second
HEAL_INTERVAL=3600      # Run auto-heal once per hour instead of every cycle
RESOURCE_CHECK_INTERVAL=300  # Check resources every 5 minutes
RESOURCE_THRESHOLD=80   # Lower threshold to prevent hitting system limits

# Initialize counters
HEAL_COUNTER=0
RESOURCE_CHECK_COUNTER=0

log "🚀 Starting continuous automation service (24/7/365) - Resource-Optimized"
log "📝 Logging to $LOG_FILE"
log "⚙️ Configuration: Check interval=${CHECK_INTERVAL}s, Heal interval=${HEAL_INTERVAL}s"

# Make sure we have the latest code (only at startup)
if [ -d ".git" ]; then
    log "🔄 Pulling latest code from repository"
    git pull origin main >/dev/null 2>&1 || log "⚠️ Git pull failed, continuing with existing code"
fi

# Function to start the automation
start_automation() {
    log "🤖 Starting automation process"
    
    # Kill any existing automation processes
    pkill -f "automation/all-in-one.ts" 2>/dev/null || true
    
    # Start the automation with the continuous command (not every-second to reduce load)
    nohup npm run continuous > automation-continuous.log 2>&1 &
    AUTOMATION_PID=$!
    
    log "✅ Automation started with PID: $AUTOMATION_PID"
    echo $AUTOMATION_PID > .automation.pid
}

# Function to check system resources (optimized)
check_resources() {
    # Use more efficient commands to check resources
    CPU_USAGE=$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}')
    MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    
    log "📊 System status: CPU: ${CPU_USAGE}%, Memory: ${MEM_USAGE}%"
    
    # Check if bc is installed
    if command -v bc >/dev/null 2>&1; then
        # If resources are high, take action
        if (( $(echo "$CPU_USAGE > $RESOURCE_THRESHOLD" | bc -l) )) || (( $(echo "$MEM_USAGE > $RESOURCE_THRESHOLD" | bc -l) )); then
            log "⚠️ System resources high! Restarting automation..."
            start_automation
        fi
    else
        # Fallback method if bc is not installed
        if [ "${CPU_USAGE%.*}" -gt "$RESOURCE_THRESHOLD" ] || [ "${MEM_USAGE%.*}" -gt "$RESOURCE_THRESHOLD" ]; then
            log "⚠️ System resources high! Restarting automation..."
            start_automation
        fi
    fi
}

# Start automation initially
start_automation

# Main continuous loop - runs forever but with optimized resource usage
while true; do
    # Check if automation is running
    if ! pgrep -f "automation/all-in-one.ts" > /dev/null; then
        log "🔄 Automation not running, restarting..."
        start_automation
    else
        # Log that automation is still running (less verbose)
        AUTOMATION_PID=$(cat .automation.pid 2>/dev/null || echo 'Unknown')
        log "✅ Automation running (PID: $AUTOMATION_PID)"
    fi
    
    # Check resources periodically, not every cycle
    RESOURCE_CHECK_COUNTER=$((RESOURCE_CHECK_COUNTER + 1))
    if [ $RESOURCE_CHECK_COUNTER -ge $((RESOURCE_CHECK_INTERVAL / CHECK_INTERVAL)) ]; then
        check_resources
        RESOURCE_CHECK_COUNTER=0
    fi
    
    # Run the heal command periodically, not every cycle
    HEAL_COUNTER=$((HEAL_COUNTER + 1))
    if [ $HEAL_COUNTER -ge $((HEAL_INTERVAL / CHECK_INTERVAL)) ]; then
        log "🔧 Running auto-heal process"
        npm run auto-heal > auto-heal.log 2>&1 || log "⚠️ Auto-heal failed"
        HEAL_COUNTER=0
    fi
    
    # Wait longer between checks to reduce CPU usage
    sleep $CHECK_INTERVAL
done
