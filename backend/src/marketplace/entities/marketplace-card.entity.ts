import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Card } from '../../cards/entities/card.entity';

@Entity('marketplace_cards')
@Index(['cardId', 'marketplace'])
export class MarketplaceCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cardId: string;

  @Column()
  marketplace: string; // 'tcgplayer', 'cardmarket', 'scryfall'

  @Column({ nullable: true })
  marketplaceId: string; // External marketplace card ID

  @Column({ nullable: true })
  marketplaceUrl: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  availability: string; // 'in_stock', 'out_of_stock', 'limited'

  @Column({ type: 'int', default: 0 })
  stockCount: number;

  @Column({ type: 'json', nullable: true })
  priceRanges: {
    low: number;
    mid: number;
    high: number;
    market: number;
  };

  @Column({ type: 'json', nullable: true })
  conditions: {
    near_mint: number;
    lightly_played: number;
    moderately_played: number;
    heavily_played: number;
    damaged: number;
  };

  @Column({ type: 'json', nullable: true })
  foilPrices: {
    regular: number;
    foil: number;
    etched: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'cardId' })
  card: Card;
}