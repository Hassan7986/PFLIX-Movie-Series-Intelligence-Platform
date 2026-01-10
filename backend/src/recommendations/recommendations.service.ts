import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from '../movies/movies.service';

interface Recommendation {
  movieId: number;
  movieType: string;
  score: number;
  reason: string;
  title?: string;
  poster_path?: string;
  vote_average?: number;
}

@Injectable()
export class RecommendationsService {
  constructor(
    private prisma: PrismaService,
    private moviesService: MoviesService,
  ) {}

  /**
   * Get personalized recommendations for a user
   * This is a rule-based system that can be replaced with AI/ML in the future
   * 
   * The interface is modular - any recommendation engine implementing
   * getRecommendations(userId) can be swapped in
   */
  async getRecommendations(userId: string, limit: number = 10) {
    // Get user's interaction data
    const [ratings, watchHistory, favorites] = await Promise.all([
      this.prisma.rating.findMany({
        where: { userId },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.watchHistory.findMany({
        where: { userId },
        orderBy: { watchedAt: 'desc' },
      }),
      this.prisma.favorite.findMany({
        where: { userId },
      }),
    ]);

    // If user has insufficient data, return trending content
    if (ratings.length < 3) {
      return this.getTrendingRecommendations();
    }

    const recommendations: Recommendation[] = [];

    // 1. Genre-based recommendations
    const genreBasedRecs = await this.getGenreBasedRecommendations(watchHistory, ratings);
    recommendations.push(...genreBasedRecs);

    // 2. Similar to highly rated movies
    const similarRecs = await this.getSimilarToHighlyRated(ratings);
    recommendations.push(...similarRecs);

    // 3. Content type preference
    const contentTypeRecs = await this.getContentTypeRecommendations(watchHistory);
    recommendations.push(...contentTypeRecs);

    // Remove duplicates and sort by score
    const uniqueRecs = this.deduplicateRecommendations(recommendations);
    const sortedRecs = uniqueRecs.sort((a, b) => b.score - a.score);

    return {
      recommendations: sortedRecs.slice(0, limit),
      algorithm: 'rule-based-v1',
      userDataPoints: {
        ratings: ratings.length,
        watchHistory: watchHistory.length,
        favorites: favorites.length,
      },
    };
  }

  private async getGenreBasedRecommendations(watchHistory: any[], ratings: any[]): Promise<Recommendation[]> {
    // Analyze favorite genres
    const genreCount: Record<string, number> = {};
    
    watchHistory.forEach((item) => {
      const genres = item.genres ? item.genres.split(',').filter((g: string) => g.trim()) : [];
      genres.forEach((genre: string) => {
        const genreName = genre.trim();
        genreCount[genreName] = (genreCount[genreName] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    const recommendations: Recommendation[] = [];

    // For each top genre, get trending content
    for (const genre of topGenres) {
      const genreId = this.getGenreId(genre);
      if (genreId) {
        try {
          const genreMovies = await this.moviesService.getByGenre(genreId, 'movie', 1);
          
          genreMovies.results?.slice(0, 2).forEach((movie: any) => {
            recommendations.push({
              movieId: movie.id,
              movieType: 'movie',
              score: 0.8 + (movie.vote_average / 10) * 0.2,
              reason: `You've watched many ${genre} movies`,
              title: movie.title || movie.name,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
            });
          });
        } catch (error) {
          console.error('Error fetching genre recommendations:', error.message);
        }
      }
    }

    return recommendations;
  }

  private async getSimilarToHighlyRated(ratings: any[]): Promise<Recommendation[]> {
    // Get movies user rated 8 or higher
    const highlyRated = ratings.filter((r) => r.rating >= 8).slice(0, 3);

    const recommendations: Recommendation[] = [];

    for (const rated of highlyRated) {
      try {
        const similar = await this.moviesService.getSimilar(
          rated.movieId,
          rated.movieType,
          1,
        );

        similar.results?.slice(0, 2).forEach((movie: any) => {
          recommendations.push({
            movieId: movie.id,
            movieType: rated.movieType,
            score: 0.9,
            reason: `Similar to your highly rated content`,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
          });
        });
      } catch (error) {
        console.error('Error fetching similar recommendations:', error.message);
      }
    }

    return recommendations;
  }

  private async getContentTypeRecommendations(watchHistory: any[]): Promise<Recommendation[]> {
    const movieCount = watchHistory.filter((h) => h.movieType === 'movie').length;
    const tvCount = watchHistory.filter((h) => h.movieType === 'tv').length;

    // Recommend based on preferred content type
    const preferredType = movieCount >= tvCount ? 'movie' : 'tv';

    try {
      const trending = await this.moviesService.getTrending(preferredType, 1);

      return trending.results?.slice(0, 3).map((item: any) => ({
        movieId: item.id,
        movieType: preferredType,
        score: 0.7,
        reason: `Popular ${preferredType === 'tv' ? 'TV show' : 'movie'} you might enjoy`,
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
      })) || [];
    } catch (error) {
      console.error('Error fetching content type recommendations:', error.message);
      return [];
    }
  }

  private async getTrendingRecommendations() {
    try {
      const trending = await this.moviesService.getTrending('movie', 1);

      return {
        recommendations: trending.results?.slice(0, 10).map((movie: any) => ({
          movieId: movie.id,
          movieType: 'movie',
          score: movie.vote_average / 10,
          reason: 'Trending now - Rate more content for personalized recommendations',
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        })) || [],
        algorithm: 'trending-fallback',
        userDataPoints: {
          ratings: 0,
          watchHistory: 0,
          favorites: 0,
        },
      };
    } catch (error) {
      console.error('Error fetching trending recommendations:', error.message);
      return {
        recommendations: [],
        algorithm: 'error',
        userDataPoints: { ratings: 0, watchHistory: 0, favorites: 0 },
      };
    }
  }

  private deduplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const seen = new Set<string>();
    const unique: Recommendation[] = [];

    for (const rec of recommendations) {
      const key = `${rec.movieId}-${rec.movieType}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(rec);
      }
    }

    return unique;
  }

  private getGenreId(genreName: string): number | null {
    const genreMap: Record<string, number> = {
      'Action': 28,
      'Adventure': 12,
      'Animation': 16,
      'Comedy': 35,
      'Crime': 80,
      'Documentary': 99,
      'Drama': 18,
      'Family': 10751,
      'Fantasy': 14,
      'History': 36,
      'Horror': 27,
      'Music': 10402,
      'Mystery': 9648,
      'Romance': 10749,
      'Science Fiction': 878,
      'Thriller': 53,
      'War': 10752,
      'Western': 37,
    };

    return genreMap[genreName] || null;
  }
}
