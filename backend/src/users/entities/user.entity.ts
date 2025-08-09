import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Deck } from '../../decks/entities/deck.entity';

export enum UserRole {
  USER = 'user',
  JUDGE = 'judge',
  ORGANIZER = 'organizer',
  ADMIN = 'admin',
}

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @ApiProperty({ description: 'User ID (UUID)' })
  id: string;

  @Column({ unique: true })
  @Field()
  @ApiProperty({ description: 'Username (unique)' })
  username: string;

  @Column({ unique: true })
  @Field()
  @ApiProperty({ description: 'Email address (unique)' })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: 'Display name', required: false })
  displayName?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: 'User avatar URL', required: false })
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Field()
  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @OneToMany(() => Deck, deck => deck.owner)
  @Field(() => [Deck])
  decks: Deck[];

  @Column({ default: true })
  @Field()
  @ApiProperty({ description: 'Whether the account is active' })
  isActive: boolean;

  @Column({ default: false })
  @Field()
  @ApiProperty({ description: 'Whether the email is verified' })
  emailVerified: boolean;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: 'Account creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: 'Last updated timestamp' })
  updatedAt: Date;
}