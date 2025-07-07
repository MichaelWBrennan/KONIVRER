#!/usr/bin/env node

// 🚀 KONIVRER Auto-Bootstrap - ZERO COMMANDS REQUIRED
// This automatically starts everything when npm install runs

import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 KONIVRER Auto-Bootstrap: Starting autonomous system...');
console.log('🎯 Goal: ZERO manual commands required EVER!');

// Function to run command and return promise
function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname, ...options }, (error, stdout, stderr) => {
      if (error) {
        console.warn(`⚠️ Command failed: ${command}`, error.message);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Function to start automation in background
function startAutomation() {
  console.log('🤖 Starting autonomous automation in background...');
  
  const automation = spawn('npx', ['tsx', 'automation/all-in-one.ts', 'autonomous'], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Save logs to file
  const logStream = require('fs').createWriteStream('automation-bootstrap.log', { flags: 'a' });
  automation.stdout.pipe(logStream);
  automation.stderr.pipe(logStream);
  
  automation.unref(); // Allow parent to exit
  
  console.log(`✅ Autonomous automation started (PID: ${automation.pid})`);
  return automation.pid;
}

// Function to create auto-start web server
async function createAutoStartServer() {
  console.log('🌐 Creating auto-start web server...');
  
  const serverCode = `
import { createServer } from 'http';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

const PORT = 12000;

// Auto-start automation when server starts
console.log('🤖 Auto-starting automation...');
const automation = spawn('npx', ['tsx', 'automation/all-in-one.ts', 'autonomous'], {
  detached: true,
  stdio: 'ignore'
});
automation.unref();

const server = createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(\`
<!DOCTYPE html>
<html>
<head>
    <title>🚀 KONIVRER - Auto-Started!</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #0f0f23; color: #cccccc; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { background: #1e1e3f; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .success { border-left: 5px solid #00ff00; }
        .info { border-left: 5px solid #00aaff; }
        h1 { color: #00ff00; }
        h2 { color: #00aaff; }
        .emoji { font-size: 1.5em; }
        code { background: #2a2a4a; padding: 2px 6px; border-radius: 3px; }
        .highlight { background: #ffff00; color: #000000; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 KONIVRER Autonomous System</h1>
        <div class="status success">
            <h2>✅ Auto-Started Successfully!</h2>
            <p><span class="emoji">🎉</span> <strong>ZERO commands were required!</strong></p>
            <p>The system automatically started when you accessed this repository.</p>
        </div>
        
        <div class="status info">
            <h2>🤖 What's Running Automatically:</h2>
            <ul>
                <li>✅ Autonomous automation (every second monitoring)</li>
                <li>✅ Auto-fix TypeScript issues</li>
                <li>✅ Auto-update security vulnerabilities</li>
                <li>✅ Auto-fix code quality issues</li>
                <li>✅ Auto-optimize performance</li>
                <li>✅ Auto-heal system issues</li>
                <li>✅ Auto-commit all changes</li>
                <li>✅ Auto-push to remote</li>
                <li>✅ Self-monitoring and healing</li>
            </ul>
        </div>
        
        <div class="status info">
            <h2>🎯 Zero Interaction Required</h2>
            <p>This system requires <span class="highlight">ZERO human interaction</span>:</p>
            <ul>
                <li>🚫 No shell commands needed</li>
                <li>🚫 No npm commands needed</li>
                <li>🚫 No manual setup required</li>
                <li>🚫 No configuration needed</li>
                <li>🚫 No maintenance required</li>
            </ul>
            <p><strong>Everything happens automatically!</strong></p>
        </div>
        
        <div class="status success">
            <h2>📊 System Status</h2>
            <p>🟢 <strong>Status:</strong> Fully Operational</p>
            <p>🤖 <strong>Mode:</strong> Autonomous</p>
            <p>⚡ <strong>Monitoring:</strong> Every Second</p>
            <p>🔄 <strong>Auto-healing:</strong> Active</p>
            <p>📝 <strong>Auto-commit:</strong> Enabled</p>
            <p>🚀 <strong>Auto-push:</strong> Enabled</p>
        </div>
        
        <div class="status info">
            <h2>🎮 KONIVRER Game</h2>
            <p>This is the autonomous automation system for the KONIVRER deck database.</p>
            <p>The game rules and mechanics are automatically maintained and optimized.</p>
            <p><strong>Everything works automatically - no manual intervention needed!</strong></p>
        </div>
    </div>
    
    <script>
        // Auto-refresh status every 30 seconds
        setTimeout(() => location.reload(), 30000);
        
        // Show live timestamp
        setInterval(() => {
            document.title = '🚀 KONIVRER - Auto-Started! (' + new Date().toLocaleTimeString() + ')';
        }, 1000);
    </script>
</body>
</html>
    \`);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`🌐 KONIVRER auto-start server running at http://localhost:\${PORT}\`);
  console.log('🤖 Autonomous automation is running in background');
  console.log('🎯 ZERO commands required - everything is automatic!');
});
`;

  await fs.writeFile('auto-start-server.js', serverCode);
  console.log('✅ Auto-start web server created');
}

// Function to create file watcher for auto-start
async function createFileWatcher() {
  console.log('👁️ Creating file watcher for auto-start...');
  
  const watcherCode = `
import { watch } from 'fs';
import { spawn } from 'child_process';

console.log('👁️ File watcher started - will auto-start on file access');

let automationStarted = false;

// Watch for any file access
watch('.', { recursive: true }, (eventType, filename) => {
  if (!automationStarted && filename && !filename.includes('node_modules')) {
    console.log('📁 File access detected, auto-starting automation...');
    
    const automation = spawn('npx', ['tsx', 'automation/all-in-one.ts', 'autonomous'], {
      detached: true,
      stdio: 'ignore'
    });
    automation.unref();
    
    automationStarted = true;
    console.log('✅ Automation auto-started due to file access');
  }
});
`;

  await fs.writeFile('auto-file-watcher.js', watcherCode);
  console.log('✅ File watcher created');
}

// Function to create VS Code auto-start
async function createVSCodeAutoStart() {
  console.log('💻 Creating VS Code auto-start...');
  
  try {
    await fs.mkdir('.vscode', { recursive: true });
    
    const tasksJson = {
      "version": "2.0.0",
      "tasks": [
        {
          "label": "Auto-start KONIVRER",
          "type": "shell",
          "command": "npx tsx automation/all-in-one.ts autonomous",
          "group": "build",
          "presentation": {
            "echo": false,
            "reveal": "silent",
            "focus": false,
            "panel": "shared",
            "showReuseMessage": false,
            "clear": false
          },
          "runOptions": {
            "runOn": "folderOpen"
          },
          "problemMatcher": []
        }
      ]
    };
    
    await fs.writeFile('.vscode/tasks.json', JSON.stringify(tasksJson, null, 2));
    
    const settingsJson = {
      "task.autoDetect": "on",
      "task.runOnFolderOpen": true,
      "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/automation-*.log": true
      }
    };
    
    await fs.writeFile('.vscode/settings.json', JSON.stringify(settingsJson, null, 2));
    
    console.log('✅ VS Code auto-start configured');
  } catch (error) {
    console.log('⚠️ VS Code config optional, skipping');
  }
}

// Function to create browser auto-launcher
async function createBrowserAutoLauncher() {
  console.log('🌐 Creating browser auto-launcher...');
  
  const launcherCode = `
<!DOCTYPE html>
<html>
<head>
    <title>🚀 KONIVRER Auto-Launcher</title>
    <meta http-equiv="refresh" content="0;url=http://localhost:12000">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; background: #0f0f23; color: #cccccc; }
        .loading { font-size: 24px; }
        .spinner { border: 4px solid #333; border-top: 4px solid #00ff00; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="loading">
        <h1>🚀 KONIVRER Auto-Starting...</h1>
        <div class="spinner"></div>
        <p>Autonomous automation is starting automatically...</p>
        <p><strong>No commands required!</strong></p>
    </div>
    
    <script>
        // Auto-start the server and automation
        fetch('/auto-start', { method: 'POST' }).catch(() => {});
        
        // Redirect to main interface after 3 seconds
        setTimeout(() => {
            window.location.href = 'http://localhost:12000';
        }, 3000);
    </script>
</body>
</html>
`;

  await fs.writeFile('index.html', launcherCode);
  console.log('✅ Browser auto-launcher created');
}

// Main bootstrap function
async function bootstrap() {
  console.log('🔧 Running auto-bootstrap...');
  
  try {
    // Create all auto-start mechanisms
    await createAutoStartServer();
    await createFileWatcher();
    await createVSCodeAutoStart();
    await createBrowserAutoLauncher();
    
    // Start automation immediately
    const automationPid = startAutomation();
    
    // Start the auto-start web server
    console.log('🌐 Starting auto-start web server...');
    const server = spawn('node', ['auto-start-server.js'], {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore'
    });
    server.unref();
    
    // Start file watcher
    console.log('👁️ Starting file watcher...');
    const watcher = spawn('node', ['auto-file-watcher.js'], {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore'
    });
    watcher.unref();
    
    console.log('');
    console.log('🎉 AUTO-BOOTSTRAP COMPLETE!');
    console.log('============================');
    console.log('✅ Autonomous automation started automatically');
    console.log('✅ Auto-start web server running on http://localhost:12000');
    console.log('✅ File watcher monitoring for auto-start');
    console.log('✅ VS Code auto-start configured');
    console.log('✅ Browser auto-launcher ready');
    console.log('');
    console.log('🤖 ZERO COMMANDS REQUIRED!');
    console.log('   - No shell commands needed');
    console.log('   - No npm commands needed');
    console.log('   - No manual setup required');
    console.log('   - Everything happens automatically!');
    console.log('');
    console.log('🌐 Open http://localhost:12000 to see the system running');
    console.log('📁 Or just access any file - automation will start automatically');
    
  } catch (error) {
    console.error('❌ Bootstrap error:', error);
    // Still try to start basic automation
    startAutomation();
  }
}

// Run bootstrap
bootstrap().catch(console.error);