# 🚀 KONIVRER + OpenHands Container
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git bash curl

# Clone OpenHands backend
RUN git clone https://github.com/continuedev/openhands.git /app/openhands

# Copy your custom automation scripts into /app
COPY package*.json ./
COPY . .

# Install your Node.js dependencies
RUN npm install

# Make your custom scripts executable
RUN chmod +x auto-start.sh setup.sh

# Create unified startup script
RUN echo '#!/bin/bash' > /app/start-container.sh && \
    echo 'echo "🚀 KONIVRER Container Starting..."' >> /app/start-container.sh && \
    echo 'echo "🤖 Autonomous automation will start automatically"' >> /app/start-container.sh && \
    echo './auto-start.sh &' >> /app/start-container.sh && \
    echo 'cd /app/openhands && npm install && npm run dev' >> /app/start-container.sh && \
    chmod +x /app/start-container.sh

# Expose OpenHands default port + your custom one
EXPOSE 3000 12000 12001

# Optional env vars
ENV AUTOMATION=true
ENV CI=true

# Start everything automatically
CMD ["./start-container.sh"]
