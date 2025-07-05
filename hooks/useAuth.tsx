// hooks/useAuth.ts
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('jubabuy_user');
    const storedToken = localStorage.getItem('jubabuy_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demo/development - replace with actual API call
      if (email === 'admin@ariesltd.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          email: 'admin@ariesltd.com',
          name: 'Admin User',
          role: 'admin'
        };
        
        // In production, you'd get a real token from your API
        const token = btoa(`${email}:${Date.now()}`);
        
        localStorage.setItem('jubabuy_user', JSON.stringify(userData));
        localStorage.setItem('jubabuy_token', token);
        setUser(userData);
        
        router.push('/admin');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jubabuy_user');
    localStorage.removeItem('jubabuy_token');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}