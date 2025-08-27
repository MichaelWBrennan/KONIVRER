import { execSync } from "child_process";

export function log(message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

export async function runShell(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const output = execSync(command, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 300000, // 5 minute timeout
      });
      resolve(output.trim());
    } catch (error: any) {
      // Don't reject on non-zero exit codes, let the caller handle it
      if (error.stdout) {
        resolve(error.stdout.toString().trim());
      } else {
        reject(new Error(`Command failed: ${command}\n${error.message}`));
      }
    }
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        log(`Retry ${i + 1}/${maxRetries} after error: ${lastError.message}`);
        await sleep(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }

  throw lastError!;
}
