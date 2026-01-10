import { useRecommendations } from '../hooks/useRecommendations';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

export default function Recommendations() {
  const { data, isLoading } = useRecommendations();
  
  const recommendations = data?.recommendations || [];
  const algorithm = data?.algorithm;
  const userDataPoints = data?.userDataPoints;

  // Convert recommendation to movie object format
  const toMovieFormat = (rec) => ({
    id: rec.movieId,
    title: rec.title,
    poster_path: rec.poster_path,
    vote_average: rec.vote_average,
  });

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Recommendations</h1>
          <p className="text-gray-400">Personalized picks just for you</p>
        </div>

        {/* Algorithm Info */}
        {userDataPoints && (
          <div className="card p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {algorithm === 'trending-fallback'
                    ? '🔥 Trending Now'
                    : '🤖 Personalized for You'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {algorithm === 'trending-fallback'
                    ? 'Rate more content to unlock personalized recommendations'
                    : 'Based on your viewing history and preferences'}
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary-600">{userDataPoints.ratings}</p>
                  <p className="text-gray-500 text-xs">Ratings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">{userDataPoints.watchHistory}</p>
                  <p className="text-gray-500 text-xs">Watched</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">{userDataPoints.favorites}</p>
                  <p className="text-gray-500 text-xs">Favorites</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div>
            {/* Group by reason if personalized */}
            {algorithm !== 'trending-fallback' ? (
              <div className="space-y-8">
                {/* Get unique reasons */}
                {[...new Set(recommendations.map((r) => r.reason))].map((reason) => {
                  const recsByReason = recommendations.filter((r) => r.reason === reason);
                  return (
                    <div key={reason}>
                      <h2 className="text-xl font-bold text-white mb-4">{reason}</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {recsByReason.map((rec) => (
                          <MovieCard
                            key={`${rec.movieId}-${rec.movieType}`}
                            movie={toMovieFormat(rec)}
                            type={rec.movieType}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {recommendations.map((rec) => (
                  <MovieCard
                    key={`${rec.movieId}-${rec.movieType}`}
                    movie={toMovieFormat(rec)}
                    type={rec.movieType}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 card p-8 max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
            <p className="text-gray-400">Start rating and watching content to get personalized recommendations</p>
          </div>
        )}

        {/* Future AI Badge */}
        {algorithm !== 'trending-fallback' && (
          <div className="mt-12 card p-6 border-2 border-primary-600/30">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Ready Architecture</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Currently using rule-based recommendations. The system is architected to seamlessly integrate
                  advanced AI models for even smarter suggestions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 bg-dark-800 text-gray-400 rounded-full">
                    Collaborative Filtering
                  </span>
                  <span className="text-xs px-3 py-1 bg-dark-800 text-gray-400 rounded-full">
                    Content-Based ML
                  </span>
                  <span className="text-xs px-3 py-1 bg-dark-800 text-gray-400 rounded-full">
                    Neural Networks
                  </span>
                  <span className="text-xs px-3 py-1 bg-dark-800 text-gray-400 rounded-full">
                    LLM Integration
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
