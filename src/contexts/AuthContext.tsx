/**
 * AUTH CONTEXT - User Authentication & Identity
 * 
 * Pattern: CONTEXT × AUTH × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * 
 * Simple, elegant auth context following ThemeProvider pattern
 * 
 * ∞ AbëONE ∞
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface User {
  id: string;
  repId: string;
  territoryId: string;
  name?: string;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Use auth hook
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
