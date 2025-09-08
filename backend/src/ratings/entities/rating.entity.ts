import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("player_ratings")
@Unique(["userId", "format"])
export class PlayerRating {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  format: string;

  @Column("decimal", { precision: 10, scale: 3, default: 25.0 })
  mu: number; // skill estimate

  @Column("decimal", { precision: 10, scale: 3, default: 8.333 })
  sigma: number; // uncertainty

  @Column("decimal", { precision: 10, scale: 3 })
  conservativeRating: number;

  @Column({ default: 0 })
  matchesPlayed: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
