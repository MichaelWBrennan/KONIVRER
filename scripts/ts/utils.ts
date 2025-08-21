import { spawn } from 'child_process';

export function log(message: string) {
  const ts = new Date().toISOString().replace('T', ' ').split('.')[0];
  // eslint-disable-next-line no-console
  console.log(`[${ts}] ${message}`);
}

export async function run(command: string, args: string[] = [], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: false, ...options });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

export async function runShell(cmd: string, options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, { stdio: 'inherit', shell: true, ...options });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${cmd} (code ${code})`));
    });
  });
}

