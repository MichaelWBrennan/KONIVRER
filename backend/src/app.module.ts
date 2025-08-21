import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { CardsModule } from './cards/cards.module';
import { DecksModule } from './decks/decks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MigrationModule } from './migration/migration.module';
import { AiDeckbuildingModule } from './ai-deckbuilding/ai-deckbuilding.module';
import { PhysicalSimulationModule } from './physical-simulation/physical-simulation.module';
import { EventsModule } from './events/events.module';
import { SimulatorModule } from './simulator/simulator.module';
import { RatingsModule } from './ratings/ratings.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OcrModule } from './ocr/ocr.module';
import { UpscalingModule } from './upscaling/upscaling.module';

@Module({
  imports: [
    // Configuration management
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'konivrer'),
        password: configService.get('DB_PASSWORD', 'konivrer_dev'),
        database: configService.get('DB_DATABASE', 'konivrer_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Rate limiting configuration
    ThrottlerModule.forRoot([
      {
        name: 'read',
        ttl: 60000, // 1 minute
        limit: 1000, // 1000 req/min for read endpoints
      },
      {
        name: 'write',
        ttl: 60000, // 1 minute  
        limit: 100, // 100 req/min for write endpoints
      },
    ]),

    // Event system for notifications
    EventEmitterModule.forRoot(),

    // GraphQL configuration
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: true,
        context: ({ req }) => ({ req }),
      }),
    }),

    // Feature modules
    CardsModule,
    DecksModule,
    UsersModule,
    AuthModule,
    SearchModule,
    TournamentsModule,
    MatchmakingModule,
    EventsModule,
    SimulatorModule,
    RatingsModule,
    AuditModule,
    MigrationModule,
    AiDeckbuildingModule,
    PhysicalSimulationModule,
    NotificationsModule,
    AnalyticsModule,
    OcrModule,
    UpscalingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}