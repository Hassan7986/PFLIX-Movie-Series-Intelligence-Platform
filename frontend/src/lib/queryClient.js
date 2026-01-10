import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized configuration for PFLIX
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh (no refetch)
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // How long inactive data stays in cache before garbage collection
      cacheTime: 10 * 60 * 1000, // 10 minutes
      
      // Refetch when window regains focus
      refetchOnWindowFocus: false,
      
      // Refetch when network reconnects
      refetchOnReconnect: true,
      
      // Retry failed requests
      retry: 1,
      
      // Show cached data while fetching fresh data
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
