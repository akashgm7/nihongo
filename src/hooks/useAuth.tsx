"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  hearts: number;
  streak: number;
  level: number;
  lastHeartRefillTime?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  nextHeartIn: number | null; // ms
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextHeartIn, setNextHeartIn] = useState<number | null>(null);

  const RECOVERY_TIME_MS = 15 * 60 * 1000;

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/profile?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        const { progress, achievements, nextHeartIn: serverNextHeartIn, ...coreUser } = userData;
        setUser(coreUser);
        setNextHeartIn(serverNextHeartIn);
        localStorage.setItem('user', JSON.stringify(coreUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setTimeout(() => refreshUser(), 0);
    }
    setIsLoading(false);
  }, []);

  // Countdown timer for hearts
  useEffect(() => {
    if (nextHeartIn === null || (user && user.hearts >= 5)) {
      setNextHeartIn(null);
      return;
    }

    const interval = setInterval(() => {
      setNextHeartIn(prev => {
        if (prev === null) return null;
        if (prev <= 1000) {
          // Heart recovered! Refresh user data
          refreshUser();
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextHeartIn, user?.hearts]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (newData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...newData };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading, refreshUser, nextHeartIn }}>
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
