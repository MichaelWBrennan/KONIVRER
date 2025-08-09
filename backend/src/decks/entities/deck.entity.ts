import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum DeckFormat {
  STANDARD = 'Standard',
  CLASSIC = 'Classic',
  DRAFT = 'Draft',
  SEALED = 'Sealed',
}

export enum DeckVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

@Entity('decks')
@ObjectType()
@Index(['format', 'visibility']) // Composite index for common queries
@Index(['ownerId']) // Index for user's decks
export class Deck {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @ApiProperty({ description: 'Canonical deck ID (immutable UUID)' })
  id: string;

  @Column()
  @Field()
  @ApiProperty({ description: 'Deck name' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: 'Deck description', required: false })
  description?: string;

  @Column('uuid')
  @Field(() => ID)
  @ApiProperty({ description: 'Deck owner ID' })
  ownerId: string;

  @ManyToOne(() => User, user => user.decks)
  @Field(() => User)
  owner: User;

  @Column({
    type: 'enum',
    enum: DeckFormat,
    default: DeckFormat.STANDARD,
  })
  @Field()
  @ApiProperty({ enum: DeckFormat, description: 'Tournament format' })
  format: DeckFormat;

  @Column({
    type: 'enum',
    enum: DeckVisibility,
    default: DeckVisibility.PRIVATE,
  })
  @Field()
  @ApiProperty({ enum: DeckVisibility, description: 'Deck visibility' })
  visibility: DeckVisibility;

  @Column({ type: 'simple-json' })
  @Field(() => [DeckCard])
  @ApiProperty({ description: 'Cards in the deck with quantities', type: 'array' })
  cards: DeckCard[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: 'Primary element of the deck', required: false })
  mainElement?: string;

  @Column({ type: 'simple-array', nullable: true })
  @Field(() => [String], { nullable: true })
  @ApiProperty({ description: 'Deck tags', type: [String], required: false })
  tags?: string[];

  @Column({ type: 'simple-json', nullable: true })
  @Field({ nullable: true })
  @ApiProperty({ description: 'Deck metadata (mana curve, etc.)', required: false })
  metadata?: Record<string, any>;

  @Column({ type: 'float', default: 0 })
  @Field()
  @ApiProperty({ description: 'Meta rating based on tournament performance' })
  metaRating: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: 'Number of likes/favorites' })
  likes: number;

  @Column({ default: 0 })
  @Field(() => Int)
  @ApiProperty({ description: 'Number of views' })
  views: number;

  @CreateDateColumn()
  @Field()
  @ApiProperty({ description: 'Deck creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  @ApiProperty({ description: 'Last updated timestamp' })
  updatedAt: Date;

  // Computed fields
  @Field(() => Int)
  get totalCards(): number {
    return this.cards.reduce((total, card) => total + card.quantity, 0);
  }

  @Field(() => [String])
  get uniqueElements(): string[] {
    // This would be calculated based on the actual card data
    return [];
  }
}

@ObjectType()
export class DeckCard {
  @Field(() => ID)
  @ApiProperty({ description: 'Canonical card ID' })
  cardId: string;

  @Field(() => Int)
  @ApiProperty({ description: 'Number of copies in deck' })
  quantity: number;

  @Field({ nullable: true })
  @ApiProperty({ description: 'Sideboard indicator', required: false })
  sideboard?: boolean;
}