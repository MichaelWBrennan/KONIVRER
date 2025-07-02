#!/usr/bin/env node

// MIT License
// 
// Copyright (c) 2025 KONIVRER Team
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

const fs = require('fs');
const path = require('path');

/**
 * Bundle analysis script for KONIVRER project
 * Analyzes build output for size, performance, and optimization opportunities
 */

class BundleAnalyzer {
  constructor() {
    this.distDir = path.join(process.cwd(), 'dist');
    this.report = {
      timestamp: new Date().toISOString(),
      files: [],
      summary: {},
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  analyzeFile(filePath) {
    const stats = fs.statSync(filePath);
    const relativePath = path.relative(this.distDir, filePath);
    const ext = path.extname(filePath);
    
    const fileInfo = {
      path: relativePath,
      size: stats.size,
      sizeFormatted: this.formatBytes(stats.size),
      type: this.getFileType(ext),
      gzipEstimate: Math.round(stats.size * 0.3) // Rough gzip estimate
    };

    // Analyze specific file types
    if (ext === '.js') {
      fileInfo.analysis = this.analyzeJavaScript(filePath);
    } else if (ext === '.css') {
      fileInfo.analysis = this.analyzeCSS(filePath);
    }

    return fileInfo;
  }

  getFileType(ext) {
    const typeMap = {
      '.js': 'JavaScript',
      '.css': 'CSS',
      '.html': 'HTML',
      '.png': 'Image',
      '.jpg': 'Image',
      '.jpeg': 'Image',
      '.svg': 'Image',
      '.woff': 'Font',
      '.woff2': 'Font',
      '.ttf': 'Font'
    };
    return typeMap[ext] || 'Other';
  }

  analyzeJavaScript(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      return {
        lines: content.split('\n').length,
        minified: !content.includes('\n  '), // Simple minification check
        hasSourceMap: content.includes('//# sourceMappingURL='),
        estimatedModules: (content.match(/import\s+/g) || []).length,
        potentialIssues: this.findJSIssues(content)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  analyzeCSS(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      return {
        lines: content.split('\n').length,
        rules: (content.match(/\{[^}]*\}/g) || []).length,
        minified: !content.includes('\n  '),
        hasSourceMap: content.includes('/*# sourceMappingURL='),
        potentialIssues: this.findCSSIssues(content)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  findJSIssues(content) {
    const issues = [];
    
    // Check for console.log statements
    if (content.includes('console.log')) {
      issues.push('Contains console.log statements');
    }
    
    // Check for debugger statements
    if (content.includes('debugger')) {
      issues.push('Contains debugger statements');
    }
    
    // Check for large inline data
    const largeStrings = content.match(/"[^"]{1000,}"/g);
    if (largeStrings) {
      issues.push(`Contains ${largeStrings.length} large inline strings`);
    }
    
    return issues;
  }

  findCSSIssues(content) {
    const issues = [];
    
    // Check for unused vendor prefixes
    const vendorPrefixes = content.match(/-webkit-|-moz-|-ms-|-o-/g);
    if (vendorPrefixes && vendorPrefixes.length > 10) {
      issues.push('High number of vendor prefixes detected');
    }
    
    // Check for duplicate rules (simple check)
    const rules = content.match(/[^{}]+\{[^}]*\}/g) || [];
    const uniqueRules = new Set(rules);
    if (rules.length !== uniqueRules.size) {
      issues.push('Potential duplicate CSS rules detected');
    }
    
    return issues;
  }

  scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        this.scanDirectory(filePath);
      } else {
        const fileInfo = this.analyzeFile(filePath);
        this.report.files.push(fileInfo);
      }
    });
  }

  generateSummary() {
    const summary = {
      totalFiles: this.report.files.length,
      totalSize: 0,
      totalGzipEstimate: 0,
      byType: {}
    };

    this.report.files.forEach(file => {
      summary.totalSize += file.size;
      summary.totalGzipEstimate += file.gzipEstimate;
      
      if (!summary.byType[file.type]) {
        summary.byType[file.type] = { count: 0, size: 0 };
      }
      summary.byType[file.type].count++;
      summary.byType[file.type].size += file.size;
    });

    summary.totalSizeFormatted = this.formatBytes(summary.totalSize);
    summary.totalGzipEstimateFormatted = this.formatBytes(summary.totalGzipEstimate);

    // Format by-type sizes
    Object.keys(summary.byType).forEach(type => {
      summary.byType[type].sizeFormatted = this.formatBytes(summary.byType[type].size);
    });

    this.report.summary = summary;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Check for large JavaScript files
    const largeJSFiles = this.report.files.filter(f => 
      f.type === 'JavaScript' && f.size > 500000 // 500KB
    );
    
    if (largeJSFiles.length > 0) {
      recommendations.push({
        type: 'performance',
        severity: 'high',
        message: `Large JavaScript files detected (${largeJSFiles.length} files > 500KB)`,
        suggestion: 'Consider code splitting or lazy loading'
      });
    }

    // Check for unminified files
    const unminifiedJS = this.report.files.filter(f => 
      f.type === 'JavaScript' && f.analysis && !f.analysis.minified
    );
    
    if (unminifiedJS.length > 0) {
      recommendations.push({
        type: 'optimization',
        severity: 'medium',
        message: `Unminified JavaScript files detected (${unminifiedJS.length} files)`,
        suggestion: 'Enable minification in build process'
      });
    }

    // Check total bundle size
    if (this.report.summary.totalSize > 2000000) { // 2MB
      recommendations.push({
        type: 'performance',
        severity: 'high',
        message: `Large total bundle size: ${this.report.summary.totalSizeFormatted}`,
        suggestion: 'Consider reducing bundle size through code splitting, tree shaking, or removing unused dependencies'
      });
    }

    // Check for missing source maps
    const jsFilesWithoutSourceMaps = this.report.files.filter(f => 
      f.type === 'JavaScript' && f.analysis && !f.analysis.hasSourceMap
    );
    
    if (jsFilesWithoutSourceMaps.length > 0) {
      recommendations.push({
        type: 'debugging',
        severity: 'low',
        message: `JavaScript files without source maps (${jsFilesWithoutSourceMaps.length} files)`,
        suggestion: 'Enable source map generation for better debugging'
      });
    }

    this.report.recommendations = recommendations;
  }

  printReport() {
    console.log('\n📊 Bundle Analysis Report');
    console.log('========================\n');
    
    console.log('📈 Summary:');
    console.log(`  Total files: ${this.report.summary.totalFiles}`);
    console.log(`  Total size: ${this.report.summary.totalSizeFormatted}`);
    console.log(`  Estimated gzipped: ${this.report.summary.totalGzipEstimateFormatted}\n`);
    
    console.log('📁 By file type:');
    Object.entries(this.report.summary.byType).forEach(([type, info]) => {
      console.log(`  ${type}: ${info.count} files, ${info.sizeFormatted}`);
    });
    
    if (this.report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.report.recommendations.forEach((rec, index) => {
        const icon = rec.severity === 'high' ? '🔴' : rec.severity === 'medium' ? '🟡' : '🔵';
        console.log(`  ${icon} ${rec.message}`);
        console.log(`     Suggestion: ${rec.suggestion}\n`);
      });
    } else {
      console.log('\n✅ No optimization recommendations at this time.\n');
    }
  }

  saveReport() {
    const reportPath = path.join(process.cwd(), 'bundle-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    this.log(`Bundle analysis report saved to ${reportPath}`);
  }

  run() {
    this.log('Starting bundle analysis...');
    
    if (!fs.existsSync(this.distDir)) {
      this.log('dist directory not found. Please run build first.', 'error');
      process.exit(1);
    }

    this.scanDirectory(this.distDir);
    this.generateSummary();
    this.generateRecommendations();
    
    this.printReport();
    this.saveReport();
    
    this.log('Bundle analysis completed');
    
    // Exit with warning code if there are high-severity recommendations
    const highSeverityIssues = this.report.recommendations.filter(r => r.severity === 'high');
    if (highSeverityIssues.length > 0) {
      this.log(`Found ${highSeverityIssues.length} high-severity optimization opportunities`, 'warning');
      process.exit(1);
    }
  }
}

// Run bundle analysis if this script is executed directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer;