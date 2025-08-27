#!/usr/bin/env ts-node
import { runShell, log } from "./utils";

async function commandExists(cmd: string) {
  return runShell(`bash -lc 'command -v ${cmd}'`)
    .then(() => true)
    .catch(() => false);
}

async function main() {
  const ENVIRONMENT = process.argv[2] || "dev";
  const AWS_PROFILE = process.argv[3] || "default";
  const PROJECT_NAME = "automerge-analytics";

  log("🚀 Deploying Automerge-Pro Analytics Platform");
  log(`Environment: ${ENVIRONMENT}`);
  log(`AWS Profile: ${AWS_PROFILE}`);

  for (const tool of ["aws", "sam", "terraform", "node"]) {
    if (!(await commandExists(tool))) {
      throw new Error(`${tool} is required but not installed`);
    }
  }

  process.env.AWS_PROFILE = AWS_PROFILE;
  await runShell("aws sts get-caller-identity > /dev/null");

  const AWS_ACCOUNT_ID =
    (await runShell(
      "bash -lc 'aws sts get-caller-identity --query Account --output text'"
    )) || "";
  const AWS_REGION =
    (await runShell("bash -lc 'aws configure get region'")) || "";

  // Terraform
  await runShell('bash -lc "cd infrastructure/terraform && terraform init"');
  await runShell(
    `bash -lc "cd infrastructure/terraform && terraform plan -var=environment=${ENVIRONMENT}"`
  );
  await runShell(
    `bash -lc "cd infrastructure/terraform && terraform apply -var=environment=${ENVIRONMENT} -auto-approve"`
  );

  // SAM
  await runShell('bash -lc "cd infrastructure/aws-sam && sam build"');
  await runShell(
    'bash -lc "cd infrastructure/aws-sam && sam deploy --no-confirm-changeset --no-fail-on-empty-changeset"'
  );

  // Backend
  await runShell('bash -lc "cd backend && npm install && npm run build"');

  // Frontend
  await runShell('bash -lc "npm install && npm run build"');

  log("🎉 Deployment steps completed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
