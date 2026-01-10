import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteMovies, useInfiniteUpcoming } from '../hooks/useInfiniteMovies';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';

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

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'movies';
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem('preferredCountry') || '';
  });

  // Save country preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredCountry', selectedCountry);
  }, [selectedCountry]);

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Determine which query to use based on active tab
  const type = activeTab === 'movies' ? 'movie' : activeTab === 'tv' ? 'tv' : 'movie';
  
  // Use infinite query for released or upcoming content
  const releasedQuery = useInfiniteMovies({
    type,
    genre: selectedGenre,
    year: selectedYear,
    sortBy,
    country: selectedCountry,
  });

  const upcomingQuery = useInfiniteUpcoming({
    type: 'movie',
    genre: selectedGenre,
    sortBy,
    country: selectedCountry,
  });

  // Select the appropriate query based on tab
  const activeQuery = activeTab === 'upcoming' ? upcomingQuery : releasedQuery;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = activeQuery;

  // Flatten all pages into a single array
  const content = data?.pages?.flatMap(page => page.results) || [];
  const totalPages = data?.pages?.[0]?.total_pages || 1;

  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSortBy('');
    setSelectedCountry('');
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-16 sm:pt-24">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Discover Movies & TV Shows
          </h1>
          <p className="text-base sm:text-xl text-gray-400 mx-auto px-4">
            Explore thousands of titles with advanced filters and sorting
          </p>
        </div>

        {/* Filters */}
        <div className="bg-dark-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-dark-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter - Hide for Upcoming tab */}
            {activeTab !== 'upcoming' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {activeTab === 'upcoming' ? (
                  <>
                    <option value="primary_release_date.asc">Releasing Soon</option>
                    <option value="primary_release_date.desc">Releasing Later</option>
                    <option value="popularity.desc">Most Popular</option>
                  </>
                ) : (
                  <>
                    <option value="title.asc">A-Z (Alphabetical)</option>
                    <option value="title.desc">Z-A (Reverse)</option>
                    <option value="primary_release_date.desc">Newest First</option>
                    <option value="primary_release_date.asc">Oldest First</option>
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="vote_count.desc">Most Voted</option>
                  </>
                )}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-lg transition-all border border-dark-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : content.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {content.map((item) => (
                <MovieCard key={item.id} movie={item} type={type} />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-8 sm:mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="btn-primary px-6 sm:px-8 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base sm:text-lg">No content available</p>
          </div>
        )}
      </div>
    </div>
  );
}
