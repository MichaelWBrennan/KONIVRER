#!/bin/bash

# Start both client and server for KONIVRER Deck Database

# Start server in background
echo "Starting server..."
cd "$(dirname "$0")/server"
npm install
PORT=12001 npm start &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Start client
echo "Starting client..."
cd "$(dirname "$0")"
npm install
npm run dev -- --port 12000 --host 0.0.0.0 --strictPort

# Kill server when client is stopped
kill $SERVER_PID