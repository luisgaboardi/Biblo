import { useCallback, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback((newToken: string, refreshToken?: string) => {
    localStorage.setItem('token', newToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setToken(null);
  }, []);

  return { token, login, logout, isAuthenticated: !!token };
}
