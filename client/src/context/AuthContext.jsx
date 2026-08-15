import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tableturn_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tableturn_favs') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('tableturn_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tableturn_user');
      }
    }
  }, [token]);

  const saveAuthSession = (authData) => {
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('tableturn_token', authData.token);
    localStorage.setItem('tableturn_user', JSON.stringify(authData.user));
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      saveAuthSession(res);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success) {
      saveAuthSession(res);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tableturn_token');
    localStorage.removeItem('tableturn_user');
  };

  const toggleFavorite = async (restaurantId) => {
    // Optimistic UI update
    setFavorites((prev) => {
      let updated;
      if (prev.includes(restaurantId)) {
        updated = prev.filter((id) => id !== restaurantId);
      } else {
        updated = [...prev, restaurantId];
      }
      localStorage.setItem('tableturn_favs', JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await api.toggleFavorite(restaurantId);
      } catch (e) {
        console.warn('Favorite sync warning:', e.message);
      }
    }
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('tableturn_user', JSON.stringify(res.user));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal: (mode = 'login') => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        register,
        logout,
        favorites,
        toggleFavorite,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

