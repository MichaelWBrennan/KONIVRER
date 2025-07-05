#!/bin/bash

# KONIVRER Deck Database - Web Server Starter
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
echo "║                    WEB LAUNCHER                               ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration
WEB_PORT=3000
SERVER_DIR="$(dirname "$0")/server"

# Check for required dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}Node.js is not installed. Please install Node.js to run this application.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Node.js is installed: $(node --version)${NC}"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo -e "${RED}npm is not installed. Please install npm to run this application.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ npm is installed: $(npm --version)${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
cd "$SERVER_DIR" && npm install

# Start the web server
echo -e "${BLUE}Starting web server...${NC}"
cd "$SERVER_DIR" && PORT=$WEB_PORT node web-server.js

# This script will not reach this point unless the web server crashes
echo -e "${RED}Web server stopped unexpectedly.${NC}"
exit 1