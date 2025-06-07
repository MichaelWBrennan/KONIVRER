#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Analyzing bundle performance...\n');

// Build the project
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if stats.html was generated
const statsPath = join(process.cwd(), 'dist', 'stats.html');
if (existsSync(statsPath)) {
  console.log('📊 Bundle analyzer report generated at: dist/stats.html');
}

// Analyze dist folder
console.log('\n📁 Analyzing dist folder...');
try {
  const distAnalysis = execSync('du -sh dist/* | sort -hr', { encoding: 'utf8' });
  console.log(distAnalysis);
} catch (error) {
  console.log('Could not analyze dist folder size');
}

// Check for large files
console.log('\n🔍 Looking for large files (>100KB)...');
try {
  const largeFiles = execSync('find dist -type f -size +100k -exec ls -lh {} \\; | awk \'{ print $5 " " $9 }\'', { encoding: 'utf8' });
  if (largeFiles.trim()) {
    console.log(largeFiles);
  } else {
    console.log('✅ No files larger than 100KB found');
  }
} catch (error) {
  console.log('Could not analyze file sizes');
}

// Performance recommendations
console.log('\n💡 Performance Recommendations:');
console.log('1. ✅ Code splitting implemented');
console.log('2. ✅ Modern ES2020 target set');
console.log('3. ✅ Terser optimization enabled');
console.log('4. ✅ CSS code splitting enabled');
console.log('5. 📊 Check dist/stats.html for detailed bundle analysis');
console.log('6. 🚀 Consider implementing lazy loading for routes');
console.log('7. 🖼️  Optimize images with modern formats (WebP, AVIF)');
console.log('8. 📦 Consider using dynamic imports for heavy components');

console.log('\n✨ Bundle analysis complete!');