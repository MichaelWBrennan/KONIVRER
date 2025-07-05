#!/bin/bash

# Start client script for KONIVRER Deck Database
# This script installs dependencies and starts the client

# Change to client directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing client dependencies..."
npm install

# Start client
echo "Starting client..."
npm run dev -- --port 12000 --host 0.0.0.0