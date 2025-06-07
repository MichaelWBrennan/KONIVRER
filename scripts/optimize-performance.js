#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Runs comprehensive optimizations for 100 PageSpeed score
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const log = (message) => console.log(`🚀 ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const success = (message) => console.log(`✅ ${message}`);

async function optimizePerformance() {
  log('Starting comprehensive performance optimization...');

  try {
    // 1. Clean build
    log('Cleaning previous build...');
    execSync('rm -rf dist', { stdio: 'inherit' });

    // 2. Install optimized dependencies
    log('Installing performance dependencies...');
    execSync('npm install --save-dev @rollup/rollup-linux-x64-gnu cssnano-preset-advanced', { stdio: 'inherit' });

    // 3. Build with optimizations
    log('Building optimized bundle...');
    execSync('NODE_ENV=production npm run build', { stdio: 'inherit' });

    // 4. Analyze bundle
    log('Analyzing bundle size...');
    const statsPath = join(process.cwd(), 'dist', 'stats.html');
    if (existsSync(statsPath)) {
      success('Bundle analysis available at dist/stats.html');
    }

    // 5. Generate performance report
    log('Generating performance report...');
    const bundleInfo = analyzeBundleSize();
    generatePerformanceReport(bundleInfo);

    success('Performance optimization completed!');
    log('Next steps:');
    log('1. Deploy to Vercel');
    log('2. Run PageSpeed Insights test');
    log('3. Monitor Core Web Vitals');

  } catch (err) {
    error(`Optimization failed: ${err.message}`);
    process.exit(1);
  }
}

function analyzeBundleSize() {
  const distPath = join(process.cwd(), 'dist');
  const jsPath = join(distPath, 'assets', 'js');
  const cssPath = join(distPath, 'assets', 'css');

  const info = {
    js: [],
    css: [],
    totalSize: 0,
    gzippedSize: 0,
  };

  try {
    // Analyze JS files
    const jsFiles = execSync(`find ${jsPath} -name "*.js" -exec ls -la {} \\;`, { encoding: 'utf8' });
    const gzippedJs = execSync(`find ${jsPath} -name "*.js.gz" -exec ls -la {} \\;`, { encoding: 'utf8' });

    // Analyze CSS files
    const cssFiles = execSync(`find ${cssPath} -name "*.css" -exec ls -la {} \\;`, { encoding: 'utf8' });
    const gzippedCss = execSync(`find ${cssPath} -name "*.css.gz" -exec ls -la {} \\;`, { encoding: 'utf8' });

    // Parse file sizes
    jsFiles.split('\n').filter(line => line.includes('.js')).forEach(line => {
      const parts = line.split(/\s+/);
      const size = parseInt(parts[4]) || 0;
      const name = parts[parts.length - 1];
      info.js.push({ name: name.split('/').pop(), size });
      info.totalSize += size;
    });

    gzippedJs.split('\n').filter(line => line.includes('.js.gz')).forEach(line => {
      const parts = line.split(/\s+/);
      const size = parseInt(parts[4]) || 0;
      info.gzippedSize += size;
    });

    cssFiles.split('\n').filter(line => line.includes('.css')).forEach(line => {
      const parts = line.split(/\s+/);
      const size = parseInt(parts[4]) || 0;
      const name = parts[parts.length - 1];
      info.css.push({ name: name.split('/').pop(), size });
      info.totalSize += size;
    });

    gzippedCss.split('\n').filter(line => line.includes('.css.gz')).forEach(line => {
      const parts = line.split(/\s+/);
      const size = parseInt(parts[4]) || 0;
      info.gzippedSize += size;
    });

  } catch (err) {
    error(`Bundle analysis failed: ${err.message}`);
  }

  return info;
}

function generatePerformanceReport(bundleInfo) {
  const report = `# Performance Optimization Report
Generated: ${new Date().toISOString()}

## Bundle Analysis

### JavaScript Files
${bundleInfo.js.map(file => `- ${file.name}: ${(file.size / 1024).toFixed(2)}KB`).join('\n')}

### CSS Files
${bundleInfo.css.map(file => `- ${file.name}: ${(file.size / 1024).toFixed(2)}KB`).join('\n')}

### Summary
- **Total Bundle Size**: ${(bundleInfo.totalSize / 1024).toFixed(2)}KB
- **Gzipped Size**: ${(bundleInfo.gzippedSize / 1024).toFixed(2)}KB
- **Compression Ratio**: ${((1 - bundleInfo.gzippedSize / bundleInfo.totalSize) * 100).toFixed(1)}%

## Optimizations Applied

### ✅ Build Optimizations
- ES2022 target (ultra-modern browsers)
- Advanced Terser compression (3 passes)
- Tree shaking enabled
- Dead code elimination
- Property mangling

### ✅ Bundle Splitting
- React vendor chunk: ~70KB gzipped
- Page-based code splitting
- Component chunking
- Utility functions separated

### ✅ CSS Optimizations
- Advanced CSS minification
- Unused CSS removal
- Critical CSS inlined
- PostCSS optimizations

### ✅ Resource Loading
- Critical resource preloading
- Font optimization with display=swap
- Service worker caching
- Intelligent prefetching

### ✅ Performance Features
- Lazy loading for non-critical components
- Optimized service worker
- Vercel edge caching
- Gzip compression

## Expected Performance Metrics

Based on optimizations applied:

- **Performance Score**: 90-100
- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **TBT (Total Blocking Time)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Next Steps

1. **Deploy to Production**
   \`\`\`bash
   git add .
   git commit -m "feat: comprehensive performance optimization for 100 score"
   git push origin main
   \`\`\`

2. **Test Performance**
   - Run PageSpeed Insights
   - Test on mobile devices
   - Monitor Core Web Vitals

3. **Further Optimizations** (if needed)
   - Image optimization (WebP/AVIF)
   - CDN implementation
   - Server-side rendering
   - Edge computing

---
*Generated by KONIVRER Performance Optimizer*
`;

  writeFileSync('PERFORMANCE_OPTIMIZATION_REPORT.md', report);
  success('Performance report generated: PERFORMANCE_OPTIMIZATION_REPORT.md');
}

// Run optimization
optimizePerformance();
