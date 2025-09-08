import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("audit_logs")
@Index(["actorId", "createdAt"])
@Index(["action", "createdAt"])
@Index(["entityType", "entityId"])
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  actorId: string;

  @Column({ type: "enum", enum: ["agent", "user"], default: "user" })
  actorType: "agent" | "user";

  @Column()
  action: string;

  @Column()
  entityType: string;

  @Column()
  entityId: string;

  @Column("json", { nullable: true })
  metadata: Record<string, any>;

  @Column("json", { nullable: true })
  provenance: {
    agentId?: string;
    modelVersion?: string;
    promptHash?: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}
