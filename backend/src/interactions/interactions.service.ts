import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RateMovieDto, FavoriteDto, WatchHistoryDto } from './dto/interactions.dto';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  // Ratings
  async rateMovie(userId: string, rateMovieDto: RateMovieDto) {
    return this.prisma.rating.upsert({
      where: {
        userId_movieId_movieType: {
          userId,
          movieId: rateMovieDto.movieId,
          movieType: rateMovieDto.movieType,
        },
      },
      update: {
        rating: rateMovieDto.rating,
      },
      create: {
        userId,
        movieId: rateMovieDto.movieId,
        movieType: rateMovieDto.movieType,
        rating: rateMovieDto.rating,
      },
    });
  }

  async getUserRatings(userId: string) {
    return this.prisma.rating.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRatingForMovie(userId: string, movieId: number, movieType: string) {
    return this.prisma.rating.findUnique({
      where: {
        userId_movieId_movieType: {
          userId,
          movieId,
          movieType,
        },
      },
    });
  }

  async deleteRating(userId: string, movieId: number, movieType: string) {
    return this.prisma.rating.delete({
      where: {
        userId_movieId_movieType: {
          userId,
          movieId,
          movieType,
        },
      },
    });
  }

  // Favorites
  async toggleFavorite(userId: string, favoriteDto: FavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId_movieType: {
          userId,
          movieId: favoriteDto.movieId,
          movieType: favoriteDto.movieType,
        },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: {
          userId_movieId_movieType: {
            userId,
            movieId: favoriteDto.movieId,
            movieType: favoriteDto.movieType,
          },
        },
      });
      return { action: 'removed', favorite: null };
    } else {
      const favorite = await this.prisma.favorite.create({
        data: {
          userId,
          movieId: favoriteDto.movieId,
          movieType: favoriteDto.movieType,
          movieTitle: favoriteDto.movieTitle,
          posterPath: favoriteDto.posterPath,
        },
      });
      return { action: 'added', favorite };
    }
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFavorite(userId: string, movieId: number, movieType: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId_movieType: {
          userId,
          movieId,
          movieType,
        },
      },
    });
    return { isFavorite: !!favorite };
  }

  // Watch History
  async addToWatchHistory(userId: string, watchHistoryDto: WatchHistoryDto) {
    return this.prisma.watchHistory.create({
      data: {
        userId,
        movieId: watchHistoryDto.movieId,
        movieType: watchHistoryDto.movieType,
        movieTitle: watchHistoryDto.movieTitle,
        genres: Array.isArray(watchHistoryDto.genres) ? watchHistoryDto.genres.join(',') : (watchHistoryDto.genres || ''),
      },
    });
  }

  async getUserWatchHistory(userId: string, limit?: number) {
    return this.prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: limit,
    });
  }

  async clearWatchHistory(userId: string) {
    return this.prisma.watchHistory.deleteMany({
      where: { userId },
    });
  }
}
