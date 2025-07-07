#!/bin/bash
# Install KONIVRER Continuous Automation Service (24/7/365)

# Log file
LOG_FILE="install-service.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Installing KONIVRER Continuous Automation Service (24/7/365)"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log "⚠️ This script must be run as root. Please use sudo."
    echo "Please run this script as root using sudo:"
    echo "sudo bash install-continuous-service.sh"
    exit 1
fi

# Get the absolute path to the repository
REPO_PATH=$(pwd)
log "📂 Repository path: $REPO_PATH"

# Update the service file with the correct path
sed -i "s|/workspace/KONIVRER-deck-database|$REPO_PATH|g" "$REPO_PATH/konivrer-automation.service"
log "✅ Updated service file with correct path"

# Make scripts executable
chmod +x "$REPO_PATH/auto-service.sh"
chmod +x "$REPO_PATH/auto-start.sh"
log "✅ Made scripts executable"

# Copy the service file to systemd directory
cp "$REPO_PATH/konivrer-automation.service" /etc/systemd/system/
log "✅ Copied service file to systemd directory"

# Reload systemd to recognize the new service
systemctl daemon-reload
log "✅ Reloaded systemd"

# Enable the service to start on boot
systemctl enable konivrer-automation.service
log "✅ Enabled service to start on boot"

# Start the service
systemctl start konivrer-automation.service
log "✅ Started service"

# Check service status
SERVICE_STATUS=$(systemctl is-active konivrer-automation.service)
if [ "$SERVICE_STATUS" = "active" ]; then
    log "✅ Service is running successfully"
else
    log "⚠️ Service failed to start. Status: $SERVICE_STATUS"
    log "⚠️ Check logs with: journalctl -u konivrer-automation.service"
fi

# Create a crontab entry to check the service every 5 minutes (reduced frequency)
(crontab -l 2>/dev/null | grep -v "konivrer-automation.service"; echo "*/5 * * * * systemctl is-active --quiet konivrer-automation.service || systemctl restart konivrer-automation.service") | crontab -
log "✅ Added crontab entry to check service every 5 minutes"

log "🎉 Installation complete!"
log "📊 Service status: $SERVICE_STATUS"
log "📝 To view logs: journalctl -u konivrer-automation.service -f"
log "🔄 To restart service: systemctl restart konivrer-automation.service"
log "⏹️ To stop service: systemctl stop konivrer-automation.service"

echo ""
echo "🎉 KONIVRER Continuous Automation Service (24/7/365) installed successfully!"
echo "📊 The service is now running and will continue to run 24/7/365"
echo "📝 It will automatically restart if it crashes or if the system reboots"
echo "📝 To view logs: journalctl -u konivrer-automation.service -f"