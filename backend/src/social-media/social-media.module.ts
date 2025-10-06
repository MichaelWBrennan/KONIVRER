import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaService } from './social-media.service';
import { SocialMediaController } from './social-media.controller';
import { DiscordService } from './services/discord.service';
import { TwitterService } from './services/twitter.service';
import { YouTubeService } from './services/youtube.service';
import { TwitchService } from './services/twitch.service';
import { RedditService } from './services/reddit.service';
import { InstagramService } from './services/instagram.service';
import { SocialAuthService } from './services/social-auth.service';
import { ContentGeneratorService } from './services/content-generator.service';

@Module({
  imports: [ConfigModule],
  providers: [
    SocialMediaService,
    DiscordService,
    TwitterService,
    YouTubeService,
    TwitchService,
    RedditService,
    InstagramService,
    SocialAuthService,
    ContentGeneratorService,
  ],
  controllers: [SocialMediaController],
  exports: [SocialMediaService, SocialAuthService],
})
export class SocialMediaModule {}