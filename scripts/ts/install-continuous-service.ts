#!/usr/bin/env ts-node
import { runShell, log } from './utils';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

async function main() {
  log('🚀 Installing KONIVRER Continuous Automation Service (24/7/365)');

  const repoPath = process.cwd();
  const serviceFile = resolve(repoPath, 'konivrer-automation.service');

  // Replace path in service file
  try {
    const content = readFileSync(serviceFile, 'utf8');
    const updated = content.replace(/\/workspace\/KONIVRER-deck-database/g, repoPath);
    writeFileSync(serviceFile, updated);
    log('✅ Updated service file with correct path');
  } catch {
    log('⚠️ Service file not found or could not be updated');
  }

  // Make scripts executable if present
  await runShell('chmod +x auto-service.sh || true');
  await runShell('chmod +x auto-start.sh || true');

  // Copy service and enable
  await runShell(`cp ${serviceFile} /etc/systemd/system/`);
  await runShell('systemctl daemon-reload');
  await runShell('systemctl enable konivrer-automation.service');
  await runShell('systemctl start konivrer-automation.service');

  const statusOk = await runShell('systemctl is-active --quiet konivrer-automation.service').then(() => true).catch(() => false);
  log(statusOk ? '✅ Service is running successfully' : '⚠️ Service failed to start');

  // Crontab watchdog every 5 min
  await runShell("bash -lc '(crontab -l 2>/dev/null | grep -v "konivrer-automation.service"; echo "*/5 * * * * systemctl is-active --quiet konivrer-automation.service || systemctl restart konivrer-automation.service") | crontab -'");
  log('✅ Added crontab entry to check service every 5 minutes');
}

main().catch((e) => { console.error(e); process.exit(1); });

