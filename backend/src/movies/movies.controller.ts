import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get('discover')
  async discover(
    @Query('type') type?: string,
    @Query('genre') genre?: string,
    @Query('year') year?: string,
    @Query('sort_by') sortBy?: string,
    @Query('page') page?: string,
    @Query('releaseDateLte') releaseDateLte?: string,
    @Query('releaseDateGte') releaseDateGte?: string,
    @Query('country') country?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.discover(
      mediaType,
      genre,
      year,
      sortBy || 'primary_release_date.desc',
      parseInt(page) || 1,
      releaseDateLte,
      releaseDateGte,
      country,
    );
  }

  @Get('trending')
  async getTrendingMovies(@Query('page') page?: string) {
    return this.moviesService.getTrending('movie', parseInt(page) || 1);
  }

  @Get('tv/trending')
  async getTrendingTV(@Query('page') page?: string) {
    return this.moviesService.getTrending('tv', parseInt(page) || 1);
  }

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.search(query, mediaType, parseInt(page) || 1);
  }

  @Get('genre/:genreId')
  async getByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query('type') type?: string,
    @Query('page') page?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.getByGenre(genreId, mediaType, parseInt(page) || 1);
  }

  @Get(':id')
  async getMovieDetails(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.getDetails(id, mediaType);
  }

  @Get(':id/similar')
  async getSimilar(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type?: string,
    @Query('page') page?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.getSimilar(id, mediaType, parseInt(page) || 1);
  }

  @Get(':id/watch-providers')
  async getWatchProviders(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type?: string,
  ) {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    return this.moviesService.getWatchProviders(id, mediaType);
  }
}
