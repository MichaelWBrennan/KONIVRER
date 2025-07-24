#!/usr/bin/env node
/**
 * KONIVRER Auto-Extract System
 * 
 * This script automatically starts the development environment
 * when the ZIP file is extracted. It's designed to be the first file
 * that gets executed when a user extracts the ZIP file.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const os = require('os');

// Log with timestamp
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Detect operating system
const platform = os.platform();
log(`Detected platform: ${platform}`);

// Function to open browser
const openBrowser = (url) => {
  log(`Opening browser to ${url}...`);
  
  try {
    switch (platform) {
      case 'win32':
        // Windows
        spawn('cmd.exe', ['/c', 'start', url], { detached: true });
        break;
      case 'darwin':
        // macOS
        spawn('open', [url], { detached: true });
        break;
      default:
        // Linux and others
        spawn('xdg-open', [url], { detached: true });
        break;
    }
    log('Browser opened successfully');
  } catch (error) {
    log(`Error opening browser: ${error.message}`);
  }
};

// Function to check if npm is installed
const isNpmInstalled = () => {
  try {
    execSync('npm --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Function to check if Node.js is installed
const isNodeInstalled = () => {
  try {
    execSync('node --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Function to install dependencies
const installDependencies = () => {
  log('Installing dependencies...');
  try {
    execSync('npm install --silent', { stdio: 'inherit' });
    log('Dependencies installed successfully');
    return true;
  } catch (error) {
    log(`Error installing dependencies: ${error.message}`);
    return false;
  }
};

// Function to start the development server
const startDevServer = () => {
  log('Starting development server...');
  
  // Create a marker file to indicate the server is running
  fs.writeFileSync('.server-running', 'true');
  
  // Start the server
  const server = spawn('npm', ['run', 'dev'], {
    detached: true,
    stdio: 'inherit'
  });
  
  // Log server PID
  log(`Server started with PID: ${server.pid}`);
  
  // Save PID to file for later cleanup
  fs.writeFileSync('.server-pid', server.pid.toString());
  
  // Wait for server to start
  setTimeout(() => {
    openBrowser('http://localhost:12000');
  }, 3000);
  
  return server;
};

// Function to create startup files for different platforms
const createStartupFiles = () => {
  log('Creating startup files for easy access...');
  
  // Windows batch file
  const batchContent = `@echo off
echo Starting KONIVRER...
node auto-extract.js
`;
  fs.writeFileSync('start-konivrer.bat', batchContent);
  log('Created start-konivrer.bat for Windows');
  
  // Shell script for macOS/Linux
  const shContent = `#!/bin/bash
echo "Starting KONIVRER..."
node auto-extract.js
`;
  fs.writeFileSync('start-konivrer.sh', shContent);
  fs.chmodSync('start-konivrer.sh', '755');
  log('Created start-konivrer.sh for macOS/Linux');
  
  // HTML launcher
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>KONIVRER Launcher</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #1a1a1a;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: #2a2a2a;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      max-width: 600px;
    }
    h1 {
      color: #f0f0f0;
      margin-bottom: 1rem;
    }
    .button {
      background-color: #4a4a4a;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
      margin: 10px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #5a5a5a;
    }
    .instructions {
      margin-top: 2rem;
      text-align: left;
      background-color: #333;
      padding: 1rem;
      border-radius: 5px;
    }
    .star {
      color: gold;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1><span class="star">⭐</span> KONIVRER Launcher <span class="star">⭐</span></h1>
    <p>Click the button below to start KONIVRER:</p>
    <button class="button" onclick="startKonivrer()">Start KONIVRER</button>
    
    <div class="instructions">
      <h3>Instructions:</h3>
      <p>1. Click the "Start KONIVRER" button above</p>
      <p>2. The system will automatically:</p>
      <ul>
        <li>Install any required dependencies</li>
        <li>Start the development server</li>
        <li>Open your browser to the application</li>
      </ul>
      <p>3. The application will open in a new browser tab</p>
      <p><strong>Note:</strong> You need Node.js installed on your computer for this to work.</p>
    </div>
  </div>

  <script>
    function startKonivrer() {
      // For security reasons, browsers can't directly execute local programs
      // This just opens instructions
      alert("Please use one of these methods to start KONIVRER:\\n\\n" +
            "Windows: Double-click start-konivrer.bat\\n" +
            "Mac/Linux: Run ./start-konivrer.sh in terminal\\n\\n" +
            "Or manually run: node auto-extract.js");
      
      // Try to open the application directly if it's already running
      window.open('http://localhost:12000', '_blank');
    }
  </script>
</body>
</html>`;
  fs.writeFileSync('KONIVRER-Launcher.html', htmlContent);
  log('Created KONIVRER-Launcher.html for easy access');
};

// Main function
const main = async () => {
  log('KONIVRER Auto-Extract System starting...');
  
  // Create startup files
  createStartupFiles();
  
  // Check if Node.js is installed
  if (!isNodeInstalled()) {
    log('Node.js is not installed. Please install Node.js to use KONIVRER.');
    return;
  }
  
  // Check if npm is installed
  if (!isNpmInstalled()) {
    log('npm is not installed. Please install npm to use KONIVRER.');
    return;
  }
  
  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    log('Dependencies not found. Installing...');
    if (!installDependencies()) {
      log('Failed to install dependencies. Please run "npm install" manually.');
      return;
    }
  }
  
  // Start the development server
  const server = startDevServer();
  
  // Keep the script running
  log('KONIVRER Auto-Extract System running. Press Ctrl+C to exit.');
};

// Run the main function
main().catch(error => {
  log(`Error: ${error.message}`);
});