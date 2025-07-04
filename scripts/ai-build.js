#!/usr/bin/env node

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
      duration: `${buildTime}ms`,
      impact: 'Production-ready application bundle created'
    });
    
    await recorder.endSession();
    console.log('🎉 AI-enhanced build completed!');
    
  } catch (error) {
    await recorder.recordActivity('error', `Build failed: ${error.message}`);
    await recorder.endSession();
    throw error;
  }
}

aiBuild().catch(console.error);
