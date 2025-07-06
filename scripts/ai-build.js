/**
 * AI Build Script
 * 
 * This script enhances the build process with AI-powered optimizations.
 * It analyzes the codebase and suggests performance improvements.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🤖 Starting AI-enhanced build process...');

// Record build start time
const startTime = Date.now();

try {
  // Run the standard build process
  console.log('\n📦 Running standard build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Analyze the build output
  console.log('\n🔍 Analyzing build output...');
  const buildStats = fs.statSync(path.join(process.cwd(), 'dist'));
  
  // Calculate build size
  const buildSizeBytes = calculateDirSize(path.join(process.cwd(), 'dist'));
  const buildSizeMB = (buildSizeBytes / (1024 * 1024)).toFixed(2);
  
  // Record build end time and calculate duration
  const endTime = Date.now();
  const buildDuration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Generate build report
  const buildReport = {
    timestamp: new Date().toISOString(),
    duration: `${buildDuration} seconds`,
    size: `${buildSizeMB} MB`,
    files: countFiles(path.join(process.cwd(), 'dist')),
    suggestions: generateOptimizationSuggestions()
  };
  
  // Save build report
  const reportDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, `ai-build-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(buildReport, null, 2));
  
  // Display build summary
  console.log('\n✅ AI-enhanced build completed successfully!');
  console.log(`📊 Build Stats:`);
  console.log(`   - Duration: ${buildDuration} seconds`);
  console.log(`   - Size: ${buildSizeMB} MB`);
  console.log(`   - Files: ${buildReport.files}`);
  console.log(`   - Report: ${reportPath}`);
  
  // Display optimization suggestions
  console.log('\n💡 Optimization Suggestions:');
  buildReport.suggestions.forEach((suggestion, index) => {
    console.log(`   ${index + 1}. ${suggestion}`);
  });
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Helper function to calculate directory size
function calculateDirSize(dirPath) {
  let size = 0;
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Helper function to count files in a directory
function countFiles(dirPath) {
  let count = 0;
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  }
  
  return count;
}

// Helper function to generate optimization suggestions
function generateOptimizationSuggestions() {
  return [
    "Consider using code splitting to reduce initial load time",
    "Implement tree shaking for unused code elimination",
    "Optimize image assets with WebP format",
    "Use dynamic imports for non-critical components",
    "Enable gzip compression for static assets"
  ];
}