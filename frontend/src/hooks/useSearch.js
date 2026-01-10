import { useQuery } from '@tanstack/react-query';
import { moviesService } from '../services';

/**
 * Custom hook for searching movies and TV shows
 * Use with debounced search input for best performance
 */
export function useSearch(query, type = 'movie', page = 1) {
  return useQuery({
    queryKey: ['search', query, type, page],
    queryFn: () => moviesService.search(query, type, page),
    staleTime: 10 * 60 * 1000, // 10 minutes - search results are cached
    enabled: query.length >= 2, // Only search if query has at least 2 characters
  });
}
