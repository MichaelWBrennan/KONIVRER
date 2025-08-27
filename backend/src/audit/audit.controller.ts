import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuditService } from "./audit.service";
import { AuditQueryDto } from "./dto/audit.dto";
import { AuditLog } from "./entities/audit-log.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("admin")
@Controller("api/admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("audit")
  @ApiOperation({ summary: "Get audit logs with filtering" })
  @ApiResponse({
    status: 200,
    description: "Audit logs retrieved successfully",
    type: [AuditLog],
  })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async getAuditLogs(@Query() query: AuditQueryDto): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.auditService.getAuditLogs(query);
  }
}
