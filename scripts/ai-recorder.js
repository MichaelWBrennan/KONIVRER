/**
 * AI Recorder Script
 * 
 * This script records AI-related activities and metrics during development.
 * It can be used to track AI integration points, performance impacts, and security considerations.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const AI_LOG_DIR = path.join(process.cwd(), '.ai-logs');
const CURRENT_SESSION_FILE = path.join(AI_LOG_DIR, 'current-session.json');
const HISTORY_FILE = path.join(AI_LOG_DIR, 'history.json');

// Ensure log directory exists
if (!fs.existsSync(AI_LOG_DIR)) {
  fs.mkdirSync(AI_LOG_DIR, { recursive: true });
}

// Initialize history file if it doesn't exist
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
}

// Command handlers
const commands = {
  // Start a new AI recording session
  start: () => {
    const session = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      activities: [],
      decisions: [],
      performance: [],
      security: []
    };
    
    fs.writeFileSync(CURRENT_SESSION_FILE, JSON.stringify(session, null, 2));
    console.log(`AI recording session started with ID: ${session.id}`);
  },
  
  // End the current AI recording session
  end: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    session.endTime = new Date().toISOString();
    
    // Add to history
    const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    history.push(session);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    
    // Remove current session
    fs.unlinkSync(CURRENT_SESSION_FILE);
    
    console.log(`AI recording session ${session.id} ended and saved to history.`);
  },
  
  // Record an AI activity
  activity: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found. Start a session first.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    const activity = {
      timestamp: new Date().toISOString(),
      type: process.argv[3] || 'general',
      description: process.argv[4] || 'AI activity recorded'
    };
    
    session.activities.push(activity);
    fs.writeFileSync(CURRENT_SESSION_FILE, JSON.stringify(session, null, 2));
    
    console.log(`AI activity recorded: ${activity.description}`);
  },
  
  // Record an AI decision
  decision: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found. Start a session first.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    const decision = {
      timestamp: new Date().toISOString(),
      context: process.argv[3] || 'general',
      decision: process.argv[4] || 'Decision made by AI',
      alternatives: process.argv[5] ? process.argv[5].split(',') : []
    };
    
    session.decisions.push(decision);
    fs.writeFileSync(CURRENT_SESSION_FILE, JSON.stringify(session, null, 2));
    
    console.log(`AI decision recorded: ${decision.decision}`);
  },
  
  // Record performance metrics
  performance: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found. Start a session first.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    const metric = {
      timestamp: new Date().toISOString(),
      component: process.argv[3] || 'general',
      metric: process.argv[4] || 'execution_time',
      value: process.argv[5] || '0'
    };
    
    session.performance.push(metric);
    fs.writeFileSync(CURRENT_SESSION_FILE, JSON.stringify(session, null, 2));
    
    console.log(`AI performance metric recorded: ${metric.component} - ${metric.metric}: ${metric.value}`);
  },
  
  // Record security considerations
  security: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found. Start a session first.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    const security = {
      timestamp: new Date().toISOString(),
      type: process.argv[3] || 'general',
      description: process.argv[4] || 'Security consideration',
      severity: process.argv[5] || 'medium'
    };
    
    session.security.push(security);
    fs.writeFileSync(CURRENT_SESSION_FILE, JSON.stringify(session, null, 2));
    
    console.log(`AI security consideration recorded: ${security.description} (${security.severity})`);
  },
  
  // Generate a summary of the current session
  summary: () => {
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      console.error('No active AI recording session found.');
      process.exit(1);
    }
    
    const session = JSON.parse(fs.readFileSync(CURRENT_SESSION_FILE, 'utf8'));
    
    console.log('\n📊 AI Session Summary');
    console.log('====================');
    console.log(`Session ID: ${session.id}`);
    console.log(`Started: ${session.startTime}`);
    console.log(`Activities: ${session.activities.length}`);
    console.log(`Decisions: ${session.decisions.length}`);
    console.log(`Performance Metrics: ${session.performance.length}`);
    console.log(`Security Considerations: ${session.security.length}`);
    
    if (session.activities.length > 0) {
      console.log('\nRecent Activities:');
      session.activities.slice(-3).forEach(a => {
        console.log(`- [${a.type}] ${a.description}`);
      });
    }
    
    if (session.decisions.length > 0) {
      console.log('\nRecent Decisions:');
      session.decisions.slice(-3).forEach(d => {
        console.log(`- [${d.context}] ${d.decision}`);
      });
    }
  },
  
  // Run a command with AI recording
  run: () => {
    const command = process.argv.slice(3).join(' ');
    if (!command) {
      console.error('No command specified to run.');
      process.exit(1);
    }
    
    // Start a session if none exists
    if (!fs.existsSync(CURRENT_SESSION_FILE)) {
      commands.start();
    }
    
    console.log(`Running command with AI recording: ${command}`);
    
    try {
      // Record start time
      const startTime = Date.now();
      
      // Execute the command
      execSync(command, { stdio: 'inherit' });
      
      // Record end time and calculate duration
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Record performance
      process.argv[3] = 'command_execution';
      process.argv[4] = 'execution_time';
      process.argv[5] = duration.toString();
      commands.performance();
      
      console.log(`Command completed in ${duration}ms`);
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  }
};

// Main function
function main() {
  const command = process.argv[2];
  
  if (!command || !commands[command]) {
    console.error('Invalid command. Available commands: start, end, activity, decision, performance, security, summary, run');
    process.exit(1);
  }
  
  commands[command]();
}

// Run the script
main();