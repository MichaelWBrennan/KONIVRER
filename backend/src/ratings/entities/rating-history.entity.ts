import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("rating_history")
export class RatingHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  matchId: string;

  @Column("json")
  prior: {
    mu: number;
    sigma: number;
  };

  @Column("json")
  posterior: {
    mu: number;
    sigma: number;
  };

  @Column("decimal", { precision: 10, scale: 3 })
  delta: number;

  @CreateDateColumn()
  createdAt: Date;
}
