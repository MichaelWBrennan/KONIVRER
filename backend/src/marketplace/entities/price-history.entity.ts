import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Card } from '../../cards/entities/card.entity';

@Entity('price_history')
@Index(['cardId', 'marketplace', 'date'])
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cardId: string;

  @Column()
  marketplace: string; // 'tcgplayer', 'cardmarket', 'scryfall'

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  condition: string; // 'near_mint', 'lightly_played', etc.

  @Column({ nullable: true })
  foil: boolean;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  sellerId: string;

  @Column({ nullable: true })
  listingUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Card, { nullable: true })
  @JoinColumn({ name: 'cardId' })
  card: Card;
}