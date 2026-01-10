import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook to get user analytics stats
 */
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get genre distribution
 */
export function useGenreDistribution() {
  return useQuery({
    queryKey: ['analytics', 'genres'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/genres`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get rating distribution
 */
export function useRatingDistribution() {
  return useQuery({
    queryKey: ['analytics', 'ratings'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get viewing trends
 */
export function useViewingTrends() {
  return useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/trends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to get AI insights
 */
export function useInsights() {
  return useQuery({
    queryKey: ['analytics', 'insights'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/insights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - insights don't change often
  });
}
