import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { API_BASE_URL, getAuthLoginUrl } from '../constants/app';

interface AuthContextProps {
  signed: boolean;
  loading: boolean;
  user: any | null;
  signIn: () => void;
  signOut: () => void;
  refreshSession: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  signed: false,
  loading: true,
  user: null,
  signIn: () => {},
  signOut: () => {},
  refreshSession: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- API helpers ---------- */

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/users/me`, {
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- actions ---------- */

  const signIn = useCallback(() => {
    window.location.href = getAuthLoginUrl(window.location.href);
  }, []);

  const signOut = useCallback(() => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
  }, []);

  const refreshSession = useCallback(() => {
    fetchSession();
  }, [fetchSession]);

  /* ---------- bootstrap ---------- */

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  /* ---------- context ---------- */

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        user,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
