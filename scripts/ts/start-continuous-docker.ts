#!/usr/bin/env ts-node
import { log, run, runShell } from './utils';
import { existsSync } from 'fs';

async function main() {
  const LOG_FILE = 'docker-continuous.log';
  log('🚀 Starting KONIVRER Continuous Automation Service (24/7/365) using Docker');

  const hasDocker = await runShell('command -v docker').then(() => true).catch(() => false);
  if (!hasDocker) {
    log('⚠️ Docker is not installed. Please install Docker first.');
    process.exit(1);
  }

  const hasCompose = await runShell('command -v docker-compose').then(() => true).catch(() => false);
  if (!hasCompose) {
    log('⚠️ Docker Compose is not installed. Please install Docker Compose first.');
    process.exit(1);
  }

  log('🔄 Stopping any existing containers...');
  await runShell('docker-compose -f docker-compose.continuous.yml down || true');

  log('🚀 Starting containers...');
  await runShell('docker-compose -f docker-compose.continuous.yml up -d');

  const isRunning = await runShell("bash -lc 'docker ps | grep -q konivrer-automation-24-7-365'")
    .then(() => true)
    .catch(() => false);
  if (isRunning) {
    log('✅ Automation container is running');
    log('📝 To view logs: docker logs -f konivrer-automation-24-7-365');
  } else {
    log('⚠️ Failed to start automation container');
    process.exit(1);
  }

  const hasCrontab = await runShell('command -v crontab').then(() => true).catch(() => false);
  if (hasCrontab) {
    log('🔄 Setting up cron job to ensure container is always running...');
    const pwd = process.cwd();
    const cron = `*/1 * * * * docker ps | grep -q konivrer-automation-24-7-365 || (cd ${pwd} && docker-compose -f docker-compose.continuous.yml up -d)`;
    await runShell(`bash -lc '(crontab -l 2>/dev/null | grep -v "konivrer-automation"; echo "${cron}") | crontab -'`);
    log('✅ Cron job set up successfully');
  }

  log('🎉 Setup complete! The automation system is now running 24/7/365');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

