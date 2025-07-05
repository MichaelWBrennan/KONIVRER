#!/bin/bash

# Start server script for KONIVRER Deck Database
# This script installs dependencies and starts the server

# Change to server directory
cd "$(dirname "$0")/server"

# Install dependencies
echo "Installing server dependencies..."
npm install

# Start server
echo "Starting server..."
npm start