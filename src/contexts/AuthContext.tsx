'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth-status');
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error fetching auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStatus = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  return context;
};