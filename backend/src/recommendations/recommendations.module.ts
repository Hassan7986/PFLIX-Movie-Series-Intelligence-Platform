import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
