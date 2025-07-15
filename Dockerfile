# 🚀 KONIVRER + OpenHands Container
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git bash curl

# Clone OpenHands backend to subdir
RUN git clone https://github.com/continuedev/openhands.git /app/openhands

# Copy your custom automation scripts and dependencies
COPY package*.json ./
COPY . .

# Install your dependencies (if any)
RUN [ -f package.json ] && npm install || true

# Install OpenHands dependencies
RUN cd /app/openhands && npm install

# Make your automation scripts executable
RUN chmod +x auto-start.sh setup.sh

# Create unified startup script
RUN echo '#!/bin/bash' > /app/start-container.sh && \
    echo 'echo "🚀 KONIVRER Container Sta
