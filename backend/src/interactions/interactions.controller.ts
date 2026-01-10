import { Controller, Get, Post, Delete, Body, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InteractionsService } from './interactions.service';
import { RateMovieDto, FavoriteDto, WatchHistoryDto } from './dto/interactions.dto';

@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  // Ratings
  @Post('rate')
  async rateMovie(@Request() req, @Body() rateMovieDto: RateMovieDto) {
    return this.interactionsService.rateMovie(req.user.userId, rateMovieDto);
  }

  @Get('ratings')
  async getRatings(@Request() req) {
    return this.interactionsService.getUserRatings(req.user.userId);
  }

  @Get('rating')
  async getRating(
    @Request() req,
    @Query('movieId', ParseIntPipe) movieId: number,
    @Query('movieType') movieType: string,
  ) {
    return this.interactionsService.getRatingForMovie(req.user.userId, movieId, movieType);
  }

  @Delete('rating')
  async deleteRating(
    @Request() req,
    @Query('movieId', ParseIntPipe) movieId: number,
    @Query('movieType') movieType: string,
  ) {
    return this.interactionsService.deleteRating(req.user.userId, movieId, movieType);
  }

  // Favorites
  @Post('favorite')
  async toggleFavorite(@Request() req, @Body() favoriteDto: FavoriteDto) {
    return this.interactionsService.toggleFavorite(req.user.userId, favoriteDto);
  }

  @Get('favorites')
  async getFavorites(@Request() req) {
    return this.interactionsService.getUserFavorites(req.user.userId);
  }

  @Get('is-favorite')
  async isFavorite(
    @Request() req,
    @Query('movieId', ParseIntPipe) movieId: number,
    @Query('movieType') movieType: string,
  ) {
    return this.interactionsService.isFavorite(req.user.userId, movieId, movieType);
  }

  // Watch History
  @Post('watch')
  async addToWatchHistory(@Request() req, @Body() watchHistoryDto: WatchHistoryDto) {
    return this.interactionsService.addToWatchHistory(req.user.userId, watchHistoryDto);
  }

  @Get('history')
  async getWatchHistory(@Request() req, @Query('limit') limit?: string) {
    return this.interactionsService.getUserWatchHistory(
      req.user.userId,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Delete('history')
  async clearWatchHistory(@Request() req) {
    return this.interactionsService.clearWatchHistory(req.user.userId);
  }
}
