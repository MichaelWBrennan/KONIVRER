FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git bash curl

# Install PM2 globally
RUN npm install -g pm2 tsx

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV CI=true

# Expose ports
EXPOSE 3000

# Set up volumes for persistence
VOLUME ["/app/automation/logs", "/app/automation/reports"]

# Start the automation orchestrator
CMD ["pm2-runtime", "start", "automation/orchestrator.ts", "--name", "konivrer-automation"]