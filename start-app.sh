#!/bin/bash

# KONIVRER Deck Database - One-Click Starter Script
# Copyright (c) 2024 KONIVRER Deck Database
# Licensed under the MIT License

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   ██╗  ██╗ ██████╗ ███╗   ██╗██╗██╗   ██╗██████╗ ███████╗██████╗    ║"
echo "║   ██║ ██╔╝██╔═══██╗████╗  ██║██║██║   ██║██╔══██╗██╔════╝██╔══██╗   ║"
echo "║   █████╔╝ ██║   ██║██╔██╗ ██║██║██║   ██║██████╔╝█████╗  ██████╔╝   ║"
echo "║   ██╔═██╗ ██║   ██║██║╚██╗██║██║╚██╗ ██╔╝██╔══██╗██╔══╝  ██╔══██╗   ║"
echo "║   ██║  ██╗╚██████╔╝██║ ╚████║██║ ╚████╔╝ ██║  ██║███████╗██║  ██║   ║"
echo "║   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ║"
echo "║                                                               ║"
echo "║                    DECK DATABASE SYSTEM                       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
CLIENT_PORT=12000
SERVER_PORT=12001
CLIENT_DIR="$(dirname "$0")"
SERVER_DIR="$(dirname "$0")/server"
LOG_DIR="$(dirname "$0")/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to check if a port is in use
is_port_in_use() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -i:"$1" >/dev/null 2>&1
    return $?
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tuln | grep -q ":$1 "
    return $?
  else
    echo -e "${YELLOW}Warning: Cannot check if port $1 is in use. Missing lsof and netstat.${NC}"
    return 1
  fi
}

# Function to kill process using a specific port
kill_process_on_port() {
  echo -e "${YELLOW}Attempting to free port $1...${NC}"
  
  if command -v lsof >/dev/null 2>&1; then
    local pid=$(lsof -t -i:"$1")
    if [ -n "$pid" ]; then
      echo -e "${YELLOW}Killing process $pid using port $1${NC}"
      kill -9 "$pid" 2>/dev/null
      return 0
    fi
  elif command -v netstat >/dev/null 2>&1 && command -v grep >/dev/null 2>&1 && command -v awk >/dev/null 2>&1; then
    local pid=$(netstat -tlnp 2>/dev/null | grep ":$1 " | awk '{print $7}' | cut -d'/' -f1)
    if [ -n "$pid" ]; then
      echo -e "${YELLOW}Killing process $pid using port $1${NC}"
      kill -9 "$pid" 2>/dev/null
      return 0
    fi
  fi
  
  echo -e "${RED}Could not find or kill process using port $1${NC}"
  return 1
}

# Check for required dependencies
check_dependencies() {
  local missing_deps=0
  
  echo -e "${BLUE}Checking dependencies...${NC}"
  
  if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run this application.${NC}"
    missing_deps=1
  else
    echo -e "${GREEN}✓ Node.js is installed: $(node --version)${NC}"
  fi
  
  if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}npm is not installed. Please install npm to run this application.${NC}"
    missing_deps=1
  else
    echo -e "${GREEN}✓ npm is installed: $(npm --version)${NC}"
  fi
  
  if [ $missing_deps -eq 1 ]; then
    echo -e "${RED}Please install the missing dependencies and try again.${NC}"
    exit 1
  fi
}

# Start the server
start_server() {
  echo -e "${BLUE}Starting server on port $SERVER_PORT...${NC}"
  
  # Check if port is in use
  if is_port_in_use "$SERVER_PORT"; then
    echo -e "${YELLOW}Port $SERVER_PORT is already in use.${NC}"
    read -p "Do you want to stop the process using this port and continue? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
      kill_process_on_port "$SERVER_PORT"
      sleep 2
    else
      echo -e "${RED}Server startup aborted.${NC}"
      exit 1
    fi
  fi
  
  # Start the server
  cd "$SERVER_DIR"
  echo -e "${GREEN}Installing server dependencies...${NC}"
  npm install
  
  echo -e "${GREEN}Starting server...${NC}"
  PORT="$SERVER_PORT" npm start > "$LOG_DIR/server.log" 2>&1 &
  SERVER_PID=$!
  echo -e "${GREEN}Server started with PID: $SERVER_PID${NC}"
  
  # Wait for server to start
  echo -e "${YELLOW}Waiting for server to start...${NC}"
  sleep 5
  
  # Return to the original directory
  cd "$CLIENT_DIR"
}

# Start the client
start_client() {
  echo -e "${BLUE}Starting client on port $CLIENT_PORT...${NC}"
  
  # Check if port is in use
  if is_port_in_use "$CLIENT_PORT"; then
    echo -e "${YELLOW}Port $CLIENT_PORT is already in use.${NC}"
    read -p "Do you want to stop the process using this port and continue? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
      kill_process_on_port "$CLIENT_PORT"
      sleep 2
    else
      echo -e "${RED}Client startup aborted.${NC}"
      exit 1
    fi
  fi
  
  # Start the client
  cd "$CLIENT_DIR"
  echo -e "${GREEN}Installing client dependencies...${NC}"
  npm install
  
  echo -e "${GREEN}Starting client...${NC}"
  npm run dev -- --port $CLIENT_PORT --host 0.0.0.0 --strictPort
  
  # This point is reached when the client is stopped
  echo -e "${YELLOW}Client stopped. Shutting down server...${NC}"
  kill $SERVER_PID
  echo -e "${GREEN}Server stopped.${NC}"
}

# Open the application in the default browser
open_in_browser() {
  echo -e "${BLUE}Opening application in browser...${NC}"
  sleep 5 # Give the application time to start
  
  # Try to open the browser using the appropriate command for the OS
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:$CLIENT_PORT" &
  elif command -v open >/dev/null 2>&1; then
    open "http://localhost:$CLIENT_PORT" &
  elif command -v start >/dev/null 2>&1; then
    start "http://localhost:$CLIENT_PORT" &
  else
    echo -e "${YELLOW}Could not automatically open the browser.${NC}"
    echo -e "${YELLOW}Please open http://localhost:$CLIENT_PORT in your browser.${NC}"
  fi
}

# Display application URLs
display_urls() {
  echo -e "\n${GREEN}=== KONIVRER Deck Database is now running! ===${NC}"
  echo -e "${BLUE}Client URL:${NC} http://localhost:$CLIENT_PORT"
  echo -e "${BLUE}Server URL:${NC} http://localhost:$SERVER_PORT"
  echo -e "${BLUE}Log files:${NC} $LOG_DIR/client.log and $LOG_DIR/server.log"
  echo -e "\n${YELLOW}Press Ctrl+C to stop the application${NC}\n"
}

# Main execution
check_dependencies
start_server
open_in_browser
display_urls
start_client