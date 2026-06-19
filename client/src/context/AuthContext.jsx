import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore the session if a token is present.
  useEffect(() => {
    const token = localStorage.getItem('propspace_token');
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    api
      .get('/auth/me')
      .then(({ data }) => active && setUser(data.user))
      .catch(() => localStorage.removeItem('propspace_token'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const persist = (data) => {
    localStorage.setItem('propspace_token', data.token);
    setUser(data.user);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('propspace_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
