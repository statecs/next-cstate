'use client';

import { AuthProvider } from './AuthContext';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};