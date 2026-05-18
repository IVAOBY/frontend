import React, { createContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAuthLoginUrl } from '../constants/app';
import { useLogout, useMe } from '../hooks/query/useMe';
import { Me } from '../types/Me';

interface AuthContextType {
  signed: boolean;
  user: Me | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  signed: false,
  user: null,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useMe();
  const { mutate: logout } = useLogout();

  const signed = useMemo(() => !!user, [user]);

  const signIn = useCallback(() => {
    const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;
    window.location.href = getAuthLoginUrl(currentUrl);
  }, [location]);

  const signOut = useCallback(() => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/');
        window.location.reload();
      },
    });
  }, [logout, navigate]);

  const value = useMemo(
    () => ({
      signed,
      user,
      isLoading,
      signIn,
      signOut,
    }),
    [signed, user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}