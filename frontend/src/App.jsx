import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Lazy load page components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Insights = lazy(() => import('./pages/Insights'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-400 text-lg">Loading...</p>
    </div>
  </div>
);

// Layout component that conditionally shows navbar
function Layout({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-dark-950">
      {shouldShowNavbar && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected routes - require authentication */}
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/insights"
                  element={
                    <ProtectedRoute>
                      <Insights />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </Router>
      
      {/* React Query DevTools - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
