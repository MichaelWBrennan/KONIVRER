import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Card } from '../cards/entities/card.entity';
import { Deck } from '../decks/entities/deck.entity';
import { MarketplaceService } from './marketplace.service';
import { TCGPlayerService } from './services/tcgplayer.service';
import { CardMarketService } from './services/cardmarket.service';
import { ScryfallService } from './services/scryfall.service';
import { PriceTrackingService } from './services/price-tracking.service';
import { MarketplaceController } from './marketplace.controller';
import { PriceHistory } from './entities/price-history.entity';
import { MarketplaceCard } from './entities/marketplace-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Deck, PriceHistory, MarketplaceCard]),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    MarketplaceService,
    TCGPlayerService,
    CardMarketService,
    ScryfallService,
    PriceTrackingService,
  ],
  controllers: [MarketplaceController],
  exports: [MarketplaceService, PriceTrackingService],
})
export class MarketplaceModule {}