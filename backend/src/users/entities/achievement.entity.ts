import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
  })
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  @Column({
    type: 'enum',
    enum: ['games', 'decks', 'tournaments', 'collection', 'social', 'special'],
    default: 'games',
  })
  category: 'games' | 'decks' | 'tournaments' | 'collection' | 'social' | 'special';

  @Column({ type: 'json', default: '{}' })
  requirements: {
    type: 'games_played' | 'games_won' | 'win_streak' | 'decks_created' | 'cards_collected' | 'tournaments_entered' | 'tournaments_won' | 'social_connections' | 'special';
    value: number;
    conditions?: Record<string, any>;
  };

  @Column({ type: 'json', default: '{}' })
  rewards: {
    experience: number;
    points: number;
    title?: string;
    badge?: string;
    special?: any;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isHidden: boolean;

  @Column({ type: 'int', default: 0 })
  unlockCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}