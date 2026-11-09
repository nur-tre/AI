import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eduai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('eduai_token', receivedToken);
    localStorage.setItem('eduai_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (name, email, password, role = 'student', preferredLanguage = 'en') => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      role,
      preferredLanguage
    });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('eduai_token', receivedToken);
    localStorage.setItem('eduai_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    try {
      if (token) api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('eduai_token');
      localStorage.removeItem('eduai_user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('eduai_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        role: user?.role || 'guest',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
