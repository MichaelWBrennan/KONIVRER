# KONIVRER Deck Database - Web Launcher

This document provides instructions on how to use the web launcher for the KONIVRER Deck Database application.

## Overview

The web launcher allows users to access the KONIVRER Deck Database application directly from their web browser without requiring any downloads. The launcher automatically starts the client and server applications and provides a unified interface for accessing all features.

## Getting Started

### Option 1: Using the Web Server (Recommended)

1. Run the web server script:
   ```bash
   ./start-web.sh
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Click the "Launch Application" button on the web launcher page.

### Option 2: Deploying to a Web Server

The web launcher can be deployed to any web server that supports Node.js. To deploy:

1. Copy the entire KONIVRER Deck Database directory to your web server.

2. Install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Start the web server:
   ```bash
   node web-server.js
   ```

4. Configure your web server (Apache, Nginx, etc.) to proxy requests to the Node.js server.

## Features

The web launcher provides the following features:

- **Single-Click Launch**: Start the application with a single click directly in your browser.
- **No Downloads Required**: Access all features without downloading or installing any software.
- **Automatic Updates**: Always access the latest version of the application.
- **Cross-Platform Compatibility**: Works on any device with a modern web browser.

## System Requirements

- **Web Browser**: Chrome, Firefox, Edge, or Safari (latest versions recommended)
- **Internet Connection**: Required for accessing the web launcher
- **Server Requirements** (if self-hosting):
  - Node.js 14.0 or higher
  - npm 6.0 or higher
  - 2GB RAM minimum
  - 500MB free disk space

## Troubleshooting

If you encounter issues with the web launcher:

1. **Application Not Loading**: Ensure the web server is running and accessible.

2. **Performance Issues**: Try clearing your browser cache or using a different browser.

3. **Server Errors**: Check the server logs in the `logs` directory for error messages.

4. **Port Conflicts**: If ports 3000, 12000, or 12001 are already in use, modify the port numbers in the `web-server.js` file.

## Security Considerations

The web launcher is designed for local use or deployment within a secure network. If deploying to a public server:

1. Configure HTTPS for secure connections.
2. Implement proper authentication mechanisms.
3. Consider using a reverse proxy like Nginx or Apache with appropriate security configurations.

---

For more information, please refer to the main documentation or contact support.