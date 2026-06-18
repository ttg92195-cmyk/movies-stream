/**
 * Auth Context Provider
 * - Wraps the app to expose auth state (user, role, isAuthenticated)
 * - Persists user across app restarts via AsyncStorage
 * - Provides login/logout methods
 */

import React, {createContext, useState, useEffect, useCallback} from 'react';
import {User, UserRole, AuthContextType} from '../types/auth';
import MockAuthService from '../services/auth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  role: 'guest' as UserRole,
  isLoading: true,
  login: async () => ({success: false, error: 'Not implemented'}),
  loginAsAdmin: async () => {},
  loginAsUser: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const restored = await MockAuthService.restoreUser();
      if (restored) {
        setUser(restored);
      }
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const u = await MockAuthService.login(username, password);
      setUser(u);
      await MockAuthService.persistUser(u);
      return {success: true};
    } catch (err: any) {
      return {success: false, error: err?.message || 'Login failed'};
    }
  }, []);

  const loginAsAdmin = useCallback(async () => {
    const u = await MockAuthService.loginAsAdmin();
    setUser(u);
    await MockAuthService.persistUser(u);
  }, []);

  const loginAsUser = useCallback(async () => {
    const u = await MockAuthService.loginAsUser();
    setUser(u);
    await MockAuthService.persistUser(u);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await MockAuthService.persistUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role || 'guest',
    isLoading,
    login,
    loginAsAdmin,
    loginAsUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
