# 🚀 KONIVRER Autonomous Automation Container
# Complete out-of-the-box experience with ZERO manual commands

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git and bash for automation
RUN apk add --no-cache git bash

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Make scripts executable
RUN chmod +x auto-start.sh setup.sh

# Create start script that auto-starts everything
RUN echo '#!/bin/bash' > /app/start-container.sh && \
    echo 'echo "🚀 KONIVRER Container Starting..."' >> /app/start-container.sh && \
    echo 'echo "🤖 Autonomous automation will start automatically"' >> /app/start-container.sh && \
    echo './auto-start.sh &' >> /app/start-container.sh && \
    echo 'npm run dev' >> /app/start-container.sh && \
    chmod +x /app/start-container.sh

# Expose ports
EXPOSE 12000 12001

# Set environment variables for automation
ENV AUTOMATION=true
ENV CI=true

# Auto-start everything
CMD ["./start-container.sh"]