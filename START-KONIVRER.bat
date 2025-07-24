@echo off
echo ===================================
echo KONIVRER Auto-Start System
echo ===================================
echo.
echo Starting KONIVRER...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b
)

:: Run the auto-extract script
node auto-extract.js

:: Keep the window open
pause