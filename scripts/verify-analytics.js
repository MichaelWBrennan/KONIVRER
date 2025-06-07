#!/usr/bin/env node

/**
 * Analytics Verification Script
 * Checks if analytics are properly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Analytics Configuration...\n');

// Check vercel.json
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
if (!fs.existsSync(vercelJsonPath)) {
  console.error('❌ vercel.json not found');
  process.exit(1);
}

const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

// Check environment variables
const hasAnalyticsEnv = vercelConfig.env && vercelConfig.env.VITE_ENABLE_ANALYTICS;
console.log(`${hasAnalyticsEnv ? '✅' : '❌'} VITE_ENABLE_ANALYTICS: ${vercelConfig.env?.VITE_ENABLE_ANALYTICS || 'Not set'}`);

// Check CSP headers
const headers = vercelConfig.headers || [];
const cspHeader = headers.find(h => 
  h.headers?.some(header => header.key === 'Content-Security-Policy')
);

if (cspHeader) {
  const csp = cspHeader.headers.find(h => h.key === 'Content-Security-Policy').value;
  const hasAnalyticsDomains = csp.includes('va.vercel-scripts.com') && csp.includes('vitals.vercel-insights.com');
  console.log(`${hasAnalyticsDomains ? '✅' : '❌'} CSP includes analytics domains`);
} else {
  console.log('❌ No CSP header found');
}

// Check package.json dependencies
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const hasAnalytics = packageJson.dependencies?.['@vercel/analytics'];
const hasSpeedInsights = packageJson.dependencies?.['@vercel/speed-insights'];
const hasWebVitals = packageJson.dependencies?.['web-vitals'];

console.log(`${hasAnalytics ? '✅' : '❌'} @vercel/analytics: ${hasAnalytics || 'Not installed'}`);
console.log(`${hasSpeedInsights ? '✅' : '❌'} @vercel/speed-insights: ${hasSpeedInsights || 'Not installed'}`);
console.log(`${hasWebVitals ? '✅' : '❌'} web-vitals: ${hasWebVitals || 'Not installed'}`);

// Check if analytics files exist
const analyticsFiles = [
  'src/utils/analytics.js',
  'src/components/WebVitals.jsx',
];

console.log('\n📁 Analytics Files:');
analyticsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Check App.jsx for analytics components
const appJsxPath = path.join(__dirname, '..', 'src', 'App.jsx');
if (fs.existsSync(appJsxPath)) {
  const appContent = fs.readFileSync(appJsxPath, 'utf8');
  const hasAnalyticsImport = appContent.includes('@vercel/analytics');
  const hasSpeedInsightsImport = appContent.includes('@vercel/speed-insights');
  const hasWebVitalsComponent = appContent.includes('<WebVitals');
  
  console.log('\n📱 App.jsx Integration:');
  console.log(`${hasAnalyticsImport ? '✅' : '❌'} Analytics import`);
  console.log(`${hasSpeedInsightsImport ? '✅' : '❌'} Speed Insights import`);
  console.log(`${hasWebVitalsComponent ? '✅' : '❌'} WebVitals component`);
}

console.log('\n🎯 Summary:');
const allGood = hasAnalyticsEnv && cspHeader && hasAnalytics && hasSpeedInsights && hasWebVitals;

if (allGood) {
  console.log('✅ Analytics configuration looks good!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy to Vercel production');
  console.log('2. Visit your deployed site');
  console.log('3. Navigate around and interact with the site');
  console.log('4. Wait 24-48 hours for data to appear');
  console.log('5. Check Vercel Analytics dashboard');
} else {
  console.log('❌ Analytics configuration has issues');
  console.log('\n🔧 Recommended Actions:');
  
  if (!hasAnalyticsEnv) {
    console.log('- Add VITE_ENABLE_ANALYTICS=true to vercel.json env');
  }
  if (!cspHeader) {
    console.log('- Update CSP headers in vercel.json');
  }
  if (!hasAnalytics || !hasSpeedInsights) {
    console.log('- Install missing analytics packages');
  }
}

console.log('\n📚 For detailed troubleshooting, see ANALYTICS_TROUBLESHOOTING.md');