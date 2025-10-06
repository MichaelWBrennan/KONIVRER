import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaService } from './social-media.service';
import { SocialMediaRealService } from './social-media-real.service';
import { SocialMediaController } from './social-media.controller';
import { SocialMediaRealController } from './social-media-real.controller';
import { DeckIntegrationService } from './integrations/deck-integration.service';
import { TournamentIntegrationService } from './integrations/tournament-integration.service';
import { DiscordService } from './services/discord.service';
import { DiscordRealService } from './services/discord-real.service';
import { TwitterService } from './services/twitter.service';
import { TwitterRealService } from './services/twitter-real.service';
import { YouTubeService } from './services/youtube.service';
import { TwitchService } from './services/twitch.service';
import { RedditService } from './services/reddit.service';
import { InstagramService } from './services/instagram.service';
import { SocialAuthService } from './services/social-auth.service';
import { ContentGeneratorService } from './services/content-generator.service';
import { ContentGeneratorRealService } from './services/content-generator-real.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deck } from '../decks/entities/deck.entity';
import { Card } from '../cards/entities/card.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Deck, Card, Tournament]),
  ],
  providers: [
    SocialMediaService,
    SocialMediaRealService,
    DiscordService,
    DiscordRealService,
    TwitterService,
    TwitterRealService,
    YouTubeService,
    TwitchService,
    RedditService,
    InstagramService,
    SocialAuthService,
    ContentGeneratorService,
    ContentGeneratorRealService,
    DeckIntegrationService,
    TournamentIntegrationService,
  ],
  controllers: [SocialMediaController, SocialMediaRealController],
  exports: [SocialMediaService, SocialAuthService],
})
export class SocialMediaModule {}