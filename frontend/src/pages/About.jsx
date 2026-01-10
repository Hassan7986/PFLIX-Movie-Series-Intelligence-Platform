export default function About() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-6">About PFLIX</h1>
        
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Welcome to PFLIX</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            PFLIX is your ultimate destination for discovering and exploring movies and TV shows. 
            With access to over 800,000 titles, we provide a comprehensive platform for movie 
            enthusiasts to find their next favorite content.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our platform leverages The Movie Database (TMDB) API to bring you the latest information, 
            ratings, and details about movies and TV series from around the world.
          </p>
        </div>

        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Vast Content Library</h3>
                <p className="text-gray-400">Browse through thousands of movies and TV shows with detailed information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Advanced Search</h3>
                <p className="text-gray-400">Find exactly what you're looking for with powerful search and filters</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Personal Ratings</h3>
                <p className="text-gray-400">Rate and review movies to track what you've watched</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">AI Recommendations</h3>
                <p className="text-gray-400">Get personalized suggestions based on your viewing history</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Viewing Insights</h3>
                <p className="text-gray-400">Discover trends and patterns in your movie preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            We aim to make movie discovery effortless and enjoyable. Whether you're looking for 
            the latest blockbusters, classic films, or hidden gems, PFLIX helps you find content 
            that matches your taste and keeps you entertained.
          </p>
        </div>
      </div>
    </div>
  );
}
