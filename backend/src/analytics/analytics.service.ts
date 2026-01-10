import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const [ratings, favorites, watchHistory] = await Promise.all([
      this.prisma.rating.count({ where: { userId } }),
      this.prisma.favorite.count({ where: { userId } }),
      this.prisma.watchHistory.count({ where: { userId } }),
    ]);

    // Check if user has sufficient data
    const hasSufficientData = ratings >= 5 && watchHistory >= 3;

    return {
      totalRatings: ratings,
      totalFavorites: favorites,
      totalWatched: watchHistory,
      hasSufficientData,
      minimumRequired: {
        ratings: 5,
        watchHistory: 3,
      },
    };
  }

  async getGenrePreferences(userId: string) {
    const watchHistory = await this.prisma.watchHistory.findMany({
      where: { userId },
      select: { genres: true },
    });

    const genreCount: Record<string, number> = {};

    watchHistory.forEach((item) => {
      const genres = item.genres ? item.genres.split(',').filter((g: string) => g.trim()) : [];
      genres.forEach((genre: string) => {
        const genreName = genre.trim();
        genreCount[genreName] = (genreCount[genreName] || 0) + 1;
      });
    });

    const genrePreferences = Object.entries(genreCount)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / watchHistory.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      preferences: genrePreferences,
      topGenres: genrePreferences.slice(0, 5),
    };
  }

  async getRatingPatterns(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { userId },
      select: { rating: true },
    });

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        distribution: {},
      };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = sum / ratings.length;

    // Rating distribution (grouped by ranges: 1-3, 4-6, 7-8, 9-10)
    const distribution = {
      low: ratings.filter((r) => r.rating >= 1 && r.rating <= 3).length,
      medium: ratings.filter((r) => r.rating >= 4 && r.rating <= 6).length,
      high: ratings.filter((r) => r.rating >= 7 && r.rating <= 8).length,
      excellent: ratings.filter((r) => r.rating >= 9 && r.rating <= 10).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      distribution,
    };
  }

  async getViewingTrends(userId: string) {
    const watchHistory = await this.prisma.watchHistory.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: 30,
    });

    // Group by day of week
    const dayOfWeekCount: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    watchHistory.forEach((item) => {
      const dayIndex = new Date(item.watchedAt).getDay();
      dayOfWeekCount[days[dayIndex]]++;
    });

    // Movie vs TV preference
    const movieCount = watchHistory.filter((h) => h.movieType === 'movie').length;
    const tvCount = watchHistory.filter((h) => h.movieType === 'tv').length;

    return {
      dayOfWeekPreference: dayOfWeekCount,
      contentTypePreference: {
        movies: movieCount,
        tvShows: tvCount,
        moviePercentage: watchHistory.length > 0 ? Math.round((movieCount / watchHistory.length) * 100) : 0,
        tvPercentage: watchHistory.length > 0 ? Math.round((tvCount / watchHistory.length) * 100) : 0,
      },
      recentActivity: watchHistory.length,
    };
  }

  async getComprehensiveInsights(userId: string) {
    const [stats, genres, ratings, trends] = await Promise.all([
      this.getUserStats(userId),
      this.getGenrePreferences(userId),
      this.getRatingPatterns(userId),
      this.getViewingTrends(userId),
    ]);

    return {
      stats,
      genres,
      ratings,
      trends,
      timestamp: new Date().toISOString(),
    };
  }
}
