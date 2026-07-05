import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, signupRequest, logoutRequest, getMeRequest } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a session/token is already valid
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('freshcart_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMeRequest();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('freshcart_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem('freshcart_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password, phone) => {
    const data = await signupRequest({ name, email, password, phone });
    localStorage.setItem('freshcart_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      // even if the server call fails, clear local state
    }
    localStorage.removeItem('freshcart_token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = { user, loading, login, signup, logout, updateUser, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};