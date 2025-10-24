import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/auth';

// Create context
export const AuthContext = createContext();

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(true);

  // Set authorization header untuk axios
  useEffect(() => {
    if (token) {
      // Anda bisa menambahkan interceptor axios di sini jika diperlukan
      console.log('Token set:', token);
    }
  }, [token]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Jika ada token, coba dapatkan profile user
          const response = await authService.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.access_token) {
        setToken(response.access_token);
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.access_token) {
        setToken(response.access_token);
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};