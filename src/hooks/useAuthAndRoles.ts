// useAuthAndRoles.ts
'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom, rolesAtom } from '@/utils/store';

interface User {
  id: string;
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
  properties: Record<string, unknown>;
}

interface Role {
  id: string;
  key: string;
  name: string;
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
  const [, setUser] = useAtom(userAtom);
  const [, setRoles] = useAtom(rolesAtom);

  useEffect(() => {
    const fetchAuthAndRoles = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user-roles');
        const data = await res.json();
        setAuthData({
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          roles: data.roles.roles
        });
        setUser(data.user);
        setRoles(data.roles.roles);
      } catch (error) {
        console.error('Error fetching auth and roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthAndRoles();
  }, [setUser, setRoles]);

  return { ...authData, loading };
};