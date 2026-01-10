import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useMovieDetails, useSimilarMovies } from '../hooks/useMovieDetails';
import { useMovieRating, useRateMovie } from '../hooks/useRating';
import { useIsFavorite, useToggleFavorite } from '../hooks/useFavorites';
import { useWatchProviders } from '../hooks/useWatchProviders';
import { interactionsService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// All countries for streaming services
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MO', name: 'Macao', flag: '🇲🇴' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
];

// Mapping of provider IDs to their website URLs
const PROVIDER_URLS = {
  8: 'https://www.netflix.com',
  9: 'https://www.amazon.com/primevideo',
  337: 'https://www.disneyplus.com',
  350: 'https://tv.apple.com',
  384: 'https://www.hbomax.com',
  15: 'https://www.hulu.com',
  531: 'https://www.paramountplus.com',
  387: 'https://www.peacocktv.com',
  2: 'https://tv.apple.com',
  3: 'https://play.google.com/store/movies',
  10: 'https://www.amazon.com',
  192: 'https://www.youtube.com',
  7: 'https://www.vudu.com',
  68: 'https://www.microsoft.com/en-us/store/movies-and-tv',
  279: 'https://www.showtime.com',
  43: 'https://www.starz.com',
  257: 'https://www.fubo.tv',
  386: 'https://www.peacocktv.com',
  1899: 'https://www.max.com',
  283: 'https://www.crunchyroll.com',
  26: 'https://www.amc.com',
};

export default function MovieDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'movie';
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [hoveredRating, setHoveredRating] = useState(null);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem('preferredCountry') || '';
  });

  // Save country preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredCountry', selectedCountry);
  }, [selectedCountry]);

  // Fetch movie details using TanStack Query
  const { data: movie, isLoading: loadingMovie } = useMovieDetails(id, type);
  const { data: similarData } = useSimilarMovies(id, type);
  const { data: ratingData } = useMovieRating(id, type, { enabled: isAuthenticated });
  const { data: favoriteData } = useIsFavorite(id, type, { enabled: isAuthenticated });
  const { data: watchProvidersData } = useWatchProviders(id, type);

  // Mutations
  const rateMovieMutation = useRateMovie();
  const toggleFavoriteMutation = useToggleFavorite();

  const similar = similarData?.results || [];
  const userRating = ratingData?.rating || null;
  const isFavorite = favoriteData?.isFavorite || false;
  const loading = loadingMovie;

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      setErrorMessage('Please login to rate movies');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await rateMovieMutation.mutateAsync({
        movieId: parseInt(id),
        movieType: type,
        rating,
      });
      
      // Add to watch history
      const genres = movie.genres?.map(g => g.name) || [];
      await interactionsService.addToWatchHistory(
        parseInt(id),
        type,
        movie.title || movie.name,
        genres
      );
      
      setShowRatingInput(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error rating movie:', error);
      if (error.response?.status === 401) {
        setErrorMessage('Please login to rate movies');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage('Failed to rate movie. Please try again.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please login to add favorites');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await toggleFavoriteMutation.mutateAsync({
        movieId: parseInt(id),
        movieType: type,
        movieTitle: movie.title || movie.name,
        posterPath: movie.poster_path,
      });
      setErrorMessage('');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response?.status === 401) {
        setErrorMessage('Please login to add favorites');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage('Failed to update favorites. Please try again.');
      }
    }
  };

  // Helper function to get provider URL
  const getProviderUrl = (providerId) => {
    return PROVIDER_URLS[providerId] || watchProvidersData?.results?.US?.link || '#';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer');

  return (
    <div className="min-h-screen bg-dark-950 pt-16 sm:pt-0">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="fixed top-0 left-0 right-0 h-[50vh] sm:h-[70vh] overflow-hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950/20 via-dark-950/60 to-dark-950"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-8 sm:pb-12 pt-20 sm:pt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12 relative z-10">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-48 sm:w-64 rounded-xl overflow-hidden shadow-2xl border border-dark-800">
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={title}
                  className="w-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-dark-800 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {title}
            </h1>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Year:</span>
                <span className="font-semibold text-white">{year}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Runtime:</span>
                <span className="font-semibold text-white">
                  {movie.runtime && movie.runtime > 0 ? `${movie.runtime} min` : 'N/A'}
                </span>
              </div>
              {movie.vote_average !== undefined && movie.vote_average !== null && movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Rating:</span>
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <span className="text-yellow-500">★</span> {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-dark-800 border border-dark-700 text-gray-200 rounded-full text-sm font-medium hover:bg-dark-700 transition-colors"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            {isAuthenticated && (
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setShowRatingInput(!showRatingInput)}
                  className="btn-primary"
                >
                  {userRating ? `Your Rating: ${userRating}/10` : 'Rate This'}
                </button>
                <button onClick={handleToggleFavorite} className="btn-secondary">
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            )}

            {/* Rating Input */}
            {isAuthenticated && showRatingInput && (
              <div className="card p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Rate this {type}</h3>
                <div className="flex space-x-2">
                  {[...Array(10)].map((_, i) => {
                    const rating = i + 1;
                    return (
                      <button
                        key={rating}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleRate(rating)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          rating <= (hoveredRating || userRating || 0)
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                        }`}
                      >
                        {rating}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Watch Providers */}
            {watchProvidersData?.results && Object.keys(watchProvidersData.results).length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Where to Watch</h2>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-dark-800 border border-dark-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCountry ? (
                  watchProvidersData.results[selectedCountry] ? (
                  <div className="space-y-4">
                    {watchProvidersData.results[selectedCountry].flatrate && watchProvidersData.results[selectedCountry].flatrate.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-3">Stream</p>
                        <div className="flex flex-wrap gap-3">
                          {watchProvidersData.results[selectedCountry].flatrate.map((provider) => (
                            <a
                              key={provider.provider_id}
                              href={getProviderUrl(provider.provider_id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative"
                              title={`Watch on ${provider.provider_name}`}
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg transition-transform group-hover:scale-110 shadow-lg"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-primary-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {watchProvidersData.results[selectedCountry].rent && watchProvidersData.results[selectedCountry].rent.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-3">Rent</p>
                        <div className="flex flex-wrap gap-3">
                          {watchProvidersData.results[selectedCountry].rent.map((provider) => (
                            <a
                              key={provider.provider_id}
                              href={getProviderUrl(provider.provider_id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative"
                              title={`Rent on ${provider.provider_name}`}
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg transition-transform group-hover:scale-110 shadow-lg"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-primary-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {watchProvidersData.results[selectedCountry].buy && watchProvidersData.results[selectedCountry].buy.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-3">Buy</p>
                        <div className="flex flex-wrap gap-3">
                          {watchProvidersData.results[selectedCountry].buy.map((provider) => (
                            <a
                              key={provider.provider_id}
                              href={getProviderUrl(provider.provider_id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative"
                              title={`Buy on ${provider.provider_name}`}
                            >
                              <img
                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-lg transition-transform group-hover:scale-110 shadow-lg"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-primary-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No streaming providers available for {COUNTRIES.find(c => c.code === selectedCountry)?.name}</p>
                  )
                ) : (
                  <p className="text-gray-400 text-sm">Please select a country to see available streaming providers</p>
                )}
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {movie.release_date && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Release Date</p>
                  <p className="text-white font-semibold">{new Date(movie.release_date).toLocaleDateString()}</p>
                </div>
              )}
              {movie.first_air_date && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">First Air Date</p>
                  <p className="text-white font-semibold">{new Date(movie.first_air_date).toLocaleDateString()}</p>
                </div>
              )}
              {movie.status && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className="text-white font-semibold">{movie.status}</p>
                </div>
              )}
              {movie.vote_count !== undefined && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Total Votes</p>
                  <p className="text-white font-semibold">
                    {movie.vote_count > 0 ? movie.vote_count.toLocaleString() : 'No votes yet'}
                  </p>
                </div>
              )}
              {movie.budget > 0 && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Budget</p>
                  <p className="text-white font-semibold">${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className="bg-dark-900 border border-dark-800 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Revenue</p>
                  <p className="text-white font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="card p-4 text-center">
                  {actor.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-dark-800 rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-full h-full bg-dark-800 flex items-center justify-center text-gray-500 text-sm">No Image</div>
                    </div>
                  )}
                  <p className="text-white font-semibold text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer */}
        {trailer && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Trailer</h2>
            <div className="aspect-video card overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar {type === 'tv' ? 'Shows' : 'Movies'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {similar.slice(0, 6).map((item) => (
                <MovieCard key={item.id} movie={item} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
