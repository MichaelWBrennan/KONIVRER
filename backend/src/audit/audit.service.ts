import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like } from "typeorm";
import { AuditLog } from "./entities/audit-log.entity";
import { AuditQueryDto } from "./dto/audit.dto";

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>
  ) {}

  async log(
    actorId: string,
    actorType: "agent" | "user",
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
    provenance?: {
      agentId?: string;
      modelVersion?: string;
      promptHash?: string;
    }
  ): Promise<AuditLog> {
    const auditLog = this.auditRepository.create({
      actorId,
      actorType,
      action,
      entityType,
      entityId,
      metadata,
      provenance,
    });

    return this.auditRepository.save(auditLog);
  }

  async getAuditLogs(query: AuditQueryDto): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 100);
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (query.entity) {
      whereClause.entityType = Like(`%${query.entity}%`);
    }

    if (query.action) {
      whereClause.action = Like(`%${query.action}%`);
    }

    if (query["date-from"] || query["date-to"]) {
      const dateFrom = query["date-from"]
        ? new Date(query["date-from"])
        : new Date("1970-01-01");
      const dateTo = query["date-to"] ? new Date(query["date-to"]) : new Date();
      whereClause.createdAt = Between(dateFrom, dateTo);
    }

    // Handle provenance filters
    let queryBuilder = this.auditRepository.createQueryBuilder("audit");

    if (query["agent-id"]) {
      queryBuilder = queryBuilder.andWhere(
        "audit.provenance->>'agentId' = :agentId",
        { agentId: query["agent-id"] }
      );
    }

    if (query["model-version"]) {
      queryBuilder = queryBuilder.andWhere(
        "audit.provenance->>'modelVersion' = :modelVersion",
        { modelVersion: query["model-version"] }
      );
    }

    if (query["prompt-hash"]) {
      queryBuilder = queryBuilder.andWhere(
        "audit.provenance->>'promptHash' = :promptHash",
        { promptHash: query["prompt-hash"] }
      );
    }

    // Apply other where conditions
    Object.keys(whereClause).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`audit.${key} = :${key}`, {
        [key]: whereClause[key],
      });
    });

    const [logs, total] = await queryBuilder
      .orderBy("audit.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      logs,
      total,
      page,
      limit,
    };
  }
}
