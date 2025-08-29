import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from "typeorm";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { Tournament } from "../../tournaments/entities/tournament.entity";

@Entity("point_history")
@ObjectType()
@Index(["userId", "eventDate"])
export class PointHistory {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "Point history entry ID" })
  id: string;

  @Column("uuid")
  @Field(() => ID)
  @ApiProperty({ description: "User ID" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  @Field(() => User)
  user: User;

  @Column("uuid", { nullable: true })
  @Field(() => ID, { nullable: true })
  @ApiProperty({ description: "Tournament/Event ID", required: false })
  eventId?: string;

  @ManyToOne(() => Tournament, { nullable: true })
  @JoinColumn({ name: "eventId" })
  @Field(() => Tournament, { nullable: true })
  event?: Tournament;

  @Column({ type: "int" })
  @Field(() => Int)
  @ApiProperty({ description: "Points earned" })
  pointsEarned: number;

  @Column({ type: "varchar" })
  @Field()
  @ApiProperty({ description: "Point type: regional | global | format" })
  pointType: string;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  @ApiProperty({ description: "Placement in event", required: false })
  placement?: number;

  @Column({ type: "int", nullable: true })
  @Field(() => Int, { nullable: true })
  @ApiProperty({ description: "Total participants", required: false })
  totalParticipants?: number;

  @Column({ type: "timestamp" })
  @Field()
  @ApiProperty({ description: "Event date" })
  eventDate: Date;

  @Column({ type: "timestamp", nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: "Decay date", required: false })
  decayDate?: Date;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;
}
