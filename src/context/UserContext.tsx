import { createContext } from 'react';
import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getAuthLoginUrl } from '../constants/app';
import { useMe, useLogout } from '../hooks/query/useMe';
import { Me } from '../types/Me';

interface AuthContextProps {
  signed: boolean;
  loading: boolean;
  user: Me | null;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  signed: false,
  loading: true,
  user: null,
  signIn: () => {},
  signOut: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useMe();

  const { mutate: logout } = useLogout();

  const signIn = useCallback(() => {
    window.location.href = getAuthLoginUrl(window.location.href);
  }, []);

  const signOut = useCallback(() => {
    logout(undefined, {
      onSettled: () => {
        queryClient.removeQueries({ queryKey: ['me'] });
      },
    });
  }, [logout, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user && !isError,
        loading: isLoading,
        user: isError ? null : user ?? null,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
