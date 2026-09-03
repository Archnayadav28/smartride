import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';
import { calculateProfileCompletion } from '../utils/profileCompletion';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        parsed.profileCompletion = calculateProfileCompletion(parsed);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('demo-jwt-token');
        const defaultUser = { ...mockUser, profileCompletion: calculateProfileCompletion(mockUser) };
        setUser(defaultUser);
      }
    } else {
      // Default to demo tourist session so user can immediately view the complete website
      setToken('demo-jwt-token');
      const defaultUser = { ...mockUser, profileCompletion: calculateProfileCompletion(mockUser) };
      setUser(defaultUser);
      localStorage.setItem('token', 'demo-jwt-token');
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, newToken: string) => {
    const userWithCompletion = {
      ...userData,
      profileCompletion: calculateProfileCompletion(userData)
    };
    setUser(userWithCompletion);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userWithCompletion));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...userData };
      merged.profileCompletion = calculateProfileCompletion(merged);
      setUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
