import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { moviesService } from '../services';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const servicesRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setShowServicesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setSearching(true);
      try {
        const [movies, tv] = await Promise.all([
          moviesService.search(searchQuery, 'movie', 1),
          moviesService.search(searchQuery, 'tv', 1)
        ]);
        
        const combined = [
          ...(movies.results || []).slice(0, 5).map(m => ({ ...m, type: 'movie' })),
          ...(tv.results || []).slice(0, 5).map(t => ({ ...t, type: 'tv' }))
        ];
        
        setSearchResults(combined);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
      setSearching(false);
    };

    const debounce = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectMovie = (movie) => {
    navigate(`/movie/${movie.id}?type=${movie.type}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 sm:top-4 left-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-50 w-full sm:w-11/12 sm:max-w-6xl">
      <div className="bg-dark-900/95 backdrop-blur-lg border-0 sm:border border-dark-700 sm:rounded-2xl shadow-2xl px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary-600 flex-shrink-0">
            PFLIX
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 mx-8">
            <Link
              to="/?tab=movies"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/' && (new URLSearchParams(location.search).get('tab') === 'movies' || !new URLSearchParams(location.search).get('tab'))
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Movies
            </Link>
            <Link
              to="/?tab=tv"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/' && new URLSearchParams(location.search).get('tab') === 'tv'
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              TV Series
            </Link>
            <Link
              to="/?tab=upcoming"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/' && new URLSearchParams(location.search).get('tab') === 'upcoming'
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Upcoming
            </Link>
            
            {/* Services Dropdown - Only for authenticated users */}
            {isAuthenticated && (
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1 ${
                    ['/favorites', '/insights', '/recommendations'].includes(location.pathname)
                      ? 'text-white bg-primary-600' 
                      : 'text-gray-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <span>Services</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showServicesDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-dark-800 border border-dark-700 rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                    <Link
                      to="/favorites"
                      onClick={() => setShowServicesDropdown(false)}
                      className={`block px-4 py-2 transition-all ${
                        isActive('/favorites')
                          ? 'text-white bg-primary-600'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      Favorites
                    </Link>
                    <Link
                      to="/insights"
                      onClick={() => setShowServicesDropdown(false)}
                      className={`block px-4 py-2 transition-all ${
                        isActive('/insights')
                          ? 'text-white bg-primary-600'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      Insights
                    </Link>
                    <Link
                      to="/recommendations"
                      onClick={() => setShowServicesDropdown(false)}
                      className={`block px-4 py-2 transition-all ${
                        isActive('/recommendations')
                          ? 'text-white bg-primary-600'
                          : 'text-gray-300 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      Recommendations
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* About Us */}
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/about') 
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              About Us
            </Link>

            {/* Contact Us */}
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/contact') 
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar with Dropdown */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                  className="w-32 lg:w-64 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all text-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400"
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
              </div>

              {/* Search Dropdown */}
              {showDropdown && searchQuery.length >= 2 && (
                <div className="absolute top-full mt-2 w-72 lg:w-96 right-0 bg-dark-800 border border-dark-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                  {searching ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((movie) => (
                        <button
                          key={`${movie.id}-${movie.type}`}
                          onClick={() => handleSelectMovie(movie)}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left"
                        >
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : 'https://via.placeholder.com/92x138?text=No+Image'
                            }
                            alt={movie.title || movie.name}
                            className="w-10 h-15 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate text-sm">
                              {movie.title || movie.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {movie.type === 'movie' ? 'Movie' : 'TV Show'} • {(movie.release_date || movie.first_air_date || '').substring(0, 4) || 'N/A'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Menu / Auth Buttons - Desktop */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block text-gray-300 hover:text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-dark-800 transition-all text-sm"
              >
                Logout
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-dark-800 transition-all text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 lg:px-4 py-2 rounded-lg transition-all text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pt-4 border-t border-dark-700">
            <div className="space-y-2">
              {/* Tab Navigation */}
              <Link
                to="/?tab=movies"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/' && (new URLSearchParams(location.search).get('tab') === 'movies' || !new URLSearchParams(location.search).get('tab'))
                    ? 'text-white bg-primary-600'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                Movies
              </Link>
              <Link
                to="/?tab=tv"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/' && new URLSearchParams(location.search).get('tab') === 'tv'
                    ? 'text-white bg-primary-600'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                TV Series
              </Link>
              <Link
                to="/?tab=upcoming"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/' && new URLSearchParams(location.search).get('tab') === 'upcoming'
                    ? 'text-white bg-primary-600'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                Upcoming
              </Link>

              {/* Services - Only for authenticated users */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setShowMobileMenu(false)}
                    className={`block px-4 py-2 rounded-lg transition-all ${
                      isActive('/favorites')
                        ? 'text-white bg-primary-600'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    Favorites
                  </Link>
                  <Link
                    to="/insights"
                    onClick={() => setShowMobileMenu(false)}
                    className={`block px-4 py-2 rounded-lg transition-all ${
                      isActive('/insights')
                        ? 'text-white bg-primary-600'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    Insights
                  </Link>
                  <Link
                    to="/recommendations"
                    onClick={() => setShowMobileMenu(false)}
                    className={`block px-4 py-2 rounded-lg transition-all ${
                      isActive('/recommendations')
                        ? 'text-white bg-primary-600'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    Recommendations
                  </Link>
                </>
              )}

              {/* About & Contact */}
              <Link
                to="/about"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/about')
                    ? 'text-white bg-primary-600'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive('/contact')
                    ? 'text-white bg-primary-600'
                    : 'text-gray-300 hover:text-white hover:bg-dark-800'
                }`}
              >
                Contact Us
              </Link>

              {/* Auth buttons for mobile */}
              <div className="pt-2 mt-2 border-t border-dark-700 sm:hidden">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-800 transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-800 transition-all mb-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-all text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
