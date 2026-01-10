import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [type, setType] = useState('movie');

  // Use search hook with submitted query
  const { data, isLoading } = useSearch(submittedQuery, type, 1);
  
  const results = data?.results || [];
  const totalResults = data?.total_results || 0;
  const searched = submittedQuery.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSubmittedQuery(searchQuery);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Search</h1>

        <form onSubmit={handleSearch} className="max-w-4xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for movies or TV shows..."
                className="input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input-field w-32"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
              <button type="submit" className="btn-primary px-8">
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : searched && results.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">
              Found {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} for "{submittedQuery}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {results.map((item) => (
                <MovieCard key={item.id} movie={item} type={type} />
              ))}
            </div>
          </>
        ) : searched && results.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-gray-400">Try searching with different keywords</p>
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Start Searching</h3>
            <p className="text-gray-400">
              Search through thousands of movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
