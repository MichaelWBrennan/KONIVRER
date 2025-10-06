import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaperAchievement } from './entities/paper-achievement.entity';
import { UserPaperAchievement } from './entities/user-paper-achievement.entity';
import { PaperEvent } from './entities/paper-event.entity';
import { Store } from './entities/store.entity';
import { AchievementsService } from './achievements.service';
import { PaperEventService } from './services/paper-event.service';
import { StoreService } from './services/store.service';
import { AchievementsController } from './achievements.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PaperAchievement, UserPaperAchievement, PaperEvent, Store]),
  ],
  providers: [
    AchievementsService,
    PaperEventService,
    StoreService,
  ],
  controllers: [AchievementsController],
  exports: [AchievementsService],
})
export class AchievementsModule {}