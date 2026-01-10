import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionsService } from '../services';

/**
 * Hook to check if a movie is favorited
 */
export function useIsFavorite(movieId, movieType, options = {}) {
  return useQuery({
    queryKey: ['favorite', 'status', movieId, movieType],
    queryFn: () => interactionsService.isFavorite(parseInt(movieId), movieType),
    staleTime: 5 * 60 * 1000,
    enabled: !!movieId && (options.enabled !== false),
  });
}

/**
 * Hook to get all user favorites
 */
export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => interactionsService.getFavorites(),
    staleTime: 2 * 60 * 1000, // 2 minutes - user's favorites might change
  });
}

/**
 * Mutation hook to toggle favorite status
 * Includes optimistic updates for instant UI feedback
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, movieType, movieTitle, posterPath }) =>
      interactionsService.toggleFavorite(
        parseInt(movieId),
        movieType,
        movieTitle,
        posterPath
      ),
    onMutate: async ({ movieId, movieType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorite', 'status', movieId, movieType] });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['favorite', 'status', movieId, movieType]);

      // Optimistically update to the new value
      queryClient.setQueryData(['favorite', 'status', movieId, movieType], (old) => ({
        isFavorite: !old?.isFavorite,
      }));

      return { previousStatus };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['favorite', 'status', variables.movieId, variables.movieType],
        context.previousStatus
      );
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure we're in sync with server
      queryClient.invalidateQueries({ queryKey: ['favorite', 'status', variables.movieId, variables.movieType] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
