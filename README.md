# 🎬 AI-Enhanced Movie & Series Intelligence Platform (PFLIX)

## 🚀 Overview

PFLIX is an advanced movie and series intelligence platform that goes beyond simple browsing. It provides users with personalized insights, smart recommendations, and detailed analytics about their viewing preferences—all wrapped in a modern, responsive UI.

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Persistent session management

### 🎥 Movie & Series Discovery
- Browse trending movies and TV series
- Advanced search and filtering
- Detailed movie/series pages with cast, ratings, and trailers
- Integration with TMDB API (with mock fallback)

### 📊 Personal Insights Dashboard
- Watch history visualization
- Genre preference analytics
- Rating behavior patterns
- Viewing time statistics
- Smart unlock system (requires minimum interaction data)

### 🤖 Intelligent Recommendations
- Rule-based recommendation engine
- Multi-factor analysis (ratings, genres, viewing patterns)
- Modular architecture ready for AI integration
- Personalized suggestion explanations

### 💎 User Interactions
- Rating system (1-10 stars)
- Favorites/watchlist management
- Watch history tracking
- Optimistic UI updates

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** JavaScript (ESNext)
- **Styling:** Tailwind CSS 3
- **Routing:** React Router v6
- **State / Data:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Backend
- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** SQLite (development) via Prisma
- **ORM:** Prisma
- **Authentication:** JWT (Passport.js)
- **Validation:** class-validator

### Infrastructure & Architecture
- RESTful API architecture
- CORS-enabled
- Environment-based configuration
- Production-ready error handling

## 📁 Project Structure

```
PFLIX/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── movies/         # TMDB integration
│   │   ├── interactions/   # Ratings, favorites, history
│   │   ├── recommendations/ # Smart recommendation engine
│   │   ├── analytics/      # Insights & statistics
│   │   └── main.ts         # Application entry
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Sample data seeding
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   └── App.jsx         # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- TMDB API Key (optional - will use mock data if not provided)

### 1. Clone & Install

```bash
cd PFLIX
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment (Windows PowerShell example)
Copy-Item .env.example .env
# Then edit backend/.env with your secrets and TMDB key
```

**Environment Variables (backend/.env):**
```env
DATABASE_URL=# your own connection string
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
TMDB_API_KEY="your-tmdb-api-key-optional"
TMDB_BASE_URL="https://api.themoviedb.org/3"
PORT=3001
NODE_ENV="development"
```

> Note: The Prisma schema is currently configured for SQLite for local development. You can either:
> - Keep SQLite (no extra setup) using the default `file:./dev.db`, or
> - Switch the `datasource db` in `backend/prisma/schema.prisma` to PostgreSQL and point `DATABASE_URL` to your database.

**Database Setup:**
```bash
# Generate Prisma Client
npx prisma generate

# Create / migrate the database
npx prisma migrate dev --name init

# Seed sample data (optional but recommended for demo)
npx prisma db seed
```

**Start Backend:**
```bash
npm run start:dev
# Backend runs on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Configure environment (Windows PowerShell example)
Copy-Item .env.example .env
```

**Environment Variables (frontend/.env):**
```env
VITE_API_URL=http://localhost:3001
```

**Start Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Demo Credentials (if using seed data):**
- Email: `demo@pflix.com`
- Password: `password123`

## 🎯 Usage Guide

### First Time User
1. **Register** a new account or use demo credentials
2. **Browse** movies and series from the home page
3. **Interact** with content:
   - Rate movies (1-10 stars)
   - Add to favorites
   - Mark as watched
4. **Unlock Insights** - After rating 5+ items, visit the Insights Dashboard
5. **Get Recommendations** - Personalized suggestions based on your activity

### Key Pages
- **Home:** Browse trending content
- **Search:** Find specific movies/series
- **Details:** In-depth information, cast, trailers
- **Insights:** Your personal analytics dashboard
- **Recommendations:** AI-powered suggestions
- **Profile:** Manage your account

## 🏗️ Architecture Highlights

### Modular Design
- Clear separation of concerns (Auth, Movies, Analytics, Recommendations)
- Reusable services and components
- Dependency injection pattern (NestJS)

### AI-Ready Architecture
The recommendation engine is built with modularity in mind:
- **Current:** Rule-based algorithm analyzing user behavior
- **Future:** Can be swapped with ML models or external AI services
- Clean interface allows seamless integration

### Security
- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- Route guards on both frontend and backend
- Input validation and sanitization

### Performance
- Lazy loading for images
- Skeleton loaders for better UX
- Optimistic UI updates
- Efficient database queries with Prisma

### Error Handling
- Global error boundaries (React)
- Centralized exception filters (NestJS)
- User-friendly error messages
- Graceful API failure handling

## 📊 Database Schema

```prisma
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── name
├── ratings []
├── favorites []
├── watchHistory []

Rating
├── userId → User
├── movieId (TMDB ID)
├── rating (1-10)
├── movieType (movie/tv)

Favorite
├── userId → User
├── movieId (TMDB ID)
├── movieType

WatchHistory
├── userId → User
├── movieId (TMDB ID)
├── watchedAt
├── movieType
```

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register    - Register new user
POST   /auth/login       - Login user
GET    /auth/profile     - Get current user (protected)
```

### Movies
```
GET    /movies/trending          - Get trending movies
GET    /movies/search?query=     - Search movies
GET    /movies/:id               - Get movie details
GET    /movies/:id/similar       - Get similar movies
GET    /movies/tv/trending       - Get trending TV series
```

### Interactions
```
POST   /interactions/rate        - Rate a movie
GET    /interactions/ratings     - Get user's ratings
POST   /interactions/favorite    - Toggle favorite
GET    /interactions/favorites   - Get user's favorites
POST   /interactions/watch       - Mark as watched
GET    /interactions/history     - Get watch history
```

### Recommendations
```
GET    /recommendations          - Get personalized recommendations
```

### Analytics
```
GET    /analytics/stats          - Get user statistics
GET    /analytics/genres         - Genre preference breakdown
GET    /analytics/insights       - Comprehensive insights
```

## 🎨 UI/UX Features

- **Dark Theme:** Movie-focused aesthetic with cinematic feel
- **Responsive Design:** Mobile-first, works on all screen sizes
- **Smooth Animations:** Hover effects, transitions, loading states
- **Skeleton Loaders:** Better perceived performance
- **Empty States:** Helpful guidance when no data exists
- **Blur Locks:** Premium feature unveiling (Insights Dashboard)
- **Toast Notifications:** Real-time feedback
- **Error Boundaries:** Graceful error handling

## 🔮 Future AI Integration

The platform is architected to support advanced AI features:

### Planned AI Enhancements
1. **ML-Based Recommendations**
   - Collaborative filtering
   - Content-based filtering
   - Hybrid recommendation models

2. **Natural Language Search**
   - "Find romantic comedies with happy endings"
   - Semantic understanding of queries

3. **Sentiment Analysis**
   - Analyze user reviews
   - Emotion-based recommendations

4. **Trend Prediction**
   - Predict what users will want to watch next
   - Seasonal and cultural trend analysis

### Integration Strategy
The `RecommendationService` follows an interface pattern:
```typescript
interface IRecommendationEngine {
  getRecommendations(userId: string): Promise<Recommendation[]>
}
```

Simply implement this interface with:
- ML model endpoint
- External AI service
- TensorFlow.js integration
- Cloud AI APIs (OpenAI, Anthropic, etc.)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## 📦 Production Deployment

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'dist' folder with your preferred hosting
```

### Recommended Hosting
- **Backend:** Railway, Render, AWS ECS, DigitalOcean
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Database:** Railway PostgreSQL, Supabase, AWS RDS

## 🤝 Contributing

This is a portfolio project, but contributions are welcome! Please follow standard Git workflow:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - Free to use for learning and portfolio purposes.

## 👤 Author

Built as a senior full-stack developer portfolio project demonstrating:
- Modern React patterns
- NestJS best practices
- Database design with Prisma
- RESTful API architecture
- Production-ready code quality
- System design and scalability

## 🎓 Learning Resources

This project demonstrates:
- JWT authentication flow
- Protected route implementation
- API integration patterns
- State management (Context API)
- Component composition
- Database relationships
- Service layer architecture
- Error handling strategies
- Responsive design principles

---


For questions or feedback, please open an issue or contact the maintainer.
