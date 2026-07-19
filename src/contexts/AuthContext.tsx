'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CACHE_KEY = 'cs-auth-status';

/** Runs `fn` once the browser is idle, falling back to a short timeout. */
const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated immediately to prevent hydration mismatch
    setIsHydrated(true);

    // Seed from the last known value so repeat views render the right chrome
    // without waiting on the network. Always revalidated below.
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached !== null) {
      setIsAuthenticated(cached === 'true');
      setLoading(false);
    }

    const controller = new AbortController();

    const fetchAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth-status', { signal: controller.signal });
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
        sessionStorage.setItem(CACHE_KEY, String(data.isAuthenticated));
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
        console.error('Error fetching auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    // Keep the request off the critical path — it competes with fonts, images
    // and hydration otherwise, and nothing above the fold blocks on it.
    const cancelIdle = whenIdle(fetchAuthStatus);

    return () => {
      cancelIdle();
      controller.abort();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, isHydrated }}>
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