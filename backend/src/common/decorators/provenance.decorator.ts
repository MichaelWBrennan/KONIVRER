import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface ProvenanceData {
  agentId?: string;
  modelVersion?: string;
  promptHash?: string;
}

export const Provenance = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ProvenanceData => {
    const request = ctx.switchToHttp().getRequest();

    return {
      agentId: request.headers["x-provenance-agent-id"],
      modelVersion: request.headers["x-provenance-model-version"],
      promptHash: request.headers["x-provenance-prompt-hash"],
    };
  }
);
