import { Request, Response, NextFunction } from 'express';
import { Server } from 'http';

/**
 * KONIVRER Deck Database - Web Server
 * 
 * This server serves the web launcher and proxies requests to the client and server applications.
 * It allows users to access the application directly from the web without any downloads.
 * 
 * Note: This file uses CommonJS modules (not ES modules) for compatibility with http-proxy-middleware
 */

import express from 'express';
import {  createProxyMiddleware  } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';
import {  spawn  } from 'child_process';

// Configuration
const CLIENT_PORT = process.env.CLIENT_PORT || 12000;
const SERVER_PORT = process.env.SERVER_PORT || 12001;
const WEB_PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '..');
const SERVER_DIR = __dirname;
const LOG_DIR = path.join(__dirname, '..', 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Create Express app
const app = express();

// Function to check if a port is in use
const isPortInUse = async (port) => {
  return new Promise((resolve) => {
    import net from 'net';
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
};

// Function to start the server application
const startServer = async () => {
  console.log('Starting server application...');
  
  // Check if server is already running
  const serverRunning = await isPortInUse(SERVER_PORT);
  if (serverRunning) {
    console.log(`Server is already running on port ${SERVER_PORT}`);
    return;
  }
  
  // Start the server
  const serverProcess = spawn('node', ['server.js'], {
    cwd: SERVER_DIR,
    env: { ...process.env, PORT: SERVER_PORT },
    stdio: 'pipe'
  });
  
  // Log server output
  const serverLogStream = fs.createWriteStream(path.join(LOG_DIR, 'server.log'), { flags: 'a' });
  serverProcess.stdout.pipe(serverLogStream);
  serverProcess.stderr.pipe(serverLogStream);
  
  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });
  
  // Wait for server to start
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Server started');
      resolve();
    }, 5000);
  });
};

// Function to start the client application
const startClient = async () => {
  console.log('Starting client application...');
  
  // Check if client is already running
  const clientRunning = await isPortInUse(CLIENT_PORT);
  if (clientRunning) {
    console.log(`Client is already running on port ${CLIENT_PORT}`);
    return;
  }
  
  // Start the client using Vite
  const clientProcess = spawn('npx', ['vite', '--port', CLIENT_PORT, '--host', '0.0.0.0', '--strictPort'], {
    cwd: CLIENT_DIR,
    env: { ...process.env },
    stdio: 'pipe'
  });
  
  // Log client output
  const clientLogStream = fs.createWriteStream(path.join(LOG_DIR, 'client.log'), { flags: 'a' });
  clientProcess.stdout.pipe(clientLogStream);
  clientProcess.stderr.pipe(clientLogStream);
  
  clientProcess.on('error', (err) => {
    console.error('Failed to start client:', err);
  });
  
  // Wait for client to start
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Client started');
      resolve();
    }, 5000);
  });
};

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Proxy API requests to the server
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${SERVER_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}));

// Proxy client app requests
app.use('/app', createProxyMiddleware({
  target: `http://localhost:${CLIENT_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/app': '/'
  }
}));

// Serve the web launcher as the main page
app.get('/', (req, res: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, '..', 'web-launcher.html'));
});

// Health check endpoint
app.get('/health', (req, res: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Web server is running',
    clientPort: CLIENT_PORT,
    serverPort: SERVER_PORT,
    webPort: WEB_PORT
  });
});

// Start the applications and web server
(async () => {
  try {
    // Start server and client applications
    await startServer();
    await startClient();
    
    // Start the web server
    app.listen(WEB_PORT, () => {
      console.log(`Web server running on port ${WEB_PORT}`);
      console.log(`Access the application at http://localhost:${WEB_PORT}`);
      console.log(`Client running on port ${CLIENT_PORT}`);
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting applications:', error);
  }
})();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down web server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down web server...');
  process.exit(0);
});