import { useQuery } from '@tanstack/react-query';
import { moviesService } from '../services';

/**
 * Custom hook for fetching released movies/TV shows (Home page)
 * Automatically refetches when filters change
 */
export function useMovies({ type, genre, year, sortBy, page }) {
  return useQuery({
    queryKey: ['movies', type, genre, year, sortBy, page],
    queryFn: () => moviesService.discoverReleased(type, genre, year, sortBy, page),
    staleTime: 5 * 60 * 1000, // 5 minutes - movie lists don't change frequently
    enabled: !!type, // Only run query if type is provided
  });
}

/**
 * Custom hook for fetching upcoming movies/TV shows
 */
export function useUpcomingMovies({ type, genre, sortBy, page }) {
  return useQuery({
    queryKey: ['movies', 'upcoming', type, genre, sortBy, page],
    queryFn: () => moviesService.discoverUpcoming(type, genre, sortBy, page),
    staleTime: 10 * 60 * 1000, // 10 minutes - upcoming movies change less frequently
    enabled: !!type,
  });
}

/**
 * Custom hook for fetching trending content
 */
export function useTrending(type = 'movie', page = 1) {
  return useQuery({
    queryKey: ['movies', 'trending', type, page],
    queryFn: () => moviesService.getTrending(type, page),
    staleTime: 2 * 60 * 1000, // 2 minutes - trending updates frequently
  });
}
