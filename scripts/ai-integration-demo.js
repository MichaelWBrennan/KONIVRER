#!/usr/bin/env node

/**
 * KONIVRER AI Recorder Integration Demo
 * 
 * Demonstrates how to integrate the AI Recorder with existing development workflows
 * This script shows practical examples of using the recorder during development
 */

import AIRecorder from './ai-recorder.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function demonstrateAIRecorder() {
  console.log('🚀 Starting AI Recorder Integration Demo\n');
  
  const recorder = new AIRecorder();
  
  try {
    // 1. Record the start of a development session
    await recorder.recordActivity('session', 'Starting AI Recorder integration demo', {
      impact: 'Demonstrating comprehensive development tracking capabilities'
    });

    // 2. Simulate a feature development workflow
    console.log('📝 Simulating feature development workflow...');
    
    await recorder.recordDecision(
      'Implement AI-driven development tracking',
      'Need comprehensive logging for AI transparency and development audit trail',
      [
        'Manual logging',
        'Third-party tracking tools',
        'Git-only tracking'
      ],
      'Improved development transparency and debugging capabilities'
    );

    // 3. Record code analysis
    await recorder.recordActivity('analysis', 'Analyzing existing codebase structure', {
      details: 'Examining React components, build system, and project architecture',
      impact: 'Better understanding of integration points for AI recorder'
    });

    // 4. Simulate performance monitoring
    console.log('⚡ Recording performance metrics...');
    
    // Simulate build time measurement
    const buildStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate build
    const buildTime = Date.now() - buildStart;
    
    await recorder.recordPerformanceMetric('buildTime', buildTime, {
      unit: 'ms',
      context: 'Demo build simulation'
    });

    // 5. Record security considerations
    await recorder.recordSecurityEvent(
      'audit',
      'Reviewed AI recorder for potential security implications',
      'low',
      'No sensitive data logged, all logs stored locally'
    );

    // 6. Demonstrate command execution with recording
    console.log('🔧 Executing commands with recording...');
    
    try {
      const lintOutput = await recorder.runWithRecording(
        'npm run lint -- --max-warnings 0',
        'Running ESLint to check code quality'
      );
      console.log('✅ Lint check completed successfully');
    } catch (error) {
      console.log('⚠️  Lint check had warnings (expected in demo)');
    }

    // 7. Record integration completion
    await recorder.recordActivity('integration', 'AI Recorder integration completed', {
      details: 'Successfully integrated comprehensive development tracking',
      impact: 'Enhanced development transparency and audit capabilities',
      duration: `${Date.now() - recorder.startTime}ms`
    });

    // 8. Generate and display summary
    console.log('\n📊 Generating session summary...');
    await recorder.generateSummary();

    // 9. Display session statistics
    console.log('\n📈 Session Statistics:');
    console.log(`   Activities: ${recorder.session.activities.length}`);
    console.log(`   Code Changes: ${recorder.session.codeChanges.length}`);
    console.log(`   Decisions: ${recorder.session.decisions.length}`);
    console.log(`   Performance Metrics: ${Object.values(recorder.session.performance).flat().length}`);
    console.log(`   Security Events: ${recorder.session.security.vulnerabilities.length + recorder.session.security.fixes.length}`);

    // 10. End the session
    await recorder.endSession();

    console.log('\n✅ AI Recorder Integration Demo Complete!');
    console.log(`📁 Session files saved to: ${recorder.logDir}`);
    console.log(`🔍 View detailed logs: ${recorder.sessionFile}`);
    console.log(`📋 View summary: ${recorder.summaryFile}`);

  } catch (error) {
    console.error('❌ Demo failed:', error);
    await recorder.recordActivity('error', `Demo failed: ${error.message}`, {
      error: error.stack
    });
    await recorder.endSession();
    process.exit(1);
  }
}

// Real-world integration examples
async function showRealWorldExamples() {
  console.log('\n🌟 Real-World Integration Examples:\n');

  console.log('1. Feature Development:');
  console.log('   npm run ai:start');
  console.log('   npm run ai:activity "feature" "Implementing user authentication"');
  console.log('   npm run ai:decision "Use JWT tokens" "Stateless and scalable authentication"');
  console.log('   # ... development work ...');
  console.log('   npm run ai:stop\n');

  console.log('2. Bug Fix Workflow:');
  console.log('   npm run ai:activity "bugfix" "Fixing memory leak in card renderer"');
  console.log('   npm run ai:performance "memoryUsage" "150MB"');
  console.log('   # ... fix implementation ...');
  console.log('   npm run ai:performance "memoryUsage" "95MB"');
  console.log('   npm run test:ai\n');

  console.log('3. Security Update:');
  console.log('   npm run ai:security "vulnerability" "Discovered XSS in search component"');
  console.log('   npm run ai:activity "security" "Implementing input sanitization"');
  console.log('   npm run ai:security "fix" "Added XSS protection to search inputs"');
  console.log('   npm run ai:run "npm audit"\n');

  console.log('4. Performance Optimization:');
  console.log('   npm run ai:activity "optimization" "Optimizing bundle size"');
  console.log('   npm run ai:performance "bundleSize" "5.2MB"');
  console.log('   # ... optimization work ...');
  console.log('   npm run build:ai');
  console.log('   npm run ai:performance "bundleSize" "3.8MB"\n');

  console.log('5. Continuous Integration:');
  console.log('   # In CI/CD pipeline:');
  console.log('   npm run ai:start');
  console.log('   npm run test:ai');
  console.log('   npm run build:ai');
  console.log('   npm run ai:summary');
  console.log('   # Upload ai-logs/ as artifacts\n');
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'demo':
      await demonstrateAIRecorder();
      break;
    
    case 'examples':
      await showRealWorldExamples();
      break;
    
    case 'quick-test':
      console.log('🧪 Running quick AI Recorder test...');
      const recorder = new AIRecorder();
      await recorder.recordActivity('test', 'Quick functionality test');
      await recorder.recordDecision('Test decision', 'Testing decision recording');
      await recorder.recordPerformanceMetric('testMetric', 100);
      await recorder.endSession();
      console.log('✅ Quick test completed successfully!');
      break;
    
    default:
      console.log(`
🤖 KONIVRER AI Recorder Integration Demo

Usage:
  node scripts/ai-integration-demo.js <command>

Commands:
  demo        Run full integration demonstration
  examples    Show real-world usage examples
  quick-test  Run a quick functionality test

Examples:
  node scripts/ai-integration-demo.js demo
  node scripts/ai-integration-demo.js examples
  node scripts/ai-integration-demo.js quick-test
      `);
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}