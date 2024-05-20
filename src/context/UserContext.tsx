import React, { createContext, useCallback, useEffect, useState } from 'react';

import jwtDecode from 'jwt-decode';

import { DecodedTokenInt } from '../hooks/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  signed: boolean;
  token: string;
  decodedToken: DecodedTokenInt | null;
  signIn: (ivaoToken: string) => void;
  signOut: () => void;
  refreshToken: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  signed: false,
  token: '',
  decodedToken: null,
  signIn: () => {},
  signOut: () => {},
  refreshToken: () => {},
});

function removeTokenFromUrl() {
  if (window.history.replaceState) {
    const urlWithoutToken =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({}, document.title, urlWithoutToken);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string>(
    localStorage.getItem('token') || '',
  );
  const [decodedToken, setDecodedToken] = useState<DecodedTokenInt | null>(
    null,
  );

  const signIn = useCallback((ivaoToken: string) => {
    try {
      localStorage.setItem('token', ivaoToken);
      removeTokenFromUrl();
      setToken(ivaoToken);
    } catch (error) {
      console.error('Ошибка при аутентификации:', error);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    setToken('');
  }, []);

  const refreshToken = useCallback(() => {
    window.location.href = `https://${process.env.VITE_API_URL_BASE}/auth/login?goto=${encodeURIComponent(window.location.href)}`;
  }, []);

  useEffect(() => {
    if (!token) {
      setDecodedToken(null);
      return;
    }

    try {
      const currentTimestampSec = Math.floor(Date.now() / 1000);
      const decoded = jwtDecode<DecodedTokenInt>(token);

      if (currentTimestampSec > decoded.exp) {
        refreshToken();
      } else {
        const mappedToken: DecodedTokenInt = {
          iat: decoded.iat,
          exp: decoded.exp,
          userData: decoded.userData,
        };

        setDecodedToken(mappedToken);
      }
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      refreshToken();
    }
  }, [refreshToken, token]);

  const contextValue: AuthContextProps = {
    signIn,
    signOut,
    refreshToken,
    signed: !!token,
    token,
    decodedToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
