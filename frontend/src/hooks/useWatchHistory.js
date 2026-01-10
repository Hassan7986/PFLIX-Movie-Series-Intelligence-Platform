import { useQuery } from '@tanstack/react-query';
import { interactionsService } from '../services';

/**
 * Hook to get user's watch history
 */
export function useWatchHistory() {
  return useQuery({
    queryKey: ['watch-history'],
    queryFn: () => interactionsService.getWatchHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
