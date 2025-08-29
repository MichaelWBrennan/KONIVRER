import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

@Entity("tournament_profiles")
@ObjectType()
@Index(["userId"], { unique: true })
export class TournamentProfile {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Tournament profile ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "User ID" })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  @ApiProperty({ description: "User entity", type: () => User })
  user: User;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Current progression points" })
  currentPoints: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Regional points" })
  regionalPoints: number;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: "Global points" })
  globalPoints: number;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  @Field(() => String, { nullable: true })
  @ApiProperty({ description: "Format-specific points map", required: false })
  formatSpecificPoints?: Record<string, number>;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  @Field(() => String, { nullable: true })
  @ApiProperty({ description: "Qualification status map", required: false })
  qualificationStatus?: Record<string, any>;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  @ApiProperty({ description: "Last point update timestamp" })
  lastPointUpdate: Date;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  @Field(() => String, { nullable: true })
  @ApiProperty({ description: "Player tournament preferences", required: false })
  preferences?: Record<string, any>;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: "Update timestamp" })
  updatedAt: Date;
}

