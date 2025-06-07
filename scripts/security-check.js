#!/usr/bin/env node

/**
 * Security Configuration Check Script
 * Validates security settings and configurations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Running Security Configuration Check...\n');

let allChecksPass = true;

// Check vercel.json security configuration
function checkVercelSecurity() {
  console.log('📋 Checking Vercel Security Configuration...');
  
  const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    console.error('❌ vercel.json not found');
    allChecksPass = false;
    return;
  }

  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  
  // Check security headers
  const headers = vercelConfig.headers || [];
  const mainHeaders = headers.find(h => h.source === '/(.*)')?.headers || [];
  
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options', 
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'Referrer-Policy',
    'Permissions-Policy'
  ];

  const presentHeaders = mainHeaders.map(h => h.key);
  const missingHeaders = requiredHeaders.filter(h => !presentHeaders.includes(h));
  
  if (missingHeaders.length === 0) {
    console.log('✅ All required security headers present');
  } else {
    console.log(`❌ Missing security headers: ${missingHeaders.join(', ')}`);
    allChecksPass = false;
  }

  // Check CSP configuration
  const cspHeader = mainHeaders.find(h => h.key === 'Content-Security-Policy');
  if (cspHeader) {
    const csp = cspHeader.value;
    const hasFrameAncestors = csp.includes("frame-ancestors 'none'");
    const hasObjectSrc = csp.includes("object-src 'none'");
    const hasBaseUri = csp.includes("base-uri 'self'");
    
    console.log(`${hasFrameAncestors ? '✅' : '❌'} CSP frame-ancestors protection`);
    console.log(`${hasObjectSrc ? '✅' : '❌'} CSP object-src restriction`);
    console.log(`${hasBaseUri ? '✅' : '❌'} CSP base-uri restriction`);
    
    if (!hasFrameAncestors || !hasObjectSrc || !hasBaseUri) {
      allChecksPass = false;
    }
  }

  // Check HSTS configuration
  const hstsHeader = mainHeaders.find(h => h.key === 'Strict-Transport-Security');
  if (hstsHeader) {
    const hsts = hstsHeader.value;
    const hasPreload = hsts.includes('preload');
    const hasIncludeSubDomains = hsts.includes('includeSubDomains');
    const hasLongMaxAge = hsts.includes('max-age=31536000');
    
    console.log(`${hasPreload ? '✅' : '❌'} HSTS preload enabled`);
    console.log(`${hasIncludeSubDomains ? '✅' : '❌'} HSTS includeSubDomains`);
    console.log(`${hasLongMaxAge ? '✅' : '❌'} HSTS long max-age (1 year)`);
  }

  // Check skew protection
  const skewProtection = vercelConfig.skewProtection;
  if (skewProtection) {
    const isEnabled = skewProtection.enabled === true;
    const hasMaxAge = skewProtection.maxAge > 0;
    
    console.log(`${isEnabled ? '✅' : '❌'} Skew protection enabled`);
    console.log(`${hasMaxAge ? '✅' : '❌'} Skew protection max age configured`);
    
    if (!isEnabled || !hasMaxAge) {
      allChecksPass = false;
    }
  } else {
    console.log('❌ Skew protection not configured');
    allChecksPass = false;
  }
}

// Check environment variables
function checkEnvironmentSecurity() {
  console.log('\n🌍 Checking Environment Security...');
  
  const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  const env = vercelConfig.env || {};
  
  // Check debug settings
  const debugDisabled = env.VITE_ENABLE_DEBUG === 'false';
  console.log(`${debugDisabled ? '✅' : '❌'} Debug disabled in production`);
  
  if (!debugDisabled) {
    allChecksPass = false;
  }

  // Check for sensitive data in env
  const sensitivePatterns = ['password', 'secret', 'key', 'token'];
  const envKeys = Object.keys(env).map(k => k.toLowerCase());
  const hasSensitiveKeys = envKeys.some(key => 
    sensitivePatterns.some(pattern => key.includes(pattern))
  );
  
  if (hasSensitiveKeys) {
    console.log('⚠️  Potential sensitive data in environment variables');
    console.log('   Consider using Vercel environment variables instead');
  } else {
    console.log('✅ No sensitive data detected in public env vars');
  }
}

// Check security files
function checkSecurityFiles() {
  console.log('\n📁 Checking Security Files...');
  
  const securityFiles = [
    'src/config/security.js',
    'src/utils/skewProtection.js',
    'src/hooks/useSkewProtection.js',
    'src/components/SkewProtection.jsx',
    'middleware.js',
    'api/security/health-check.js',
    'api/version.js',
    'SECURITY_FEATURES.md',
    'docs/SKEW_PROTECTION.md'
  ];

  securityFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    
    if (!exists) {
      allChecksPass = false;
    }
  });
}

// Check package.json for security
function checkPackageSecurity() {
  console.log('\n📦 Checking Package Security...');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check for security scripts
  const securityScripts = [
    'security:check',
    'security:audit', 
    'security:scan'
  ];
  
  const scripts = packageJson.scripts || {};
  const missingScripts = securityScripts.filter(script => !scripts[script]);
  
  if (missingScripts.length === 0) {
    console.log('✅ All security scripts present');
  } else {
    console.log(`❌ Missing security scripts: ${missingScripts.join(', ')}`);
    allChecksPass = false;
  }

  // Check for known vulnerable packages (basic check)
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const knownVulnerable = ['node-sass']; // Example of packages with known issues
  
  const vulnerableFound = knownVulnerable.filter(pkg => dependencies[pkg]);
  if (vulnerableFound.length > 0) {
    console.log(`⚠️  Potentially vulnerable packages: ${vulnerableFound.join(', ')}`);
    console.log('   Run npm audit for detailed vulnerability report');
  } else {
    console.log('✅ No known vulnerable packages detected');
  }
}

// Check middleware configuration
function checkMiddleware() {
  console.log('\n🔧 Checking Middleware Configuration...');
  
  const middlewarePath = path.join(__dirname, '..', 'middleware.js');
  if (!fs.existsSync(middlewarePath)) {
    console.log('❌ middleware.js not found');
    allChecksPass = false;
    return;
  }

  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  // Check for security headers in middleware
  const hasSecurityHeaders = middlewareContent.includes('X-Content-Type-Options');
  const hasRateLimit = middlewareContent.includes('RateLimit');
  const hasCORS = middlewareContent.includes('Access-Control');
  
  console.log(`${hasSecurityHeaders ? '✅' : '❌'} Security headers in middleware`);
  console.log(`${hasRateLimit ? '✅' : '❌'} Rate limiting configuration`);
  console.log(`${hasCORS ? '✅' : '❌'} CORS configuration`);
}

// Run all checks
async function runSecurityCheck() {
  try {
    checkVercelSecurity();
    checkEnvironmentSecurity();
    checkSecurityFiles();
    checkPackageSecurity();
    checkMiddleware();
    
    console.log('\n🎯 Security Check Summary:');
    
    if (allChecksPass) {
      console.log('✅ All security checks passed!');
      console.log('\n📋 Recommendations:');
      console.log('- Regularly run npm audit to check for vulnerabilities');
      console.log('- Monitor security headers with online tools');
      console.log('- Review and update CSP policies as needed');
      console.log('- Test security configuration in staging environment');
    } else {
      console.log('❌ Some security checks failed');
      console.log('\n🔧 Action Required:');
      console.log('- Fix the issues identified above');
      console.log('- Re-run security check after fixes');
      console.log('- Consider additional security measures');
      process.exit(1);
    }
    
    console.log('\n📚 For detailed security information, see SECURITY_FEATURES.md');
    
  } catch (error) {
    console.error('❌ Security check failed:', error.message);
    process.exit(1);
  }
}

runSecurityCheck();