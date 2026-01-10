import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { InteractionsModule } from './interactions/interactions.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    InteractionsModule,
    RecommendationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
