import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("simulations")
export class Simulation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("json")
  config: {
    deckA: { deckId: string };
    deckB: { deckId: string };
    seed?: string;
    iterations: number;
    options?: {
      startingPlayer?: string;
      timeLimitSeconds?: number;
    };
  };

  @Column({
    type: "enum",
    enum: ["queued", "running", "completed", "failed"],
    default: "queued",
  })
  status: "queued" | "running" | "completed" | "failed";

  @Column("json", { nullable: true })
  result: {
    iterations: number;
    winRateA: number;
    avgTurnLength: number;
    statBreakdown: Record<string, any>;
    skillUpdates?: any[];
  } | null;

  @Column("text", { nullable: true })
  logs: string;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("timestamp", { nullable: true })
  completedAt: Date;
}
