#!/usr/bin/env node

/**
 * KONIVRER Deck Database - AI Development Recorder
 * 
 * Meticulous AI development tracking and documentation system
 * Records all development activities, decisions, and changes for AI transparency
 * 
 * Features:
 * - Real-time development activity logging
 * - Code change tracking with context
 * - Decision rationale recording
 * - Performance impact analysis
 * - Security change monitoring
 * - Automated documentation generation
 * - Integration with existing project automation
 * 
 * Copyright (c) 2024 KONIVRER Team
 * Licensed under the MIT License
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class AIRecorder {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.logDir = path.join(PROJECT_ROOT, 'ai-logs');
    this.sessionFile = path.join(this.logDir, `session-${this.sessionId}.json`);
    this.summaryFile = path.join(this.logDir, 'ai-development-summary.md');
    this.metricsFile = path.join(this.logDir, 'ai-metrics.json');
    
    this.session = {
      id: this.sessionId,
      startTime: this.startTime.toISOString(),
      endTime: null,
      activities: [],
      codeChanges: [],
      decisions: [],
      performance: {
        buildTimes: [],
        testResults: [],
        bundleSize: []
      },
      security: {
        vulnerabilities: [],
        fixes: []
      },
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        projectVersion: this.getProjectVersion(),
        gitBranch: this.getGitBranch(),
        gitCommit: this.getGitCommit()
      }
    };

    this.initializeLogging();
  }

  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ai-${timestamp}-${random}`;
  }

  async initializeLogging() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      await this.saveSession();
      console.log(`🤖 AI Recorder initialized - Session: ${this.sessionId}`);
    } catch (error) {
      console.error('Failed to initialize AI logging:', error);
    }
  }

  getProjectVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
      return packageJson.version;
    } catch {
      return 'unknown';
    }
  }

  getGitBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { 
        cwd: PROJECT_ROOT, 
        encoding: 'utf8' 
      }).trim();
    } catch {
      return 'unknown';
    }
  }

  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD', { 
        cwd: PROJECT_ROOT, 
        encoding: 'utf8' 
      }).trim().substring(0, 8);
    } catch {
      return 'unknown';
    }
  }

  async recordActivity(type, description, details = {}) {
    const activity = {
      timestamp: new Date().toISOString(),
      type,
      description,
      details,
      duration: details.duration || null
    };

    this.session.activities.push(activity);
    await this.saveSession();
    
    console.log(`📝 [${type.toUpperCase()}] ${description}`);
    if (details.impact) {
      console.log(`   Impact: ${details.impact}`);
    }
  }

  async recordCodeChange(filePath, changeType, description, beforeAfter = {}) {
    const change = {
      timestamp: new Date().toISOString(),
      filePath: path.relative(PROJECT_ROOT, filePath),
      changeType, // 'create', 'modify', 'delete', 'rename'
      description,
      beforeAfter,
      linesChanged: this.calculateLinesChanged(beforeAfter),
      gitDiff: await this.getGitDiff(filePath)
    };

    this.session.codeChanges.push(change);
    await this.saveSession();
    
    console.log(`🔧 Code Change: ${changeType} - ${path.basename(filePath)}`);
    console.log(`   ${description}`);
  }

  async recordDecision(decision, rationale, alternatives = [], impact = '') {
    const decisionRecord = {
      timestamp: new Date().toISOString(),
      decision,
      rationale,
      alternatives,
      impact,
      context: {
        gitBranch: this.getGitBranch(),
        gitCommit: this.getGitCommit()
      }
    };

    this.session.decisions.push(decisionRecord);
    await this.saveSession();
    
    console.log(`🎯 Decision: ${decision}`);
    console.log(`   Rationale: ${rationale}`);
    if (impact) {
      console.log(`   Impact: ${impact}`);
    }
  }

  async recordPerformanceMetric(type, value, context = {}) {
    const metric = {
      timestamp: new Date().toISOString(),
      type, // 'buildTime', 'testDuration', 'bundleSize', 'loadTime'
      value,
      context
    };

    if (!this.session.performance[type]) {
      this.session.performance[type] = [];
    }
    this.session.performance[type].push(metric);
    
    await this.saveSession();
    console.log(`⚡ Performance: ${type} = ${value}${context.unit || ''}`);
  }

  async recordSecurityEvent(type, description, severity = 'medium', resolution = '') {
    const event = {
      timestamp: new Date().toISOString(),
      type, // 'vulnerability', 'fix', 'audit', 'scan'
      description,
      severity, // 'low', 'medium', 'high', 'critical'
      resolution,
      context: {
        gitCommit: this.getGitCommit()
      }
    };

    if (type === 'vulnerability') {
      this.session.security.vulnerabilities.push(event);
    } else if (type === 'fix') {
      this.session.security.fixes.push(event);
    }

    await this.saveSession();
    console.log(`🔒 Security: ${type} - ${severity} - ${description}`);
  }

  calculateLinesChanged(beforeAfter) {
    if (!beforeAfter.before || !beforeAfter.after) return 0;
    
    const beforeLines = beforeAfter.before.split('\n').length;
    const afterLines = beforeAfter.after.split('\n').length;
    return Math.abs(afterLines - beforeLines);
  }

  async getGitDiff(filePath) {
    try {
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      return execSync(`git diff HEAD -- "${relativePath}"`, { 
        cwd: PROJECT_ROOT, 
        encoding: 'utf8' 
      });
    } catch {
      return '';
    }
  }

  async saveSession() {
    try {
      await fs.writeFile(this.sessionFile, JSON.stringify(this.session, null, 2));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  async generateSummary() {
    const duration = new Date() - this.startTime;
    const durationMinutes = Math.round(duration / 60000);

    const summary = `# AI Development Session Summary

## Session Information
- **Session ID**: ${this.sessionId}
- **Duration**: ${durationMinutes} minutes
- **Start Time**: ${this.startTime.toISOString()}
- **End Time**: ${new Date().toISOString()}
- **Git Branch**: ${this.session.metadata.gitBranch}
- **Git Commit**: ${this.session.metadata.gitCommit}

## Activities Summary
- **Total Activities**: ${this.session.activities.length}
- **Code Changes**: ${this.session.codeChanges.length}
- **Decisions Made**: ${this.session.decisions.length}
- **Security Events**: ${this.session.security.vulnerabilities.length + this.session.security.fixes.length}

## Code Changes
${this.session.codeChanges.map(change => 
  `- **${change.changeType}**: \`${change.filePath}\` - ${change.description}`
).join('\n')}

## Key Decisions
${this.session.decisions.map(decision => 
  `- **${decision.decision}**: ${decision.rationale}`
).join('\n')}

## Performance Metrics
${Object.entries(this.session.performance).map(([type, metrics]) => 
  `- **${type}**: ${metrics.length} measurements`
).join('\n')}

## Security Events
- **Vulnerabilities**: ${this.session.security.vulnerabilities.length}
- **Fixes Applied**: ${this.session.security.fixes.length}

## Activities Timeline
${this.session.activities.map(activity => 
  `- **${activity.timestamp}**: [${activity.type}] ${activity.description}`
).join('\n')}

---
*Generated by KONIVRER AI Recorder v1.0.0*
`;

    await fs.writeFile(this.summaryFile, summary);
    console.log(`📊 Summary generated: ${this.summaryFile}`);
  }

  async endSession() {
    this.session.endTime = new Date().toISOString();
    await this.saveSession();
    await this.generateSummary();
    await this.updateMetrics();
    
    const duration = new Date() - this.startTime;
    const durationMinutes = Math.round(duration / 60000);
    
    console.log(`\n🏁 AI Session Complete`);
    console.log(`   Duration: ${durationMinutes} minutes`);
    console.log(`   Activities: ${this.session.activities.length}`);
    console.log(`   Code Changes: ${this.session.codeChanges.length}`);
    console.log(`   Decisions: ${this.session.decisions.length}`);
    console.log(`   Session File: ${this.sessionFile}`);
  }

  async updateMetrics() {
    try {
      let metrics = {};
      try {
        const existingMetrics = await fs.readFile(this.metricsFile, 'utf8');
        metrics = JSON.parse(existingMetrics);
      } catch {
        // File doesn't exist, start fresh
      }

      if (!metrics.sessions) metrics.sessions = [];
      if (!metrics.totals) {
        metrics.totals = {
          totalSessions: 0,
          totalActivities: 0,
          totalCodeChanges: 0,
          totalDecisions: 0,
          totalDuration: 0
        };
      }

      const sessionDuration = new Date(this.session.endTime) - new Date(this.session.startTime);
      
      metrics.sessions.push({
        id: this.sessionId,
        startTime: this.session.startTime,
        endTime: this.session.endTime,
        duration: sessionDuration,
        activities: this.session.activities.length,
        codeChanges: this.session.codeChanges.length,
        decisions: this.session.decisions.length
      });

      metrics.totals.totalSessions++;
      metrics.totals.totalActivities += this.session.activities.length;
      metrics.totals.totalCodeChanges += this.session.codeChanges.length;
      metrics.totals.totalDecisions += this.session.decisions.length;
      metrics.totals.totalDuration += sessionDuration;

      await fs.writeFile(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  }

  // Integration with existing project scripts
  async runWithRecording(command, description) {
    const startTime = Date.now();
    
    await this.recordActivity('command', `Executing: ${command}`, { description });
    
    try {
      const output = execSync(command, { 
        cwd: PROJECT_ROOT, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      await this.recordActivity('command_success', `Completed: ${command}`, { 
        duration: `${duration}ms`,
        output: output.substring(0, 500) // Truncate long output
      });
      
      return output;
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.recordActivity('command_error', `Failed: ${command}`, { 
        duration: `${duration}ms`,
        error: error.message
      });
      throw error;
    }
  }

  // Watch for file changes
  async watchFileChanges() {
    const chokidar = await import('chokidar');
    
    const watcher = chokidar.watch([
      path.join(PROJECT_ROOT, 'src/**/*'),
      path.join(PROJECT_ROOT, 'scripts/**/*'),
      path.join(PROJECT_ROOT, '*.js'),
      path.join(PROJECT_ROOT, '*.json'),
      path.join(PROJECT_ROOT, '*.md')
    ], {
      ignored: [
        '**/node_modules/**',
        '**/ai-logs/**',
        '**/.git/**'
      ]
    });

    watcher.on('change', async (filePath) => {
      await this.recordCodeChange(filePath, 'modify', 'File modified by AI');
    });

    watcher.on('add', async (filePath) => {
      await this.recordCodeChange(filePath, 'create', 'File created by AI');
    });

    watcher.on('unlink', async (filePath) => {
      await this.recordCodeChange(filePath, 'delete', 'File deleted by AI');
    });

    console.log('👁️  File watching enabled');
    return watcher;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const recorder = new AIRecorder();

  switch (command) {
    case 'start':
      console.log('🚀 Starting AI recording session...');
      const watcher = await recorder.watchFileChanges();
      
      // Keep the process alive
      process.on('SIGINT', async () => {
        console.log('\n🛑 Stopping AI recorder...');
        watcher.close();
        await recorder.endSession();
        process.exit(0);
      });
      
      console.log('Press Ctrl+C to stop recording');
      break;

    case 'activity':
      const type = args[1] || 'general';
      const description = args.slice(2).join(' ') || 'AI activity';
      await recorder.recordActivity(type, description);
      break;

    case 'decision':
      const decision = args[1] || 'Decision made';
      const rationale = args.slice(2).join(' ') || 'AI decision rationale';
      await recorder.recordDecision(decision, rationale);
      break;

    case 'performance':
      const metricType = args[1] || 'general';
      const value = args[2] || '0';
      await recorder.recordPerformanceMetric(metricType, value);
      break;

    case 'security':
      const eventType = args[1] || 'audit';
      const eventDescription = args.slice(2).join(' ') || 'Security event';
      await recorder.recordSecurityEvent(eventType, eventDescription);
      break;

    case 'summary':
      await recorder.generateSummary();
      break;

    case 'end':
      await recorder.endSession();
      break;

    case 'run':
      const commandToRun = args.slice(1).join(' ');
      if (!commandToRun) {
        console.error('Please provide a command to run');
        process.exit(1);
      }
      await recorder.runWithRecording(commandToRun, 'AI executed command');
      break;

    default:
      console.log(`
🤖 KONIVRER AI Recorder v1.0.0

Usage:
  node scripts/ai-recorder.js <command> [options]

Commands:
  start                           Start recording session with file watching
  activity <type> <description>   Record an activity
  decision <decision> <rationale> Record a decision
  performance <type> <value>      Record performance metric
  security <type> <description>   Record security event
  run <command>                   Execute command with recording
  summary                         Generate session summary
  end                            End current session

Examples:
  node scripts/ai-recorder.js start
  node scripts/ai-recorder.js activity "feature" "Implementing card search"
  node scripts/ai-recorder.js decision "Use React hooks" "Better state management"
  node scripts/ai-recorder.js run "npm test"
  node scripts/ai-recorder.js end
      `);
      break;
  }
}

// Handle uncaught errors
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default AIRecorder;