import { useQuery } from '@tanstack/react-query';
import { moviesService } from '../services';

/**
 * Hook to get watch providers for a movie/series
 */
export function useWatchProviders(movieId, movieType) {
  return useQuery({
    queryKey: ['watch-providers', movieId, movieType],
    queryFn: () => moviesService.getWatchProviders(parseInt(movieId), movieType),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - watch providers don't change often
    enabled: !!movieId,
  });
}
