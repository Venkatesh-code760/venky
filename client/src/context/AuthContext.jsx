import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pathpilot_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('pathpilot_token');
      const storedUser = localStorage.getItem('pathpilot_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
          }
        } catch (err) {
          console.warn('[AuthContext] Session verification warning:', err.message);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: newToken, user: userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('pathpilot_token', newToken);
        localStorage.setItem('pathpilot_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        const { token: newToken, user: userData } = res.data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('pathpilot_token', newToken);
        localStorage.setItem('pathpilot_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration failed'
      };
    }
  };

  const quickDemoLogin = async () => {
    return login('demo@travelplanner.ai', 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pathpilot_token');
    localStorage.removeItem('pathpilot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
