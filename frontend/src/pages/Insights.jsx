import { useInsights } from '../hooks/useAnalytics';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'];

export default function Insights() {
  const { data: insights, isLoading: loading } = useInsights();
  
  const locked = insights && !insights.stats?.hasSufficientData;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-dark-950">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Insights Dashboard</h1>

          <div className="relative">
            {/* Blurred Preview */}
            <div className="filter blur-sm pointer-events-none select-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Total Ratings</h3>
                  <p className="text-4xl font-bold text-white">12</p>
                </div>
                <div className="card p-6">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Movies Watched</h3>
                  <p className="text-4xl font-bold text-white">8</p>
                </div>
                <div className="card p-6">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Avg Rating</h3>
                  <p className="text-4xl font-bold text-white">8.5</p>
                </div>
              </div>
            </div>

            {/* Unlock Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="card p-8 max-w-lg text-center backdrop-blur-xl bg-dark-900/80">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Unlock Your Insights</h2>
                <p className="text-gray-300 mb-6">
                  To access your personalized insights dashboard, you need to:
                </p>
                <div className="space-y-3 mb-6 text-left">
                  <div className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span className="text-gray-300">
                      Rate at least{' '}
                      <span className="text-white font-semibold">
                        {insights?.stats.minimumRequired.ratings} movies or shows
                      </span>
                      <span className="text-gray-500">
                        {' '}
                        ({insights?.stats.totalRatings}/{insights?.stats.minimumRequired.ratings})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span className="text-gray-300">
                      Watch at least{' '}
                      <span className="text-white font-semibold">
                        {insights?.stats.minimumRequired.watchHistory} items
                      </span>
                      <span className="text-gray-500">
                        {' '}
                        ({insights?.stats.totalWatched}/{insights?.stats.minimumRequired.watchHistory})
                      </span>
                    </span>
                  </div>
                </div>
                <Link to="/" className="btn-primary inline-block">
                  Start Exploring Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const genreData = insights.genres.topGenres.map((g) => ({
    name: g.genre,
    value: g.count,
    percentage: g.percentage,
  }));

  const ratingDistData = [
    { name: 'Low (1-3)', value: insights.ratings.distribution.low },
    { name: 'Medium (4-6)', value: insights.ratings.distribution.medium },
    { name: 'High (7-8)', value: insights.ratings.distribution.high },
    { name: 'Excellent (9-10)', value: insights.ratings.distribution.excellent },
  ].filter((d) => d.value > 0);

  const dayOfWeekData = Object.entries(insights.trends.dayOfWeekPreference).map(([day, count]) => ({
    day: day.substring(0, 3),
    count,
  }));

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Insights</h1>
          <p className="text-gray-400">Discover your viewing patterns and preferences</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Ratings</h3>
            <p className="text-4xl font-bold text-white">{insights.stats.totalRatings}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Movies Watched</h3>
            <p className="text-4xl font-bold text-white">{insights.stats.totalWatched}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Favorites</h3>
            <p className="text-4xl font-bold text-white">{insights.stats.totalFavorites}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Avg Rating</h3>
            <p className="text-4xl font-bold text-white">{insights.ratings.averageRating}</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Genre Preferences */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Genre Preferences</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Day of Week Preference */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Viewing by Day</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayOfWeekData}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Content Type Preference */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Content Preference</h2>
            <div className="flex items-center justify-center h-[300px]">
              <div className="w-full max-w-sm space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Movies</span>
                    <span className="text-white font-bold">
                      {insights.trends.contentTypePreference.moviePercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-4">
                    <div
                      className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${insights.trends.contentTypePreference.moviePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {insights.trends.contentTypePreference.movies} watched
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">TV Shows</span>
                    <span className="text-white font-bold">
                      {insights.trends.contentTypePreference.tvPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${insights.trends.contentTypePreference.tvPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {insights.trends.contentTypePreference.tvShows} watched
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
