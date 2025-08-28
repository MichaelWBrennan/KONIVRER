import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuditService } from "../../audit/audit.service";

@Injectable()
export class ProvenanceMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Extract provenance headers
    const provenance = {
      agentId: req.headers["x-provenance-agent-id"] as string,
      modelVersion: req.headers["x-provenance-model-version"] as string,
      promptHash: req.headers["x-provenance-prompt-hash"] as string,
    };

    // Add provenance to request object for later use
    (req as any).provenance = provenance;

    // Log request if it's a mutating operation and has provenance
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
      (provenance.agentId || provenance.modelVersion || provenance.promptHash)
    ) {
      // We'll need user context, so we'll defer actual logging to the service layer
      (req as any).shouldAuditWithProvenance = true;
    }

    next();
  }
}
