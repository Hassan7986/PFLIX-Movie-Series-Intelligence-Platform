import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionsService } from '../services';

/**
 * Hook to get user's rating for a specific movie
 */
export function useMovieRating(movieId, movieType, options = {}) {
  return useQuery({
    queryKey: ['rating', movieId, movieType],
    queryFn: () => interactionsService.getRating(parseInt(movieId), movieType),
    staleTime: 5 * 60 * 1000,
    enabled: !!movieId && (options.enabled !== false),
    retry: false, // Don't retry if no rating found
  });
}

/**
 * Hook to get all user ratings
 */
export function useUserRatings() {
  return useQuery({
    queryKey: ['ratings', 'user'],
    queryFn: () => interactionsService.getRatings(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Mutation hook to rate a movie
 * Automatically updates cache and adds to watch history
 */
export function useRateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, movieType, rating }) =>
      interactionsService.rateMovie(parseInt(movieId), movieType, rating),
    onSuccess: (data, variables) => {
      // Invalidate and refetch rating queries
      queryClient.invalidateQueries({ queryKey: ['rating', variables.movieId, variables.movieType] });
      queryClient.invalidateQueries({ queryKey: ['ratings', 'user'] });
      
      // Also invalidate watch history since rating adds to it
      queryClient.invalidateQueries({ queryKey: ['watch-history'] });
    },
  });
}

/**
 * Mutation hook to delete a rating
 */
export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, movieType }) =>
      interactionsService.deleteRating(parseInt(movieId), movieType),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rating', variables.movieId, variables.movieType] });
      queryClient.invalidateQueries({ queryKey: ['ratings', 'user'] });
    },
  });
}
