'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  // Add other user properties as needed
}

interface Role {
  id: string;
  name: string;
  // Add other role properties as needed
}

interface AuthData {
  isAuthenticated: boolean;
  user: User | null;
  roles: Role[];
}

export const useAuthAndRoles = () => {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    roles: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthAndRoles = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user-roles');
        const data = await res.json();
        setAuthData({
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          roles: data.roles
        });
      } catch (error) {
        console.error('Error fetching auth and roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthAndRoles();
  }, []);

  return { ...authData, loading };
};