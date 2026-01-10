import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook to get personalized recommendations
 */
export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
