import { Controller, Get, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  async getRecommendations(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationsService.getRecommendations(
      req.user.userId,
      limit ? parseInt(limit) : 10,
    );
  }
}
