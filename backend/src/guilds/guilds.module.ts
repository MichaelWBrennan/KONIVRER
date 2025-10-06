import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Guild } from './entities/guild.entity';
import { GuildMember } from './entities/guild-member.entity';
import { GuildInvite } from './entities/guild-invite.entity';
import { GuildEvent } from './entities/guild-event.entity';
import { GuildsService } from './guilds.service';
import { GuildMembersService } from './services/guild-members.service';
import { GuildEventsService } from './services/guild-events.service';
import { GuildsController } from './guilds.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Guild, GuildMember, GuildInvite, GuildEvent]),
  ],
  providers: [
    GuildsService,
    GuildMembersService,
    GuildEventsService,
  ],
  controllers: [GuildsController],
  exports: [GuildsService],
})
export class GuildsModule {}