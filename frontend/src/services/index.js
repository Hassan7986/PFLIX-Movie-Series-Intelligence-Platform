import api from './api';

export const authService = {
  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const moviesService = {
  discover: async (type = 'movie', genre = '', year = '', sortBy = 'primary_release_date.desc', page = 1) => {
    const response = await api.get('/movies/discover', {
      params: { type, genre, year, sort_by: sortBy, page },
    });
    return response.data;
  },

  discoverReleased: async (type = 'movie', genre = '', year = '', sortBy = '', page = 1, country = '') => {
    const today = new Date().toISOString().split('T')[0];
    // Default to newest first for released content
    const defaultSort = type === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc';
    const finalSort = sortBy || defaultSort;
    
    const params = { 
      type, 
      genre, 
      year, 
      sort_by: finalSort, 
      page,
      releaseDateLte: today,
      country,
    };
    
    const response = await api.get('/movies/discover', { params });
    return response.data;
  },

  discoverUpcoming: async (type = 'movie', genre = '', sortBy = '', page = 1, country = '') => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    // Default to soonest first for upcoming content
    const defaultSort = type === 'tv' ? 'first_air_date.asc' : 'primary_release_date.asc';
    const finalSort = sortBy || defaultSort;
    
    const params = { 
      type, 
      genre, 
      sort_by: finalSort, 
      page,
      releaseDateGte: tomorrowStr,
      country,
    };
    
    const response = await api.get('/movies/discover', { params });
    return response.data;
  },

  getTrending: async (type = 'movie', page = 1) => {
    const endpoint = type === 'tv' ? '/movies/tv/trending' : '/movies/trending';
    const response = await api.get(endpoint, { params: { page } });
    return response.data;
  },

  search: async (query, type = 'movie', page = 1) => {
    const response = await api.get('/movies/search', {
      params: { query, type, page },
    });
    return response.data;
  },

  getDetails: async (id, type = 'movie') => {
    const response = await api.get(`/movies/${id}`, { params: { type } });
    return response.data;
  },

  getSimilar: async (id, type = 'movie', page = 1) => {
    const response = await api.get(`/movies/${id}/similar`, {
      params: { type, page },
    });
    return response.data;
  },

  getByGenre: async (genreId, type = 'movie', page = 1) => {
    const response = await api.get(`/movies/genre/${genreId}`, {
      params: { type, page },
    });
    return response.data;
  },

  getWatchProviders: async (id, type = 'movie') => {
    const response = await api.get(`/movies/${id}/watch-providers`, {
      params: { type },
    });
    return response.data;
  },
};

export const interactionsService = {
  rateMovie: async (movieId, movieType, rating) => {
    const response = await api.post('/interactions/rate', {
      movieId,
      movieType,
      rating,
    });
    return response.data;
  },

  getRatings: async () => {
    const response = await api.get('/interactions/ratings');
    return response.data;
  },

  getRating: async (movieId, movieType) => {
    const response = await api.get('/interactions/rating', {
      params: { movieId, movieType },
    });
    return response.data;
  },

  toggleFavorite: async (movieId, movieType, movieTitle, posterPath) => {
    const response = await api.post('/interactions/favorite', {
      movieId,
      movieType,
      movieTitle,
      posterPath,
    });
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/interactions/favorites');
    return response.data;
  },

  isFavorite: async (movieId, movieType) => {
    const response = await api.get('/interactions/is-favorite', {
      params: { movieId, movieType },
    });
    return response.data;
  },

  addToWatchHistory: async (movieId, movieType, movieTitle, genres) => {
    const response = await api.post('/interactions/watch', {
      movieId,
      movieType,
      movieTitle,
      genres,
    });
    return response.data;
  },

  getWatchHistory: async (limit) => {
    const response = await api.get('/interactions/history', {
      params: limit ? { limit } : {},
    });
    return response.data;
  },
};

export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  getGenrePreferences: async () => {
    const response = await api.get('/analytics/genres');
    return response.data;
  },

  getRatingPatterns: async () => {
    const response = await api.get('/analytics/ratings');
    return response.data;
  },

  getViewingTrends: async () => {
    const response = await api.get('/analytics/trends');
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/analytics/insights');
    return response.data;
  },
};

export const recommendationsService = {
  getRecommendations: async (limit = 10) => {
    const response = await api.get('/recommendations', {
      params: { limit },
    });
    return response.data;
  },
};
