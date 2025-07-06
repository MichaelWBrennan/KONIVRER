/**
 * Enterprise Automation Script
 * 
 * This script provides automated workflows for security, performance, and quality checks.
 * It can be run with different flags to focus on specific aspects of the application.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const config = {
  securityChecks: true,
  performanceChecks: true,
  qualityChecks: true,
  generateReport: true
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--security-only')) {
  config.securityChecks = true;
  config.performanceChecks = false;
  config.qualityChecks = false;
}

if (args.includes('--performance-only')) {
  config.securityChecks = false;
  config.performanceChecks = true;
  config.qualityChecks = false;
}

if (args.includes('--quality-only')) {
  config.securityChecks = false;
  config.performanceChecks = false;
  config.qualityChecks = true;
}

if (args.includes('--no-report')) {
  config.generateReport = false;
}

// Main function
async function runAutomation() {
  console.log('Starting Enterprise Automation...');
  
  const results: Record<string, any> = {};
  
  // Security checks
  if (config.securityChecks) {
    console.log('\n🔒 Running Security Checks...');
    try {
      execSync('npm run security:full', { stdio: 'inherit' });
      results.security = { status: 'success' };
    } catch (error) {
      console.error('Security checks failed:', error);
      results.security = { status: 'failed', error };
    }
  }
  
  // Performance checks
  if (config.performanceChecks) {
    console.log('\n⚡ Running Performance Checks...');
    try {
      execSync('npm run performance:optimize', { stdio: 'inherit' });
      results.performance = { status: 'success' };
    } catch (error) {
      console.error('Performance checks failed:', error);
      results.performance = { status: 'failed', error };
    }
  }
  
  // Quality checks
  if (config.qualityChecks) {
    console.log('\n✅ Running Quality Checks...');
    try {
      execSync('npm run lint', { stdio: 'inherit' });
      execSync('npm run format:check', { stdio: 'inherit' });
      results.quality = { status: 'success' };
    } catch (error) {
      console.error('Quality checks failed:', error);
      results.quality = { status: 'failed', error };
    }
  }
  
  // Generate report
  if (config.generateReport) {
    console.log('\n📊 Generating Report...');
    const reportPath = path.join(process.cwd(), 'automation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`Report saved to ${reportPath}`);
  }
  
  console.log('\n✨ Enterprise Automation Complete!');
}

// Run if called directly
if (require.main === module) {
  runAutomation().catch(error => {
    console.error('Automation failed:', error);
    process.exit(1);
  });
}

export default runAutomation;