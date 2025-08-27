#!/usr/bin/env ts-node
import { log, run, runShell } from "./utils";

async function main() {
  log("🚀 Starting optimized build process...");
  process.env.NODE_ENV = "production";
  process.env.VERCEL = "1";
  process.env.CI = "1";
  process.env.BUILD_ENV = "production";
  process.env.npm_lifecycle_event = "build";
  process.env.npm_command = "run-script";

  // attempt to kill stray node/tsx; ignore failures
  try {
    await runShell('pkill -f "node"');
  } catch {}
  try {
    await runShell('pkill -f "tsx"');
  } catch {}

  log("📦 Building application...");
  await run("npm", ["run", "build"], { cwd: process.cwd(), env: process.env });
  log("✅ Build completed successfully!");
}

main().catch((err) => {
  console.error("❌ Build failed:", err?.message || err);
  process.exit(1);
});
