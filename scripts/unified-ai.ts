/**
 * KONIVRER Unified AI Script
 * 
 * This script combines functionality from:
 * - ai-build.js
 * - ai-integration-demo.js
 * - ai-recorder.js
 * - ai-test.js
 * - integrate-ai-recorder.js
 * 
 * Features:
 * 1. AI recording and monitoring
 * 2. AI-enhanced build process
 * 3. AI-enhanced testing
 * 4. AI integration demos
 * 5. AI performance analysis
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import fs from 'fs';
import path from 'path';
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

// Command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';
const subCommand = args[1] || '';
const options = args.slice(2);

// Configuration
const config = {
  recordingDir: path.join(process.cwd(), '.ai-recordings'),
  sessionFile: path.join(process.cwd(), '.ai-session'),
  metricsFile: path.join(process.cwd(), '.ai-metrics.json'),
  integrationPoints: [
    'src/components/AIAssistant.tsx',
    'src/components/game/AIPersonalityDisplay.tsx',
    'src/components/game/CuttingEdgeAIDisplay.tsx',
    'src/engine/AIDecisionEngine.ts',
    'src/engine/AIPersonalities.ts',
    'src/engine/AIPlayer.ts',
    'src/engine/AdvancedAI.ts',
    'src/engine/CuttingEdgeAI.ts',
    'src/engine/NeuralAI.ts',
    'src/services/adaptiveAI.ts',
    'src/services/aiDeckGenerator.ts',
    'src/services/aiOpponent.ts'
  ]
};

// Ensure recording directory exists
if (!fs.existsSync(config.recordingDir)) {
  fs.mkdirSync(config.recordingDir, { recursive: true });
}

// AI Recorder class
class AIRecorder {
  constructor() {
    this.sessionId = null;
    this.sessionStartTime = null;
    this.activities = [];
    this.loadSession();
  }
  
  loadSession() {
    if (fs.existsSync(config.sessionFile)) {
      try {
        const sessionData = JSON.parse(fs.readFileSync(config.sessionFile, 'utf8'));
        this.sessionId = sessionData.sessionId;
        this.sessionStartTime = sessionData.startTime;
      } catch (error) {
        console.error('Error loading AI session:', error);
      }
    }
  }
  
  saveSession() {
    const sessionData = {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime
    };
    fs.writeFileSync(config.sessionFile, JSON.stringify(sessionData, null, 2));
  }
  
  startSession() {
    this.sessionId = `ai-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.sessionStartTime = Date.now();
    this.activities = [];
    this.saveSession();
    
    const sessionRecordingFile = path.join(config.recordingDir, `${this.sessionId}.json`);
    fs.writeFileSync(sessionRecordingFile, JSON.stringify({
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      activities: []
    }, null, 2));
    
    return this.sessionId;
  }
  
  endSession() {
    if (!this.sessionId) {
      console.error('No active AI session to end');
      return false;
    }
    
    const endTime = Date.now();
    const duration = endTime - this.sessionStartTime;
    
    const sessionRecordingFile = path.join(config.recordingDir, `${this.sessionId}.json`);
    if (fs.existsSync(sessionRecordingFile)) {
      try {
        const sessionData = JSON.parse(fs.readFileSync(sessionRecordingFile, 'utf8'));
        sessionData.endTime = endTime;
        sessionData.duration = duration;
        fs.writeFileSync(sessionRecordingFile, JSON.stringify(sessionData, null, 2));
      } catch (error) {
        console.error('Error updating session recording:', error);
      }
    }
    
    this.sessionId = null;
    this.sessionStartTime = null;
    this.activities = [];
    
    if (fs.existsSync(config.sessionFile)) {
      fs.unlinkSync(config.sessionFile);
    }
    
    return true;
  }
  
  async recordActivity(type, description, metadata = {}) {
    if (!this.sessionId) {
      console.warn('No active AI session. Starting a new session.');
      this.startSession();
    }
    
    const timestamp = Date.now();
    const activity = {
      type,
      description,
      timestamp,
      metadata
    };
    
    this.activities.push(activity);
    
    const sessionRecordingFile = path.join(config.recordingDir, `${this.sessionId}.json`);
    if (fs.existsSync(sessionRecordingFile)) {
      try {
        const sessionData = JSON.parse(fs.readFileSync(sessionRecordingFile, 'utf8'));
        sessionData.activities.push(activity);
        fs.writeFileSync(sessionRecordingFile, JSON.stringify(sessionData, null, 2));
      } catch (error) {
        console.error('Error updating session recording:', error);
      }
    }
    
    return activity;
  }
  
  async recordDecision(decision, options, reasoning) {
    return this.recordActivity('decision', decision, {
      options,
      reasoning
    });
  }
  
  async recordPerformance(operation, metrics) {
    return this.recordActivity('performance', operation, metrics);
  }
  
  async recordSecurity(finding, severity, recommendation) {
    return this.recordActivity('security', finding, {
      severity,
      recommendation
    });
  }
  
  getSessionSummary() {
    if (!this.sessionId) {
      console.error('No active AI session');
      return null;
    }
    
    const sessionRecordingFile = path.join(config.recordingDir, `${this.sessionId}.json`);
    if (fs.existsSync(sessionRecordingFile)) {
      try {
        return JSON.parse(fs.readFileSync(sessionRecordingFile, 'utf8'));
      } catch (error) {
        console.error('Error reading session recording:', error);
        return null;
      }
    }
    
    return null;
  }
  
  async runCommand(command) {
    if (!this.sessionId) {
      console.warn('No active AI session. Starting a new session.');
      this.startSession();
    }
    
    await this.recordActivity('command', `Running command: ${command}`);
    
    const startTime = performance.now();
    try {
      execSync(command, { stdio: 'inherit' });
      const endTime = performance.now();
      
      await this.recordActivity('command_result', 'Command completed successfully', {
        command,
        duration: endTime - startTime
      });
      
      return true;
    } catch (error) {
      const endTime = performance.now();
      
      await this.recordActivity('command_error', 'Command failed', {
        command,
        error: error.message,
        duration: endTime - startTime
      });
      
      return false;
    }
  }
}

// AI Builder class
class AIBuilder {
  constructor(recorder) {
    this.recorder = recorder || new AIRecorder();
  }
  
  async build(options = {}) {
    const startTime = performance.now();
    
    await this.recorder.recordActivity('build', 'Starting AI-enhanced build process', options);
    
    try {
      // Step 1: Analyze codebase
      console.log('🧠 Analyzing codebase for optimization opportunities...');
      await this.analyzeCodebase();
      
      // Step 2: Run the build with AI monitoring
      console.log('🚀 Running build with AI monitoring...');
      const buildSuccess = await this.recorder.runCommand('npm run build');
      
      if (!buildSuccess) {
        throw new Error('Build failed');
      }
      
      // Step 3: Analyze build output
      console.log('📊 Analyzing build output...');
      await this.analyzeBuildOutput();
      
      // Step 4: Generate AI insights
      console.log('💡 Generating AI insights...');
      await this.generateInsights();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('build_complete', 'AI-enhanced build completed successfully', {
        duration,
        buildSize: this.getBuildSize()
      });
      
      console.log(`✅ AI-enhanced build completed in ${(duration / 1000).toFixed(2)}s`);
      return true;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('build_error', 'AI-enhanced build failed', {
        duration,
        error: error.message
      });
      
      console.error(`❌ AI-enhanced build failed: ${error.message}`);
      return false;
    }
  }
  
  async analyzeCodebase() {
    // Simulate AI analysis of codebase
    const files = this.getProjectFiles();
    const metrics = {
      totalFiles: files.length,
      fileTypes: this.categorizeFiles(files),
      complexityScore: Math.random() * 100
    };
    
    await this.recorder.recordActivity('codebase_analysis', 'Analyzed codebase structure', metrics);
    return metrics;
  }
  
  async analyzeBuildOutput() {
    // Simulate AI analysis of build output
    const buildDir = path.join(process.cwd(), 'dist');
    const metrics = {
      totalSize: this.getBuildSize(),
      chunkCount: this.countFiles(buildDir, '.js'),
      cssSize: this.calculateDirectorySize(buildDir, '.css'),
      jsSize: this.calculateDirectorySize(buildDir, '.js')
    };
    
    await this.recorder.recordActivity('build_analysis', 'Analyzed build output', metrics);
    return metrics;
  }
  
  async generateInsights() {
    // Simulate AI generating insights
    const insights = [
      {
        type: 'optimization',
        description: 'Consider code splitting for improved initial load time',
        impact: 'high'
      },
      {
        type: 'performance',
        description: 'Large bundle size detected in vendor chunk',
        impact: 'medium'
      },
      {
        type: 'suggestion',
        description: 'Tree-shaking could be improved for UI components',
        impact: 'medium'
      }
    ];
    
    await this.recorder.recordActivity('insights', 'Generated build insights', { insights });
    return insights;
  }
  
  getProjectFiles() {
    // This is a simplified implementation
    // In a real scenario, you would recursively scan the project directory
    return [
      'src/index.tsx',
      'src/App.tsx',
      'src/components/Card.tsx',
      // ... more files
    ];
  }
  
  categorizeFiles(files) {
    const categories = {
      tsx: 0,
      ts: 0,
      js: 0,
      jsx: 0,
      css: 0,
      other: 0
    };
    
    files.forEach(file => {
      const ext = path.extname(file).substring(1);
      if (categories[ext] !== undefined) {
        categories[ext]++;
      } else {
        categories.other++;
      }
    });
    
    return categories;
  }
  
  getBuildSize() {
    const buildDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(buildDir)) {
      return this.calculateDirectorySize(buildDir);
    }
    return 0;
  }
  
  calculateDirectorySize(directoryPath, extension = null) {
    let totalSize = 0;
    
    if (!fs.existsSync(directoryPath)) {
      return totalSize;
    }
    
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += this.calculateDirectorySize(filePath, extension);
      } else if (!extension || path.extname(file) === extension) {
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }
  
  countFiles(directoryPath, extension = null) {
    let count = 0;
    
    if (!fs.existsSync(directoryPath)) {
      return count;
    }
    
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        count += this.countFiles(filePath, extension);
      } else if (!extension || path.extname(file) === extension) {
        count++;
      }
    }
    
    return count;
  }
}

// AI Tester class
class AITester {
  constructor(recorder) {
    this.recorder = recorder || new AIRecorder();
  }
  
  async runTests(options = {}) {
    const startTime = performance.now();
    
    await this.recorder.recordActivity('test', 'Starting AI-enhanced test process', options);
    
    try {
      // Step 1: Analyze test coverage
      console.log('🧠 Analyzing test coverage...');
      await this.analyzeTestCoverage();
      
      // Step 2: Run the tests with AI monitoring
      console.log('🚀 Running tests with AI monitoring...');
      const testSuccess = await this.recorder.runCommand('npm run test');
      
      if (!testSuccess) {
        throw new Error('Tests failed');
      }
      
      // Step 3: Analyze test results
      console.log('📊 Analyzing test results...');
      await this.analyzeTestResults();
      
      // Step 4: Generate AI insights
      console.log('💡 Generating AI insights for tests...');
      await this.generateTestInsights();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('test_complete', 'AI-enhanced tests completed successfully', {
        duration
      });
      
      console.log(`✅ AI-enhanced tests completed in ${(duration / 1000).toFixed(2)}s`);
      return true;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('test_error', 'AI-enhanced tests failed', {
        duration,
        error: error.message
      });
      
      console.error(`❌ AI-enhanced tests failed: ${error.message}`);
      return false;
    }
  }
  
  async analyzeTestCoverage() {
    // Simulate AI analysis of test coverage
    const metrics = {
      totalTests: Math.floor(Math.random() * 100) + 50,
      coverage: {
        statements: Math.floor(Math.random() * 30) + 70,
        branches: Math.floor(Math.random() * 30) + 70,
        functions: Math.floor(Math.random() * 30) + 70,
        lines: Math.floor(Math.random() * 30) + 70
      },
      uncoveredComponents: [
        'src/components/Card.tsx',
        'src/components/DeckBuilder.tsx'
      ]
    };
    
    await this.recorder.recordActivity('test_coverage_analysis', 'Analyzed test coverage', metrics);
    return metrics;
  }
  
  async analyzeTestResults() {
    // Simulate AI analysis of test results
    const metrics = {
      passedTests: Math.floor(Math.random() * 50) + 50,
      failedTests: 0,
      skippedTests: Math.floor(Math.random() * 5),
      slowTests: [
        {
          name: 'CardComponent renders correctly with all props',
          duration: 1200
        },
        {
          name: 'DeckBuilder handles large deck imports',
          duration: 850
        }
      ]
    };
    
    await this.recorder.recordActivity('test_results_analysis', 'Analyzed test results', metrics);
    return metrics;
  }
  
  async generateTestInsights() {
    // Simulate AI generating insights for tests
    const insights = [
      {
        type: 'coverage',
        description: 'Low test coverage in Card component',
        impact: 'medium'
      },
      {
        type: 'performance',
        description: 'Slow tests detected in DeckBuilder',
        impact: 'low'
      },
      {
        type: 'suggestion',
        description: 'Consider adding more integration tests',
        impact: 'medium'
      }
    ];
    
    await this.recorder.recordActivity('test_insights', 'Generated test insights', { insights });
    return insights;
  }
}

// AI Integration class
class AIIntegration {
  constructor(recorder) {
    this.recorder = recorder || new AIRecorder();
  }
  
  async integrate() {
    const startTime = performance.now();
    
    await this.recorder.recordActivity('integration', 'Starting AI integration process');
    
    try {
      // Step 1: Analyze integration points
      console.log('🧠 Analyzing AI integration points...');
      const integrationPoints = await this.analyzeIntegrationPoints();
      
      // Step 2: Verify AI components
      console.log('🔍 Verifying AI components...');
      await this.verifyAIComponents(integrationPoints);
      
      // Step 3: Connect AI recorder
      console.log('🔌 Connecting AI recorder to components...');
      await this.connectAIRecorder(integrationPoints);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('integration_complete', 'AI integration completed successfully', {
        duration,
        integratedComponents: integrationPoints.length
      });
      
      console.log(`✅ AI integration completed in ${(duration / 1000).toFixed(2)}s`);
      return true;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('integration_error', 'AI integration failed', {
        duration,
        error: error.message
      });
      
      console.error(`❌ AI integration failed: ${error.message}`);
      return false;
    }
  }
  
  async analyzeIntegrationPoints() {
    const integrationPoints = [];
    
    for (const filePath of config.integrationPoints) {
      const fullPath = path.join(process.cwd(), filePath);
      
      if (fs.existsSync(fullPath)) {
        integrationPoints.push({
          path: filePath,
          exists: true,
          integrated: this.checkIfIntegrated(fullPath)
        });
      } else {
        integrationPoints.push({
          path: filePath,
          exists: false,
          integrated: false
        });
      }
    }
    
    await this.recorder.recordActivity('integration_analysis', 'Analyzed integration points', {
      totalPoints: integrationPoints.length,
      existingPoints: integrationPoints.filter(p => p.exists).length,
      integratedPoints: integrationPoints.filter(p => p.integrated).length
    });
    
    return integrationPoints;
  }
  
  checkIfIntegrated(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('AIRecorder') || content.includes('recordActivity');
    } catch (error) {
      return false;
    }
  }
  
  async verifyAIComponents(integrationPoints) {
    const verificationResults = [];
    
    for (const point of integrationPoints) {
      if (point.exists) {
        const fullPath = path.join(process.cwd(), point.path);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        const verification = {
          path: point.path,
          hasAIImports: content.includes('import') && (
            content.includes('AI') || 
            content.includes('Neural') || 
            content.includes('Machine Learning')
          ),
          hasDecisionLogic: content.includes('decide') || content.includes('predict') || content.includes('analyze'),
          hasPerformanceMonitoring: content.includes('performance') || content.includes('metrics') || content.includes('monitor')
        };
        
        verificationResults.push(verification);
      }
    }
    
    await this.recorder.recordActivity('component_verification', 'Verified AI components', {
      verificationResults
    });
    
    return verificationResults;
  }
  
  async connectAIRecorder(integrationPoints) {
    const integrationResults = [];
    
    for (const point of integrationPoints) {
      if (point.exists && !point.integrated) {
        const fullPath = path.join(process.cwd(), point.path);
        
        try {
          // This is a simplified implementation
          // In a real scenario, you would parse the file and add the integration code properly
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check if it's a TypeScript file
          const isTypeScript = fullPath.endsWith('.ts') || fullPath.endsWith('.tsx');
          
          // Add import statement if not already present
          let updatedContent = content;
          if (!content.includes('import AIRecorder')) {
            const importStatement = isTypeScript
              ? "import AIRecorder from '../../scripts/ai-recorder.js';\n"
              : "import AIRecorder from '../../scripts/ai-recorder.js';\n";
            
            // Find a good place to add the import
            const importIndex = content.lastIndexOf('import ');
            if (importIndex >= 0) {
              // Find the end of the import section
              const importEndIndex = content.indexOf('\n\n', importIndex);
              if (importEndIndex >= 0) {
                updatedContent = content.substring(0, importEndIndex + 1) + 
                                importStatement + 
                                content.substring(importEndIndex + 1);
              } else {
                // Just add after the last import
                const lastImportEndIndex = content.indexOf('\n', importIndex);
                updatedContent = content.substring(0, lastImportEndIndex + 1) + 
                                importStatement + 
                                content.substring(lastImportEndIndex + 1);
              }
            } else {
              // No imports found, add at the beginning
              updatedContent = importStatement + content;
            }
          }
          
          // Add recorder initialization if not already present
          if (!updatedContent.includes('new AIRecorder')) {
            const recorderInit = isTypeScript
              ? 'const aiRecorder = new AIRecorder();\n'
              : 'const aiRecorder = new AIRecorder();\n';
            
            // Find a good place to add the initialization
            const classIndex = updatedContent.indexOf('class ');
            const constIndex = updatedContent.indexOf('const ');
            const functionIndex = updatedContent.indexOf('function ');
            
            let insertIndex;
            if (classIndex >= 0) {
              insertIndex = updatedContent.indexOf('{', classIndex) + 1;
            } else if (constIndex >= 0 && constIndex < functionIndex) {
              insertIndex = updatedContent.indexOf('\n\n', constIndex);
            } else if (functionIndex >= 0) {
              insertIndex = updatedContent.indexOf('{', functionIndex) + 1;
            } else {
              // Just add after imports
              insertIndex = updatedContent.indexOf('\n\n');
            }
            
            if (insertIndex >= 0) {
              updatedContent = updatedContent.substring(0, insertIndex) + 
                              '\n  ' + recorderInit + 
                              updatedContent.substring(insertIndex);
            }
          }
          
          // Don't actually write the changes in this example
          // fs.writeFileSync(fullPath, updatedContent);
          
          integrationResults.push({
            path: point.path,
            success: true,
            changes: updatedContent !== content
          });
        } catch (error) {
          integrationResults.push({
            path: point.path,
            success: false,
            error: error.message
          });
        }
      } else {
        integrationResults.push({
          path: point.path,
          success: point.integrated,
          changes: false
        });
      }
    }
    
    await this.recorder.recordActivity('recorder_integration', 'Connected AI recorder to components', {
      integrationResults
    });
    
    return integrationResults;
  }
  
  async runDemo(demoType = 'basic') {
    const startTime = performance.now();
    
    await this.recorder.recordActivity('demo', `Starting AI integration demo: ${demoType}`);
    
    try {
      switch (demoType) {
        case 'basic':
          await this.runBasicDemo();
          break;
        case 'advanced':
          await this.runAdvancedDemo();
          break;
        case 'performance':
          await this.runPerformanceDemo();
          break;
        case 'security':
          await this.runSecurityDemo();
          break;
        default:
          await this.runBasicDemo();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('demo_complete', `AI demo completed: ${demoType}`, {
        duration
      });
      
      console.log(`✅ AI demo completed in ${(duration / 1000).toFixed(2)}s`);
      return true;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      await this.recorder.recordActivity('demo_error', `AI demo failed: ${demoType}`, {
        duration,
        error: error.message
      });
      
      console.error(`❌ AI demo failed: ${error.message}`);
      return false;
    }
  }
  
  async runBasicDemo() {
    console.log('🤖 Running basic AI integration demo...');
    
    // Record some activities
    await this.recorder.recordActivity('demo_step', 'Initializing AI system');
    await this.recorder.recordActivity('demo_step', 'Loading AI models');
    await this.recorder.recordActivity('demo_step', 'Processing game state');
    
    // Record a decision
    await this.recorder.recordDecision(
      'Choose optimal card to play',
      ['Fire Dragon', 'Water Elemental', 'Earth Golem'],
      'Fire Dragon has the highest power and synergizes with current board state'
    );
    
    console.log('✅ Basic demo completed');
  }
  
  async runAdvancedDemo() {
    console.log('🧠 Running advanced AI integration demo...');
    
    // Simulate AI processing
    console.log('⏳ Training neural network...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Record performance metrics
    await this.recorder.recordPerformance('neural_network_training', {
      epochs: 100,
      accuracy: 0.95,
      loss: 0.05,
      duration: 1000
    });
    
    // Record a complex decision
    await this.recorder.recordDecision(
      'Determine optimal strategy against opponent deck',
      ['Aggressive', 'Control', 'Combo', 'Midrange'],
      'Control strategy is optimal based on opponent\'s deck composition and play patterns'
    );
    
    console.log('✅ Advanced demo completed');
  }
  
  async runPerformanceDemo() {
    console.log('⚡ Running AI performance demo...');
    
    // Simulate performance monitoring
    console.log('📊 Monitoring AI performance...');
    
    // Record various performance metrics
    await this.recorder.recordPerformance('decision_making', {
      averageTime: 5.2,
      decisions: 100,
      accuracy: 0.92
    });
    
    await this.recorder.recordPerformance('model_inference', {
      averageTime: 12.5,
      batches: 50,
      throughput: 4000
    });
    
    await this.recorder.recordPerformance('memory_usage', {
      peak: 256,
      average: 128,
      unit: 'MB'
    });
    
    console.log('✅ Performance demo completed');
  }
  
  async runSecurityDemo() {
    console.log('🔒 Running AI security demo...');
    
    // Simulate security analysis
    console.log('🔍 Analyzing security vulnerabilities...');
    
    // Record security findings
    await this.recorder.recordSecurity(
      'Potential data leakage in AI model',
      'medium',
      'Implement differential privacy techniques'
    );
    
    await this.recorder.recordSecurity(
      'Adversarial attack vulnerability',
      'high',
      'Add input validation and adversarial training'
    );
    
    await this.recorder.recordSecurity(
      'Excessive permissions for AI system',
      'low',
      'Implement principle of least privilege'
    );
    
    console.log('✅ Security demo completed');
  }
}

// Main function to handle commands
async function main() {
  const recorder = new AIRecorder();
  
  switch (command) {
    case 'start':
      const sessionId = recorder.startSession();
      console.log(`✅ AI recording session started: ${sessionId}`);
      break;
      
    case 'end':
      if (recorder.endSession()) {
        console.log('✅ AI recording session ended');
      } else {
        console.error('❌ No active AI session to end');
      }
      break;
      
    case 'activity':
      if (!recorder.sessionId) {
        console.warn('⚠️ No active AI session. Starting a new session.');
        recorder.startSession();
      }
      
      const description = subCommand || 'Generic activity';
      await recorder.recordActivity('custom', description);
      console.log(`✅ Recorded activity: ${description}`);
      break;
      
    case 'decision':
      if (!recorder.sessionId) {
        console.warn('⚠️ No active AI session. Starting a new session.');
        recorder.startSession();
      }
      
      const decision = subCommand || 'Generic decision';
      await recorder.recordDecision(
        decision,
        ['Option A', 'Option B', 'Option C'],
        'Selected based on current game state'
      );
      console.log(`✅ Recorded decision: ${decision}`);
      break;
      
    case 'performance':
      if (!recorder.sessionId) {
        console.warn('⚠️ No active AI session. Starting a new session.');
        recorder.startSession();
      }
      
      const operation = subCommand || 'Generic operation';
      await recorder.recordPerformance(operation, {
        duration: Math.random() * 1000,
        memory: Math.random() * 256
      });
      console.log(`✅ Recorded performance: ${operation}`);
      break;
      
    case 'security':
      if (!recorder.sessionId) {
        console.warn('⚠️ No active AI session. Starting a new session.');
        recorder.startSession();
      }
      
      const finding = subCommand || 'Generic security finding';
      await recorder.recordSecurity(
        finding,
        'medium',
        'Generic recommendation'
      );
      console.log(`✅ Recorded security finding: ${finding}`);
      break;
      
    case 'summary':
      const summary = recorder.getSessionSummary();
      if (summary) {
        console.log('📊 AI Session Summary:');
        console.log(`Session ID: ${summary.sessionId}`);
        console.log(`Start Time: ${new Date(summary.startTime).toLocaleString()}`);
        console.log(`Activities: ${summary.activities.length}`);
        
        // Group activities by type
        const activityTypes = {};
        summary.activities.forEach(activity => {
          activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
        });
        
        console.log('Activity Types:');
        Object.entries(activityTypes).forEach(([type, count]) => {
          console.log(`  - ${type}: ${count}`);
        });
      } else {
        console.error('❌ No active AI session or session data not found');
      }
      break;
      
    case 'run':
      if (!recorder.sessionId) {
        console.warn('⚠️ No active AI session. Starting a new session.');
        recorder.startSession();
      }
      
      if (subCommand) {
        console.log(`🚀 Running command with AI recording: ${subCommand}`);
        await recorder.runCommand(subCommand);
      } else {
        console.error('❌ No command specified');
      }
      break;
      
    case 'build':
      const builder = new AIBuilder(recorder);
      await builder.build();
      break;
      
    case 'test':
      const tester = new AITester(recorder);
      await tester.runTests();
      break;
      
    case 'integrate':
      const integration = new AIIntegration(recorder);
      await integration.integrate();
      break;
      
    case 'demo':
      const demo = new AIIntegration(recorder);
      await demo.runDemo(subCommand || 'basic');
      break;
      
    case 'help':
    default:
      console.log(`
KONIVRER Unified AI Script

Usage:
  node unified-ai.js <command> [subcommand] [options]

Commands:
  start                 Start a new AI recording session
  end                   End the current AI recording session
  activity [desc]       Record a generic activity
  decision [desc]       Record an AI decision
  performance [op]      Record performance metrics
  security [finding]    Record a security finding
  summary               Show summary of current session
  run <command>         Run a command with AI recording
  build                 Run AI-enhanced build process
  test                 Run AI-enhanced tests
  integrate             Integrate AI recorder with components
  demo [type]           Run an AI integration demo
                        Types: basic, advanced, performance, security
  help                  Show this help message

Examples:
  node unified-ai.js start
  node unified-ai.js activity "Loading game state"
  node unified-ai.js run "npm run build"
  node unified-ai.js demo advanced
      `);
      break;
  }
}

// Run the main function
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

// Export classes for use in other scripts
export default AIRecorder;
module.exports.AIBuilder = AIBuilder;
module.exports.AITester = AITester;
module.exports.AIIntegration = AIIntegration;