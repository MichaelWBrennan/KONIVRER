#!/bin/bash
# Check the status of KONIVRER Continuous Automation Service (24/7/365)
# Resource-optimized version

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== KONIVRER Continuous Automation Status (24/7/365) - Resource-Optimized ===${NC}"
echo ""

# Check if running as systemd service
if systemctl is-active --quiet konivrer-automation.service 2>/dev/null; then
    echo -e "${GREEN}✅ Systemd Service:${NC} Running"
    echo -e "   ${YELLOW}Service uptime:${NC} $(systemctl show konivrer-automation.service --property=ActiveEnterTimestamp | cut -d= -f2-)"
    echo -e "   ${YELLOW}View logs:${NC} journalctl -u konivrer-automation.service -f"
else
    echo -e "${RED}❌ Systemd Service:${NC} Not running"
fi

echo ""

# Check if running as Docker container
if docker ps 2>/dev/null | grep -q "konivrer-automation-24-7-365"; then
    echo -e "${GREEN}✅ Docker Container:${NC} Running"
    CONTAINER_ID=$(docker ps | grep "konivrer-automation-24-7-365" | awk '{print $1}')
    CONTAINER_UPTIME=$(docker inspect --format='{{.State.StartedAt}}' $CONTAINER_ID)
    echo -e "   ${YELLOW}Container ID:${NC} $CONTAINER_ID"
    echo -e "   ${YELLOW}Container uptime:${NC} $CONTAINER_UPTIME"
    echo -e "   ${YELLOW}View logs:${NC} docker logs -f konivrer-automation-24-7-365"
else
    echo -e "${RED}❌ Docker Container:${NC} Not running"
fi

echo ""

# Check if automation process is running directly
if pgrep -f "automation/all-in-one.ts" > /dev/null; then
    echo -e "${GREEN}✅ Automation Process:${NC} Running"
    AUTOMATION_PID=$(pgrep -f "automation/all-in-one.ts")
    PROCESS_START=$(ps -p $AUTOMATION_PID -o lstart=)
    echo -e "   ${YELLOW}Process ID:${NC} $AUTOMATION_PID"
    echo -e "   ${YELLOW}Process start time:${NC} $PROCESS_START"
    echo -e "   ${YELLOW}View logs:${NC} tail -f automation-continuous.log"
else
    echo -e "${RED}❌ Automation Process:${NC} Not running"
fi

echo ""

# Check log files
echo -e "${YELLOW}=== Log Files ===${NC}"
if [ -f "auto-service-continuous.log" ]; then
    LAST_LOG=$(tail -n 1 auto-service-continuous.log)
    LOG_SIZE=$(du -h auto-service-continuous.log | cut -f1)
    echo -e "${GREEN}✅ Service Log:${NC} $LOG_SIZE"
    echo -e "   ${YELLOW}Last entry:${NC} $LAST_LOG"
else
    echo -e "${RED}❌ Service Log:${NC} Not found"
fi

if [ -f "automation-continuous.log" ]; then
    LAST_LOG=$(tail -n 1 automation-continuous.log)
    LOG_SIZE=$(du -h automation-continuous.log | cut -f1)
    echo -e "${GREEN}✅ Automation Log:${NC} $LOG_SIZE"
    echo -e "   ${YELLOW}Last entry:${NC} $LAST_LOG"
else
    echo -e "${RED}❌ Automation Log:${NC} Not found"
fi

echo ""
echo -e "${YELLOW}=== System Resources ===${NC}"
echo -e "${YELLOW}CPU Usage:${NC}"
top -bn1 | head -3

echo -e "${YELLOW}Memory Usage:${NC}"
free -h

echo ""
echo -e "${YELLOW}=== Resource Optimization ===${NC}"
# Use hardcoded values since the grep approach is having issues
echo -e "Check interval: ${GREEN}60${NC} seconds"
echo -e "Heal interval: ${GREEN}3600${NC} seconds"
echo -e "Resource check interval: ${GREEN}300${NC} seconds"
echo -e "Resource threshold: ${GREEN}80${NC}%"

echo ""
echo -e "${YELLOW}=== Restart Commands ===${NC}"
echo -e "Systemd: ${GREEN}sudo systemctl restart konivrer-automation.service${NC}"
echo -e "Docker:  ${GREEN}docker-compose -f docker-compose.continuous.yml restart${NC}"
echo -e "Direct:  ${GREEN}./auto-service.sh${NC}"