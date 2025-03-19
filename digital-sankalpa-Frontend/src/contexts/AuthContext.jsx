import { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const userData = await authApi.getUserProfile();
        setUser(userData);
      } catch (err) {
        // Token might be invalid, clear it
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authApi.register(userData);
      return { success: true, data: result };
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
      return { success: false, error: err.response?.data || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authApi.login(credentials);
      
      localStorage.setItem('token', result.access);
      localStorage.setItem('refreshToken', result.refresh);
      
      // Fetch user profile after successful login
      const userData = await authApi.getUserProfile();
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const result = await authApi.updateUserProfile(userData);
      setUser(result.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
      return { 
        success: false, 
        error: err.response?.data || 'Failed to update profile'
      };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await authApi.changePassword(passwordData);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data || 'Failed to change password'
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        initialized,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};