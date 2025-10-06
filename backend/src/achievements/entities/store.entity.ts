import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PaperEvent } from './paper-event.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'json', default: '{}' })
  coordinates: {
    latitude: number;
    longitude: number;
  };

  @Column({ type: 'json', default: '{}' })
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  @Column({ type: 'json', default: '[]' })
  supportedFormats: string[];

  @Column({ type: 'json', default: '{}' })
  amenities: {
    hasTournamentSpace: boolean;
    hasDraftTables: boolean;
    hasCommanderArea: boolean;
    hasRetailSpace: boolean;
    hasFoodService: boolean;
    hasParking: boolean;
    wheelchairAccessible: boolean;
  };

  @Column({ type: 'json', default: '{}' })
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
  };

  @Column({ type: 'json', default: '{}' })
  stats: {
    totalEvents: number;
    totalPlayers: number;
    averageEventSize: number;
    lastEventDate: Date;
    rating: number;
    reviewCount: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PaperEvent, event => event.store)
  events: PaperEvent[];
}