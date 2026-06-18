/**
 * Movie-related TypeScript types
 */

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  // Custom field for self-hosted streaming URL
  video_url?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface VideoSource {
  id: number;
  title: string;
  url: string;
  description?: string;
}

export type MovieCategory =
  | 'trending'
  | 'popular'
  | 'top_rated'
  | 'now_playing'
  | 'upcoming';

export interface Category {
  key: MovieCategory;
  label: string;
  icon: string;
}

export interface FavoriteItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  added_at: number;
}
