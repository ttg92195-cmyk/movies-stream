/**
 * TMDB API Service
 * Docs: https://developer.themoviedb.org/docs
 *
 * NOTE: Replace YOUR_TMDB_API_KEY below with your actual API key from
 * https://www.themoviedb.org/settings/api
 */

import axios, {AxiosInstance} from 'axios';
import {Movie, MovieResponse, Genre, MovieCategory} from '../types/movie';

// === CONFIGURATION ===
// Get your free API key at https://www.themoviedb.org/settings/api
export const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Image size presets
export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
};

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original',
};

const api: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// === HELPERS ===
export const getImageUrl = (
  path: string | null,
  size: keyof typeof POSTER_SIZES | keyof typeof BACKDROP_SIZES = 'medium',
): string => {
  if (!path) {
    return 'https://via.placeholder.com/342x513/141414/737373?text=No+Image';
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// === API METHODS ===
export const TMDBService = {
  /**
   * Fetch movies by category (trending, popular, top_rated, etc.)
   */
  async getByCategory(
    category: MovieCategory,
    page: number = 1,
  ): Promise<MovieResponse> {
    const endpoint =
      category === 'trending'
        ? '/trending/movie/week'
        : `/movie/${category}`;
    const {data} = await api.get<MovieResponse>(endpoint, {
      params: {page},
    });
    return data;
  },

  /**
   * Search movies by title
   */
  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const {data} = await api.get<MovieResponse>('/search/movie', {
      params: {query, page, include_adult: false},
    });
    return data;
  },

  /**
   * Discover movies by genre
   */
  async getByGenre(
    genreId: number,
    page: number = 1,
  ): Promise<MovieResponse> {
    const {data} = await api.get<MovieResponse>('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return data;
  },

  /**
   * Get full movie details (includes genres, runtime, etc.)
   */
  async getMovieDetails(movieId: number): Promise<Movie> {
    const {data} = await api.get<Movie>(`/movie/${movieId}`);
    return data;
  },

  /**
   * Get list of all movie genres
   */
  async getGenres(): Promise<Genre[]> {
    const {data} = await api.get<{genres: Genre[]}>('/genre/movie/list');
    return data.genres;
  },
};

export default TMDBService;
