#!/usr/bin/env ts-node
import { runShell, log } from './utils';

async function branchExistsRemote(branch: string) {
  const cmd = `bash -lc 'git ls-remote --heads origin ${branch} | grep -q ${branch}'`;
  return runShell(cmd).then(() => true).catch(() => false);
}

async function main() {
  const KEEP_BRANCHES = ['main', 'copilot/fix-1708d50b-0ab1-4dc7-ac21-e3543b575232', 'copilot/fix-e8312904-c589-4acc-bff1-808c9fefce1c'];
  const DELETE_BRANCHES: string[] = [];

  log('🧹 KONIVRER Branch Cleanup - Delete Closed PR Branches');

  log('🔍 Checking remote branches to keep:');
  for (const b of KEEP_BRANCHES) {
    const exists = await branchExistsRemote(b);
    log(`  ${exists ? '✅' : '⚠️'} ${b}`);
  }

  if (DELETE_BRANCHES.length === 0) {
    log('ℹ️  No branches slated for deletion. Exiting.');
    return;
  }

  log('Branches that will be deleted:');
  for (const b of DELETE_BRANCHES) {
    const exists = await branchExistsRemote(b);
    log(`  ${exists ? '🗑️' : 'ℹ️'} ${b}`);
  }

  // Non-interactive: proceed to delete existing ones
  let deleted = 0; let errors = 0;
  for (const b of DELETE_BRANCHES) {
    const exists = await branchExistsRemote(b);
    if (!exists) continue;
    const ok = await runShell(`git push origin --delete ${b}`).then(() => true).catch(() => false);
    if (ok) { deleted++; log(`✅ Deleted ${b}`); } else { errors++; log(`❌ Failed to delete ${b}`); }
  }
  log(`📊 Summary: deleted=${deleted}, errors=${errors}, kept=${KEEP_BRANCHES.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

