#!/usr/bin/env node

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
    const testResults = output.match(/Tests:\s+(\d+)\s+passed/);
    if (testResults) {
      const passedTests = parseInt(testResults[1]);
      await recorder.recordPerformanceMetric('testsPass', passedTests, { unit: 'count' });
    }
    
    await recorder.recordActivity('testing', 'Test suite completed successfully', {
      duration: `${testTime}ms`,
      impact: 'Verified application functionality and quality'
    });
    
    await recorder.endSession();
    console.log('🎉 AI-enhanced testing completed!');
    
  } catch (error) {
    await recorder.recordActivity('error', `Tests failed: ${error.message}`);
    await recorder.endSession();
    throw error;
  }
}

aiTest().catch(console.error);
