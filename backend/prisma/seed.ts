import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@pflix.com' },
    update: {},
    create: {
      email: 'demo@pflix.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample ratings
  const sampleRatings = [
    { movieId: 550, movieType: 'movie', rating: 9.5 }, // Fight Club
    { movieId: 238, movieType: 'movie', rating: 9.0 }, // The Godfather
    { movieId: 680, movieType: 'movie', rating: 8.5 }, // Pulp Fiction
    { movieId: 155, movieType: 'movie', rating: 9.2 }, // The Dark Knight
    { movieId: 13, movieType: 'movie', rating: 8.0 }, // Forrest Gump
    { movieId: 122, movieType: 'movie', rating: 8.8 }, // The Lord of the Rings
    { movieId: 1396, movieType: 'tv', rating: 9.5 }, // Breaking Bad
    { movieId: 1399, movieType: 'tv', rating: 9.0 }, // Game of Thrones
  ];

  for (const rating of sampleRatings) {
    await prisma.rating.upsert({
      where: {
        userId_movieId_movieType: {
          userId: demoUser.id,
          movieId: rating.movieId,
          movieType: rating.movieType,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        movieId: rating.movieId,
        movieType: rating.movieType,
        rating: rating.rating,
      },
    });
  }

  console.log('✅ Created sample ratings');

  // Create sample favorites
  const sampleFavorites = [
    { movieId: 550, movieType: 'movie', movieTitle: 'Fight Club', posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { movieId: 155, movieType: 'movie', movieTitle: 'The Dark Knight', posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { movieId: 1396, movieType: 'tv', movieTitle: 'Breaking Bad', posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  ];

  for (const fav of sampleFavorites) {
    await prisma.favorite.upsert({
      where: {
        userId_movieId_movieType: {
          userId: demoUser.id,
          movieId: fav.movieId,
          movieType: fav.movieType,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        movieId: fav.movieId,
        movieType: fav.movieType,
        movieTitle: fav.movieTitle,
        posterPath: fav.posterPath,
      },
    });
  }

  console.log('[SEED] Created sample favorites');

  // Create watch history
  const sampleHistory = [
    { movieId: 550, movieType: 'movie', movieTitle: 'Fight Club', genres: ['Drama', 'Thriller'] },
    { movieId: 238, movieType: 'movie', movieTitle: 'The Godfather', genres: ['Drama', 'Crime'] },
    { movieId: 680, movieType: 'movie', movieTitle: 'Pulp Fiction', genres: ['Crime', 'Drama'] },
    { movieId: 155, movieType: 'movie', movieTitle: 'The Dark Knight', genres: ['Action', 'Crime', 'Drama'] },
    { movieId: 13, movieType: 'movie', movieTitle: 'Forrest Gump', genres: ['Drama', 'Romance'] },
    { movieId: 122, movieType: 'movie', movieTitle: 'The Lord of the Rings', genres: ['Adventure', 'Fantasy'] },
    { movieId: 98, movieType: 'movie', movieTitle: 'Gladiator', genres: ['Action', 'Drama'] },
    { movieId: 497, movieType: 'movie', movieTitle: 'The Green Mile', genres: ['Drama', 'Fantasy'] },
    { movieId: 1396, movieType: 'tv', movieTitle: 'Breaking Bad', genres: ['Drama', 'Crime'] },
    { movieId: 1399, movieType: 'tv', movieTitle: 'Game of Thrones', genres: ['Drama', 'Fantasy'] },
  ];

  for (const history of sampleHistory) {
    await prisma.watchHistory.create({
      data: {
        userId: demoUser.id,
        movieId: history.movieId,
        movieType: history.movieType,
        movieTitle: history.movieTitle,
        genres: history.genres.join(','),
        watchedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });
  }

  console.log('[SEED] Created sample watch history');

  console.log('[SEED] Seed completed successfully!');
  console.log('\n[INFO] Demo credentials:');
  console.log('   Email: demo@pflix.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
