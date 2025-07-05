@echo off
REM KONIVRER Deck Database - One-Click Starter Script for Windows
REM Copyright (c) 2024 KONIVRER Deck Database
REM Licensed under the MIT License

echo.
echo  ██╗  ██╗ ██████╗ ███╗   ██╗██╗██╗   ██╗██████╗ ███████╗██████╗
echo  ██║ ██╔╝██╔═══██╗████╗  ██║██║██║   ██║██╔══██╗██╔════╝██╔══██╗
echo  █████╔╝ ██║   ██║██╔██╗ ██║██║██║   ██║██████╔╝█████╗  ██████╔╝
echo  ██╔═██╗ ██║   ██║██║╚██╗██║██║╚██╗ ██╔╝██╔══██╗██╔══╝  ██╔══██╗
echo  ██║  ██╗╚██████╔╝██║ ╚████║██║ ╚████╔╝ ██║  ██║███████╗██║  ██║
echo  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
echo.
echo                    DECK DATABASE SYSTEM
echo.

REM Configuration
set CLIENT_PORT=12000
set SERVER_PORT=12001
set CLIENT_DIR=%~dp0
set SERVER_DIR=%~dp0server
set LOG_DIR=%~dp0logs

REM Create logs directory if it doesn't exist
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version: 
node --version
echo npm version: 
npm --version

REM Start server
echo Starting server on port %SERVER_PORT%...
cd /d "%SERVER_DIR%"
echo Installing server dependencies...
call npm install

echo Starting server...
start /b cmd /c "set PORT=%SERVER_PORT% && npm start > "%LOG_DIR%\server.log" 2>&1"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

REM Return to client directory
cd /d "%CLIENT_DIR%"

REM Start client
echo Starting client on port %CLIENT_PORT%...
echo Installing client dependencies...
call npm install

REM Open browser
echo Opening application in browser...
start http://localhost:%CLIENT_PORT%

echo.
echo === KONIVRER Deck Database is now running! ===
echo Client URL: http://localhost:%CLIENT_PORT%
echo Server URL: http://localhost:%SERVER_PORT%
echo Log files: %LOG_DIR%\client.log and %LOG_DIR%\server.log
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start client (this will block until client is stopped)
npm run dev -- --port %CLIENT_PORT% --host 0.0.0.0 --strictPort

REM This point is reached when the client is stopped
echo Client stopped. Shutting down server...
taskkill /f /im node.exe > nul 2>&1
echo Server stopped.

pause