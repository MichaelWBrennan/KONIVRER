#!/bin/bash

# Set the port for the development server
PORT=12000

# Start the development server with the specified port
echo "Starting development server on port $PORT..."
npm run dev -- --port $PORT --host 0.0.0.0 --cors