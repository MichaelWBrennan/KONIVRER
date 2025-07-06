/**
 * Integrate AI Recorder Script
 * 
 * This script integrates the AI recorder into the application's build process.
 * It modifies configuration files to enable AI recording during development.
 */

import fs from 'fs';
import path from 'path';

console.log('🔄 Integrating AI Recorder...');

// Paths to configuration files
const packageJsonPath = path.join(process.cwd(), 'package.json');
const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');

// Check if files exist
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

if (!fs.existsSync(viteConfigPath)) {
  console.error('❌ vite.config.ts not found!');
  process.exit(1);
}

try {
  // Update package.json
  console.log('\n📝 Updating package.json...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if AI scripts are already integrated
  const hasAiScripts = Object.keys(packageJson.scripts || {}).some(key => key.startsWith('ai:'));
  
  if (!hasAiScripts) {
    packageJson.scripts = packageJson.scripts || {};
    
    // Add AI scripts
    packageJson.scripts['ai:start'] = 'node scripts/ai-recorder.js start';
    packageJson.scripts['ai:stop'] = 'node scripts/ai-recorder.js end';
    packageJson.scripts['ai:activity'] = 'node scripts/ai-recorder.js activity';
    packageJson.scripts['ai:decision'] = 'node scripts/ai-recorder.js decision';
    packageJson.scripts['ai:performance'] = 'node scripts/ai-recorder.js performance';
    packageJson.scripts['ai:security'] = 'node scripts/ai-recorder.js security';
    packageJson.scripts['ai:summary'] = 'node scripts/ai-recorder.js summary';
    packageJson.scripts['ai:run'] = 'node scripts/ai-recorder.js run';
    packageJson.scripts['dev:ai'] = 'npm run ai:start & npm run dev';
    packageJson.scripts['build:ai'] = 'npm run ai:run \'npm run build\'';
    packageJson.scripts['test:ai'] = 'npm run ai:run \'npm run test\'';
    
    // Save updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added AI scripts to package.json');
  } else {
    console.log('ℹ️ AI scripts already exist in package.json');
  }
  
  // Update vite.config.ts
  console.log('\n📝 Updating vite.config.ts...');
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if AI recorder is already integrated
  const hasAiRecorder = viteConfig.includes('AI_RECORDER_ENABLED');
  
  if (!hasAiRecorder) {
    // Add AI recorder environment variable
    if (viteConfig.includes('defineConfig')) {
      viteConfig = viteConfig.replace(
        'defineConfig({',
        `defineConfig(({ mode }) => ({
  define: {
    'process.env.AI_RECORDER_ENABLED': JSON.stringify(process.env.AI_RECORDER_ENABLED || mode === 'development'),
  },`
      );
      
      // Save updated vite.config.ts
      fs.writeFileSync(viteConfigPath, viteConfig);
      console.log('✅ Added AI recorder configuration to vite.config.ts');
    } else {
      console.warn('⚠️ Could not update vite.config.ts automatically. Manual integration required.');
    }
  } else {
    console.log('ℹ️ AI recorder already integrated in vite.config.ts');
  }
  
  // Create .ai-logs directory if it doesn't exist
  const aiLogsDir = path.join(process.cwd(), '.ai-logs');
  if (!fs.existsSync(aiLogsDir)) {
    fs.mkdirSync(aiLogsDir, { recursive: true });
    console.log('\n✅ Created .ai-logs directory');
  }
  
  // Add .ai-logs to .gitignore if it doesn't exist
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.ai-logs')) {
      fs.appendFileSync(gitignorePath, '\n# AI logs\n.ai-logs\n');
      console.log('✅ Added .ai-logs to .gitignore');
    }
  }
  
  console.log('\n🎉 AI Recorder integration complete!');
  console.log('\nYou can now use the following commands:');
  console.log('  npm run dev:ai         - Start development with AI recording');
  console.log('  npm run build:ai       - Build with AI recording');
  console.log('  npm run test:ai        - Run tests with AI recording');
  console.log('  npm run ai:summary     - View summary of current AI session');
  
} catch (error) {
  console.error('❌ Integration failed:', error);
  process.exit(1);
}