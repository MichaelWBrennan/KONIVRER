
import { watch } from 'fs';
import { spawn } from 'child_process';

console.log('👁️ File watcher started - will auto-start on file access');

let automationStarted = false;

// Watch for any file access
watch('.', { recursive: true }, (eventType, filename) => {
  if (!automationStarted && filename && !filename.includes('node_modules')) {
    console.log('📁 File access detected, auto-starting automation...');
    
    const automation = spawn('npx', ['tsx', 'automation/all-in-one.ts', 'autonomous'], {
      detached: true,
      stdio: 'ignore'
    });
    automation.unref();
    
    automationStarted = true;
    console.log('✅ Automation auto-started due to file access');
  }
});
