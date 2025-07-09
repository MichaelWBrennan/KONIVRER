#!/bin/bash
# Start KONIVRER Continuous Automation Service (24/7/365) using Docker

# Log file
LOG_FILE="docker-continuous.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Starting KONIVRER Continuous Automation Service (24/7/365) using Docker"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log "⚠️ Docker is not installed. Please install Docker first."
    echo "Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log "⚠️ Docker Compose is not installed. Please install Docker Compose first."
    echo "Please install Docker Compose and try again."
    exit 1
fi

# Stop any existing containers
log "🔄 Stopping any existing containers..."
docker-compose -f docker-compose.continuous.yml down 2>/dev/null || true

# Start the containers
log "🚀 Starting containers..."
docker-compose -f docker-compose.continuous.yml up -d

# Check if containers are running
if docker ps | grep -q "konivrer-automation-24-7-365"; then
    log "✅ Automation container is running"
    echo "✅ KONIVRER Continuous Automation Service (24/7/365) is now running in Docker"
    echo "📝 To view logs: docker logs -f konivrer-automation-24-7-365"
else
    log "⚠️ Failed to start automation container"
    echo "⚠️ Failed to start the automation container. Check the logs for details."
    exit 1
fi

# Set up a cron job to ensure the container is always running
if command -v crontab &> /dev/null; then
    log "🔄 Setting up cron job to ensure container is always running..."
    CRON_CMD="*/1 * * * * docker ps | grep -q konivrer-automation-24-7-365 || (cd $(pwd) && docker-compose -f docker-compose.continuous.yml up -d)"
    (crontab -l 2>/dev/null | grep -v "konivrer-automation"; echo "$CRON_CMD") | crontab -
    log "✅ Cron job set up successfully"
fi

log "🎉 Setup complete! The automation system is now running 24/7/365"
echo ""
echo "🎉 KONIVRER Continuous Automation Service (24/7/365) is now running in Docker"
echo "📊 The service will run continuously and restart automatically if it stops"
echo "📝 To view logs: docker logs -f konivrer-automation-24-7-365"
echo "⏹️ To stop the service: docker-compose -f docker-compose.continuous.yml down"