import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('TMDB_API_KEY') || '';
    this.baseUrl = this.configService.get('TMDB_BASE_URL') || 'https://api.themoviedb.org/3';

    if (!this.apiKey) {
      console.error('TMDB_API_KEY is not configured. Please add it to your .env file.');
    }
  }

  async getTrending(mediaType: 'movie' | 'tv' = 'movie', page: number = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/trending/${mediaType}/week`,
        {
          params: {
            api_key: this.apiKey,
            page,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch trending content',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async discover(
    mediaType: 'movie' | 'tv' = 'movie',
    genre?: string,
    year?: string,
    sortBy: string = 'primary_release_date.desc',
    page: number = 1,
    releaseDateLte?: string,
    releaseDateGte?: string,
    country?: string,
  ) {
    try {
      const params: any = {
        api_key: this.apiKey,
        sort_by: sortBy,
        page,
      };

      if (genre) {
        params.with_genres = genre;
      }

      if (year) {
        if (mediaType === 'movie') {
          params.primary_release_year = year;
        } else {
          params.first_air_date_year = year;
        }
      }

      if (country) {
        params.with_origin_country = country;
      }

      // Filter by release date
      if (releaseDateLte) {
        if (mediaType === 'movie') {
          params['primary_release_date.lte'] = releaseDateLte;
        } else {
          params['first_air_date.lte'] = releaseDateLte;
        }
      }

      if (releaseDateGte) {
        if (mediaType === 'movie') {
          params['primary_release_date.gte'] = releaseDateGte;
        } else {
          params['first_air_date.gte'] = releaseDateGte;
        }
      }

      const response = await axios.get(
        `${this.baseUrl}/discover/${mediaType}`,
        { params },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to discover content',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async search(query: string, mediaType: 'movie' | 'tv' = 'movie', page: number = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/search/${mediaType}`,
        {
          params: {
            api_key: this.apiKey,
            query,
            page,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to search content',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getDetails(id: number, mediaType: 'movie' | 'tv' = 'movie') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaType}/${id}`,
        {
          params: {
            api_key: this.apiKey,
            append_to_response: 'credits,videos,similar',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch content details',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getSimilar(id: number, mediaType: 'movie' | 'tv' = 'movie', page: number = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaType}/${id}/similar`,
        {
          params: {
            api_key: this.apiKey,
            page,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch similar content',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getByGenre(genreId: number, mediaType: 'movie' | 'tv' = 'movie', page: number = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/discover/${mediaType}`,
        {
          params: {
            api_key: this.apiKey,
            with_genres: genreId,
            page,
            sort_by: 'popularity.desc',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch content by genre',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getWatchProviders(id: number, mediaType: 'movie' | 'tv' = 'movie') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${mediaType}/${id}/watch/providers`,
        {
          params: {
            api_key: this.apiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch watch providers',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
