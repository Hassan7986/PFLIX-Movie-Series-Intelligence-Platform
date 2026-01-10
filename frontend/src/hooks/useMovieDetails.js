import { useQuery } from '@tanstack/react-query';
import { moviesService } from '../services';

/**
 * Custom hook for fetching movie/TV show details
 * Includes credits, videos, and similar content
 */
export function useMovieDetails(id, type = 'movie') {
  return useQuery({
    queryKey: ['movie', 'details', id, type],
    queryFn: () => moviesService.getDetails(parseInt(id), type),
    staleTime: 30 * 60 * 1000, // 30 minutes - movie details rarely change
    enabled: !!id, // Only run if id exists
  });
}

/**
 * Custom hook for fetching similar movies/TV shows
 */
export function useSimilarMovies(id, type = 'movie', page = 1) {
  return useQuery({
    queryKey: ['movie', 'similar', id, type, page],
    queryFn: () => moviesService.getSimilar(parseInt(id), type, page),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!id,
  });
}
