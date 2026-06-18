/**
 * Favorites storage service using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {FavoriteItem, Movie} from '../types/movie';

const STORAGE_KEY = '@movies_stream_favorites';

export const FavoritesService = {
  async getAll(): Promise<FavoriteItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const list: FavoriteItem[] = JSON.parse(raw);
      // Sort by added_at desc (most recent first)
      return list.sort((a, b) => b.added_at - a.added_at);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      return [];
    }
  },

  async isFavorite(movieId: number): Promise<boolean> {
    const list = await this.getAll();
    return list.some(item => item.id === movieId);
  },

  async add(movie: Movie): Promise<void> {
    const list = await this.getAll();
    if (list.some(item => item.id === movie.id)) {
      return; // Already favorited
    }
    const newItem: FavoriteItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      added_at: Date.now(),
    };
    list.push(newItem);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  async remove(movieId: number): Promise<void> {
    const list = await this.getAll();
    const filtered = list.filter(item => item.id !== movieId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  async toggle(movie: Movie): Promise<boolean> {
    const isFav = await this.isFavorite(movie.id);
    if (isFav) {
      await this.remove(movie.id);
      return false;
    } else {
      await this.add(movie);
      return true;
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};

export default FavoritesService;
