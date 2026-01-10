import { IsNumber, IsString, IsInt, Min, Max } from 'class-validator';

export class RateMovieDto {
  @IsInt()
  movieId: number;

  @IsString()
  movieType: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;
}

export class FavoriteDto {
  @IsInt()
  movieId: number;

  @IsString()
  movieType: string;

  @IsString()
  movieTitle?: string;

  @IsString()
  posterPath?: string;
}

export class WatchHistoryDto {
  @IsInt()
  movieId: number;

  @IsString()
  movieType: string;

  @IsString()
  movieTitle?: string;

  genres?: string[];
}
