import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/accounts/profile/')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/accounts/login/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/api/accounts/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/accounts/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' };
    }
  };

  const updateProfile = async (userData) => {
    const response = await api.put('/api/accounts/my/account/', userData);
    setUser(response.data);
    return response.data;
  };

  const changePassword = async (oldPassword, newPassword) => {
    const response = await api.post('/api/accounts/change-password/', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/api/accounts/profile/');
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading,
      updateProfile,
      changePassword,
      refreshUser,
      initialized: !loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const response = await api.get('/api/accounts/profile/');
      context.setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return {
    ...context,
    refreshUser,
  };
};