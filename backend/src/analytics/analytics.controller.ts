import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('stats')
  async getUserStats(@Request() req) {
    return this.analyticsService.getUserStats(req.user.userId);
  }

  @Get('genres')
  async getGenrePreferences(@Request() req) {
    return this.analyticsService.getGenrePreferences(req.user.userId);
  }

  @Get('ratings')
  async getRatingPatterns(@Request() req) {
    return this.analyticsService.getRatingPatterns(req.user.userId);
  }

  @Get('trends')
  async getViewingTrends(@Request() req) {
    return this.analyticsService.getViewingTrends(req.user.userId);
  }

  @Get('insights')
  async getComprehensiveInsights(@Request() req) {
    return this.analyticsService.getComprehensiveInsights(req.user.userId);
  }
}
