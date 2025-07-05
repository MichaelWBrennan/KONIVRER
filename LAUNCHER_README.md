# KONIVRER Deck Database - Quick Start Guide

This document provides instructions on how to start the KONIVRER Deck Database application with a single click.

## Starting the Application

There are several ways to start the application:

### Option 1: Using the HTML Launcher (Recommended for most users)

1. Open the `launcher.html` file in your web browser
2. Click the "Launch Application" button
3. The application will start and open in your default web browser

### Option 2: Using the Shell Script (Linux/macOS)

1. Open a terminal
2. Navigate to the KONIVRER Deck Database directory
3. Make the script executable (if not already): `chmod +x start-app.sh`
4. Run the script: `./start-app.sh`

### Option 3: Using the Batch File (Windows)

1. Open File Explorer
2. Navigate to the KONIVRER Deck Database directory
3. Double-click on `start-app.bat`

### Option 4: Using the Desktop Launcher (Linux)

1. Make the desktop file executable: `chmod +x KONIVRER-Launcher.desktop`
2. Double-click the `KONIVRER-Launcher.desktop` file
3. If prompted, click "Run" or "Execute"

## Troubleshooting

If you encounter issues starting the application:

1. **Port conflicts**: The application uses ports 12000 (client) and 12001 (server). If these ports are already in use, the launcher will prompt you to free them.

2. **Missing dependencies**: Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

3. **Permission issues**: On Linux/macOS, make sure the script has execute permissions: `chmod +x start-app.sh`

4. **Manual startup**: If the launchers don't work, you can start the application manually:
   - Start the server: `cd server && npm install && PORT=12001 npm start`
   - In another terminal, start the client: `npm install && npm run dev -- --port 12000 --host 0.0.0.0 --strictPort`

## Accessing the Application

Once started, the application will be available at:

- Client URL: http://localhost:12000
- Server URL: http://localhost:12001

## Stopping the Application

To stop the application:

- If using the terminal, press `Ctrl+C` in the terminal window
- If using the batch file or desktop launcher, close the terminal window that opened

## Log Files

Log files are stored in the `logs` directory:

- Client log: `logs/client.log`
- Server log: `logs/server.log`

These logs can be helpful for troubleshooting if you encounter any issues.

## System Requirements

- Node.js 14.0 or higher
- npm 6.0 or higher
- Modern web browser (Chrome, Firefox, Edge, Safari)
- 2GB RAM minimum
- 500MB free disk space

---

For more information, please refer to the main documentation or contact support.