import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { CardsModule } from './cards/cards.module';
import { DecksModule } from './decks/decks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MigrationModule } from './migration/migration.module';

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
    MigrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}