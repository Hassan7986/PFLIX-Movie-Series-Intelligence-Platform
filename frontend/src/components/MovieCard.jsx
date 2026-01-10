import { Link } from 'react-router-dom';
import { useState } from 'react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, type = 'movie' }) {
  const [imageError, setImageError] = useState(false);
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <Link
      to={`/movie/${movie.id}?type=${type}`}
      className="card overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-dark-800">
        {!imageError && movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-600">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-dark-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-white">
            {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-1 mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{year}</p>
      </div>
    </Link>
  );
}
