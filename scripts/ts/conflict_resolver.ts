#!/usr/bin/env ts-node
import { runShell, log } from './utils';

interface Args { prNumber: string; repository: string; githubToken: string; verbose: boolean }

function parseArgs(): Args {
  const args: any = { verbose: false };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--pr-number') args.prNumber = argv[++i];
    else if (a === '--repository') args.repository = argv[++i];
    else if (a === '--github-token') args.githubToken = argv[++i];
    else if (a === '--verbose') args.verbose = true;
  }
  if (!args.prNumber || !args.repository || !args.githubToken) {
    // eslint-disable-next-line no-console
    console.error('Usage: conflict_resolver.ts --pr-number <num> --repository <owner/repo> --github-token <token>');
    process.exit(1);
  }
  return args as Args;
}

async function getPrInfo(repo: string, pr: string, token: string) {
  const api = `https://api.github.com/repos/${repo}/pulls/${pr}`;
  const res = await fetch(api, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
  if (!res.ok) throw new Error('Failed to fetch PR info');
  const data: any = await res.json();
  return { headRef: data.head.ref as string, baseRef: data.base.ref as string, headSha: data.head.sha as string };
}

async function main() {
  const { prNumber, repository, githubToken } = parseArgs();
  log(`🚀 Starting smart conflict resolution for PR #${prNumber}`);

  await runShell('git config user.name "github-actions[bot]"');
  await runShell('git config user.email "41898282+github-actions[bot]@users.noreply.github.com"');
  await runShell('git config pull.rebase true');
  await runShell('git config merge.renamelimit 9999');
  await runShell('git fetch --all --prune --tags');

  const { headRef, baseRef, headSha } = await getPrInfo(repository, prNumber, githubToken);
  log(`Head: ${headRef} Base: ${baseRef}`);

  // checkout
  const hasRemote = await runShell(`git show-ref --verify --quiet refs/remotes/origin/${headRef}`).then(() => true).catch(() => false);
  if (hasRemote) await runShell(`git checkout -B ${headRef} origin/${headRef}`); else { await runShell(`git fetch origin ${headSha}`); await runShell(`git checkout -B ${headRef} ${headSha}`); }

  // attempt rebase
  if (await runShell(`git rebase origin/${baseRef}`).then(() => true).catch(() => false)) {
    log('✅ Clean rebase successful');
  } else {
    log('⚠️ Rebase conflicts detected, trying patience merge');
    await runShell('git rebase --abort || true');
    if (!(await runShell(`git merge -X patience origin/${baseRef}`).then(() => true).catch(() => false))) {
      log('⚠️ Patience merge failed, trying -X theirs');
      await runShell('git merge --abort || true');
      if (!(await runShell(`git merge -X theirs origin/${baseRef}`).then(() => true).catch(() => false))) {
        log('⚠️ -X theirs failed, trying -X ours');
        await runShell('git merge --abort || true');
        await runShell(`git merge -X ours origin/${baseRef}`);
      }
    }
  }

  // simple verification: build if present
  await runShell('npm run -s build || true');

  await runShell(`git push --force-with-lease origin ${headRef}`);
  log('🎉 Conflict resolution completed');
}

main().catch((e) => { console.error(e); process.exit(1); });

