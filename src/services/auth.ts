/**
 * Mock Auth Service
 *
 * In production, replace these mocks with real API calls
 * (Firebase, Supabase, custom backend, etc.)
 *
 * For MVP demo, we provide:
 * - login(username, password): tries admin credentials, then user credentials
 * - loginAsAdmin(): quick mock admin login (for testing)
 * - loginAsUser(): quick mock user login (for testing)
 * - logout(): clears session
 *
 * Demo credentials:
 *   Admin:  admin / admin123
 *   User:   user / user123   (or any other username/password pair)
 */

import {User, UserRole} from '../types/auth';

const STORAGE_KEY = '@movies_stream_auth_user';

// === MOCK CREDENTIALS (replace with real auth backend in production) ===
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const USER_CREDENTIALS = {
  username: 'user',
  password: 'user123',
};

// === HELPER: create mock user object ===
const createUser = (
  username: string,
  role: UserRole,
  email?: string,
): User => ({
  id: `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  username,
  email: email || `${username}@zzz.app`,
  role,
  avatarUrl: undefined,
  createdAt: Date.now(),
});

// === AUTH SERVICE ===
export const MockAuthService = {
  /**
   * Validate username + password and return a user object on success.
   * Throws Error with message on failure.
   */
  async login(
    username: string,
    password: string,
  ): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check admin
    if (
      username.toLowerCase() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      return createUser('admin', 'admin', 'admin@zzz.app');
    }

    // Check regular user
    if (
      username.toLowerCase() === USER_CREDENTIALS.username &&
      password === USER_CREDENTIALS.password
    ) {
      return createUser('user', 'user', 'user@zzz.app');
    }

    // For demo purposes, allow any non-empty credentials as a regular user
    // (comment this out if you want strict credential checking)
    if (username.trim() && password.trim()) {
      return createUser(username.trim(), 'user', `${username.trim()}@zzz.app`);
    }

    throw new Error('Invalid username or password');
  },

  /**
   * Quick login as admin (for testing)
   */
  async loginAsAdmin(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return createUser('admin', 'admin', 'admin@zzz.app');
  },

  /**
   * Quick login as user (for testing)
   */
  async loginAsUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return createUser('user', 'user', 'user@zzz.app');
  },

  /**
   * Persist user to AsyncStorage (called by AuthContext)
   */
  async persistUser(user: User | null): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to persist auth user:', err);
    }
  },

  /**
   * Restore previously persisted user
   */
  async restoreUser(): Promise<User | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (err) {
      console.error('Failed to restore auth user:', err);
      return null;
    }
  },
};

export default MockAuthService;
