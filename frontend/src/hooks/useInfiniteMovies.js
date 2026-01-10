import { useInfiniteQuery } from '@tanstack/react-query';
import { moviesService } from '../services';

/**
 * Custom hook for infinite scrolling/pagination of released movies/TV shows
 */
export function useInfiniteMovies({ type, genre, year, sortBy, country }) {
  return useInfiniteQuery({
    queryKey: ['movies', 'infinite', type, genre, year, sortBy, country],
    queryFn: ({ pageParam = 1 }) => {
      // Adjust sortBy for TV shows
      let adjustedSortBy = sortBy;
      if (type === 'tv' && sortBy) {
        adjustedSortBy = sortBy.replace('primary_release_date', 'first_air_date');
      }
      return moviesService.discoverReleased(type, genre, year, adjustedSortBy, pageParam, country);
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.total_pages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!type,
  });
}

/**
 * Custom hook for infinite scrolling of upcoming movies
 */
export function useInfiniteUpcoming({ type, genre, sortBy, country }) {
  return useInfiniteQuery({
    queryKey: ['movies', 'infinite', 'upcoming', type, genre, sortBy, country],
    queryFn: ({ pageParam = 1 }) => 
      moviesService.discoverUpcoming(type, genre, sortBy, pageParam, country),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.total_pages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!type,
  });
}
