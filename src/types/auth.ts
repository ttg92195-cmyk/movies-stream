/**
 * Auth Types
 * - Guest: not logged in (default)
 * - User: registered user, can use Profile + Logout
 * - Admin: full access, including Admin Panel + TMDB Generator
 */

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{success: boolean; error?: string}>;
  loginAsAdmin: () => Promise<void>;
  loginAsUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
