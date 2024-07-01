'use client';

import { useState, useEffect } from 'react';

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth-status')
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching auth status:', error);
        setLoading(false);
      });
  }, []);

  return { isAuthenticated, loading };
};