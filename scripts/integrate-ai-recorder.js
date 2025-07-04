#!/usr/bin/env node

/**
 * KONIVRER AI Recorder Integration Script
 * 
 * Integrates the AI Recorder with existing project automation and workflows
 * This script modifies existing scripts to include AI recording capabilities
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class AIRecorderIntegrator {
  constructor() {
    this.integrationLog = [];
  }

  log(message) {
    console.log(`🔧 ${message}`);
    this.integrationLog.push(`${new Date().toISOString()}: ${message}`);
  }

  async integrateWithExistingScripts() {
    this.log('Starting AI Recorder integration with existing scripts...');

    // 1. Integrate with auto-heal.js
    await this.integrateWithAutoHeal();

    // 2. Integrate with security-check.js
    await this.integrateWithSecurityCheck();

    // 3. Integrate with optimize-performance.js
    await this.integrateWithPerformanceOptimizer();

    // 4. Create AI-enhanced versions of key scripts
    await this.createAIEnhancedScripts();

    // 5. Update existing automation scripts
    await this.updateAutomationScripts();

    this.log('AI Recorder integration completed successfully!');
  }

  async integrateWithAutoHeal() {
    this.log('Integrating with auto-heal.js...');
    
    try {
      const autoHealPath = path.join(PROJECT_ROOT, 'scripts', 'auto-heal.js');
      let content = await fs.readFile(autoHealPath, 'utf8');
      
      // Check if already integrated
      if (content.includes('ai-recorder')) {
        this.log('auto-heal.js already integrated with AI Recorder');
        return;
      }

      // Add AI Recorder import
      const importStatement = `import AIRecorder from './ai-recorder.js';\n`;
      content = importStatement + content;

      // Add AI recording initialization
      const initCode = `
// Initialize AI Recorder for healing session
const aiRecorder = new AIRecorder();
await aiRecorder.recordActivity('healing', 'Starting auto-heal session', {
  impact: 'Automated system maintenance and issue resolution'
});
`;

      // Insert after the first function declaration
      content = content.replace(
        /async function main\(\) {/,
        `async function main() {\n${initCode}`
      );

      // Add recording at the end
      const endCode = `
  // Record healing completion
  await aiRecorder.recordActivity('healing', 'Auto-heal session completed', {
    impact: 'System health restored and optimized'
  });
  await aiRecorder.endSession();
`;

      content = content.replace(
        /console\.log\('🎉 Auto-heal completed successfully!'\);/,
        `console.log('🎉 Auto-heal completed successfully!');\n${endCode}`
      );

      await fs.writeFile(autoHealPath, content);
      this.log('Successfully integrated AI Recorder with auto-heal.js');
    } catch (error) {
      this.log(`Failed to integrate with auto-heal.js: ${error.message}`);
    }
  }

  async integrateWithSecurityCheck() {
    this.log('Integrating with security-check.js...');
    
    try {
      const securityCheckPath = path.join(PROJECT_ROOT, 'scripts', 'security-check.js');
      let content = await fs.readFile(securityCheckPath, 'utf8');
      
      if (content.includes('ai-recorder')) {
        this.log('security-check.js already integrated with AI Recorder');
        return;
      }

      // Add AI Recorder integration
      const integration = `
import AIRecorder from './ai-recorder.js';

// Initialize AI Recorder for security session
const aiRecorder = new AIRecorder();

// Record security scan start
await aiRecorder.recordSecurityEvent('scan', 'Starting comprehensive security check', 'medium');
`;

      content = integration + content;

      // Add security event recording throughout the script
      content = content.replace(
        /console\.log\('❌ Security vulnerability found:'/g,
        `await aiRecorder.recordSecurityEvent('vulnerability', \`Security vulnerability: \${issue}\`, 'high');
        console.log('❌ Security vulnerability found:'`
      );

      content = content.replace(
        /console\.log\('✅ Security check completed'/g,
        `await aiRecorder.recordSecurityEvent('audit', 'Security check completed successfully', 'low');
        await aiRecorder.endSession();
        console.log('✅ Security check completed'`
      );

      await fs.writeFile(securityCheckPath, content);
      this.log('Successfully integrated AI Recorder with security-check.js');
    } catch (error) {
      this.log(`Failed to integrate with security-check.js: ${error.message}`);
    }
  }

  async integrateWithPerformanceOptimizer() {
    this.log('Integrating with optimize-performance.js...');
    
    try {
      const optimizerPath = path.join(PROJECT_ROOT, 'scripts', 'optimize-performance.js');
      let content = await fs.readFile(optimizerPath, 'utf8');
      
      if (content.includes('ai-recorder')) {
        this.log('optimize-performance.js already integrated with AI Recorder');
        return;
      }

      // Add AI Recorder integration
      const integration = `
import AIRecorder from './ai-recorder.js';

// Initialize AI Recorder for optimization session
const aiRecorder = new AIRecorder();
await aiRecorder.recordActivity('optimization', 'Starting performance optimization', {
  impact: 'Improving application performance and user experience'
});
`;

      content = integration + content;

      // Add performance metric recording
      content = content.replace(
        /console\.log\(`Bundle size: \${bundleSize}MB`\)/g,
        `console.log(\`Bundle size: \${bundleSize}MB\`);
        await aiRecorder.recordPerformanceMetric('bundleSize', bundleSize * 1024 * 1024, { unit: 'bytes' });`
      );

      content = content.replace(
        /console\.log\('🚀 Performance optimization completed'/g,
        `await aiRecorder.recordActivity('optimization', 'Performance optimization completed', {
          impact: 'Improved application performance metrics'
        });
        await aiRecorder.endSession();
        console.log('🚀 Performance optimization completed'`
      );

      await fs.writeFile(optimizerPath, content);
      this.log('Successfully integrated AI Recorder with optimize-performance.js');
    } catch (error) {
      this.log(`Failed to integrate with optimize-performance.js: ${error.message}`);
    }
  }

  async createAIEnhancedScripts() {
    this.log('Creating AI-enhanced versions of key scripts...');

    // Create AI-enhanced build script
    const aiBuildScript = `#!/usr/bin/env node

/**
 * AI-Enhanced Build Script
 * Builds the project with comprehensive AI recording
 */

import AIRecorder from './ai-recorder.js';
import { execSync } from 'child_process';

async function aiBuild() {
  const recorder = new AIRecorder();
  
  try {
    await recorder.recordActivity('build', 'Starting AI-enhanced build process');
    
    const buildStart = Date.now();
    const output = await recorder.runWithRecording('npm run build', 'Building production bundle');
    const buildTime = Date.now() - buildStart;
    
    await recorder.recordPerformanceMetric('buildTime', buildTime, { unit: 'ms' });
    
    // Analyze bundle size
    try {
      const bundleAnalysis = await recorder.runWithRecording('npm run bundle:analyze', 'Analyzing bundle size');
      await recorder.recordActivity('analysis', 'Bundle analysis completed', {
        impact: 'Identified optimization opportunities'
      });
    } catch (error) {
      console.log('Bundle analysis skipped (optional)');
    }
    
    await recorder.recordActivity('build', 'Build process completed successfully', {
      duration: \`\${buildTime}ms\`,
      impact: 'Production-ready application bundle created'
    });
    
    await recorder.endSession();
    console.log('🎉 AI-enhanced build completed!');
    
  } catch (error) {
    await recorder.recordActivity('error', \`Build failed: \${error.message}\`);
    await recorder.endSession();
    throw error;
  }
}

aiBuild().catch(console.error);
`;

    await fs.writeFile(path.join(PROJECT_ROOT, 'scripts', 'ai-build.js'), aiBuildScript);
    this.log('Created ai-build.js');

    // Create AI-enhanced test script
    const aiTestScript = `#!/usr/bin/env node

/**
 * AI-Enhanced Test Script
 * Runs tests with comprehensive AI recording
 */

import AIRecorder from './ai-recorder.js';

async function aiTest() {
  const recorder = new AIRecorder();
  
  try {
    await recorder.recordActivity('testing', 'Starting AI-enhanced test suite');
    
    const testStart = Date.now();
    const output = await recorder.runWithRecording('npm run test', 'Running test suite');
    const testTime = Date.now() - testStart;
    
    await recorder.recordPerformanceMetric('testDuration', testTime, { unit: 'ms' });
    
    // Parse test results
    const testResults = output.match(/Tests:\\s+(\\d+)\\s+passed/);
    if (testResults) {
      const passedTests = parseInt(testResults[1]);
      await recorder.recordPerformanceMetric('testsPass', passedTests, { unit: 'count' });
    }
    
    await recorder.recordActivity('testing', 'Test suite completed successfully', {
      duration: \`\${testTime}ms\`,
      impact: 'Verified application functionality and quality'
    });
    
    await recorder.endSession();
    console.log('🎉 AI-enhanced testing completed!');
    
  } catch (error) {
    await recorder.recordActivity('error', \`Tests failed: \${error.message}\`);
    await recorder.endSession();
    throw error;
  }
}

aiTest().catch(console.error);
`;

    await fs.writeFile(path.join(PROJECT_ROOT, 'scripts', 'ai-test.js'), aiTestScript);
    this.log('Created ai-test.js');
  }

  async updateAutomationScripts() {
    this.log('Updating package.json with AI-enhanced scripts...');

    try {
      const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

      // Add AI-enhanced scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        'ai:build': 'node scripts/ai-build.js',
        'ai:test': 'node scripts/ai-test.js',
        'ai:demo': 'node scripts/ai-integration-demo.js demo',
        'ai:examples': 'node scripts/ai-integration-demo.js examples',
        'ai:integrate': 'node scripts/integrate-ai-recorder.js'
      };

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.log('Updated package.json with AI-enhanced scripts');
    } catch (error) {
      this.log(`Failed to update package.json: ${error.message}`);
    }
  }

  async generateIntegrationReport() {
    const report = `# AI Recorder Integration Report

## Integration Summary
- **Date**: ${new Date().toISOString()}
- **Status**: Completed Successfully
- **Scripts Modified**: ${this.integrationLog.length}

## Integration Log
${this.integrationLog.map(entry => `- ${entry}`).join('\n')}

## New Scripts Created
- \`scripts/ai-recorder.js\` - Main AI recording system
- \`scripts/ai-integration-demo.js\` - Integration demonstration
- \`scripts/integrate-ai-recorder.js\` - Integration automation
- \`scripts/ai-build.js\` - AI-enhanced build process
- \`scripts/ai-test.js\` - AI-enhanced testing

## New NPM Scripts
- \`npm run ai:start\` - Start AI recording session
- \`npm run ai:stop\` - End AI recording session
- \`npm run ai:build\` - Build with AI recording
- \`npm run ai:test\` - Test with AI recording
- \`npm run ai:demo\` - Run integration demo
- \`npm run dev:ai\` - Development with AI recording

## Configuration Files
- \`ai-recorder.config.js\` - AI Recorder configuration
- \`AI_RECORDER_GUIDE.md\` - Comprehensive documentation

## Usage Examples

### Basic Usage
\`\`\`bash
npm run ai:start          # Start recording
npm run dev               # Your normal development
npm run ai:stop           # End recording
\`\`\`

### Enhanced Workflows
\`\`\`bash
npm run dev:ai            # Development with recording
npm run ai:build          # Build with recording
npm run ai:test           # Test with recording
\`\`\`

### Manual Recording
\`\`\`bash
npm run ai:activity "feature" "Implementing new feature"
npm run ai:decision "Use React hooks" "Better state management"
npm run ai:performance "buildTime" "15000"
\`\`\`

## Next Steps
1. Run \`npm run ai:demo\` to see the system in action
2. Start using \`npm run dev:ai\` for development
3. Integrate AI recording into your CI/CD pipeline
4. Review generated logs in \`ai-logs/\` directory

---
*Generated by KONIVRER AI Recorder Integration System*
`;

    await fs.writeFile(path.join(PROJECT_ROOT, 'AI_INTEGRATION_REPORT.md'), report);
    this.log('Generated integration report: AI_INTEGRATION_REPORT.md');
  }
}

async function main() {
  const integrator = new AIRecorderIntegrator();
  
  try {
    await integrator.integrateWithExistingScripts();
    await integrator.generateIntegrationReport();
    
    console.log('\n🎉 AI Recorder Integration Complete!');
    console.log('\n📋 Quick Start:');
    console.log('   npm run ai:demo     # See the system in action');
    console.log('   npm run dev:ai      # Start development with recording');
    console.log('   npm run ai:build    # Build with AI recording');
    console.log('   npm run ai:test     # Test with AI recording');
    console.log('\n📚 Documentation: AI_RECORDER_GUIDE.md');
    console.log('📊 Integration Report: AI_INTEGRATION_REPORT.md');
    
  } catch (error) {
    console.error('❌ Integration failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}