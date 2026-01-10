import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Favorites() {
  // Fetch favorites using TanStack Query
  const { data: favorites = [], isLoading: loading } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleRemove = async (movieId, movieType, movieTitle, posterPath) => {
    try {
      await toggleFavoriteMutation.mutateAsync({
        movieId,
        movieType,
        movieTitle,
        posterPath,
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">My Favorites</h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {favorites.map((fav) => (
              <div key={`${fav.movieId}-${fav.movieType}`} className="relative group">
                <Link
                  to={`/movie/${fav.movieId}?type=${fav.movieType}`}
                  className="card overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 block"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-dark-800">
                    {fav.posterPath ? (
                      <img
                        src={`${IMAGE_BASE_URL}${fav.posterPath}`}
                        alt={fav.movieTitle}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold line-clamp-2">{fav.movieTitle}</h3>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(fav.movieId, fav.movieType, fav.movieTitle, fav.posterPath);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from favorites"
                  disabled={toggleFavoriteMutation.isPending}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card p-8 max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
            <p className="text-gray-400 mb-6">
              Start adding movies and TV shows to your favorites
            </p>
            <Link to="/" className="btn-primary inline-block">
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
