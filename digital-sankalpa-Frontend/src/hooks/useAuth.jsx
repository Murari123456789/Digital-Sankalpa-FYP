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
      return {
        ...response.data,
        streak_points_earned: response.data.streak_points_earned || 0
      };
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
      // Even if the logout request fails, we should still clear local storage and user state
    } finally {
      // Always clear local storage and user state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/accounts/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response data:', error.response?.data);

      if (error.response?.data) {
        const errorData = error.response.data;

        // If the error data has error object
        if (errorData.error && typeof errorData.error === 'object') {
          // Check for username error
          if (errorData.error.username) {
            return { 
              success: false, 
              error: 'User already exists with this username'
            };
          }
          // Check for email error
          if (errorData.error.email) {
            return { 
              success: false, 
              error: 'User already exists with this email'
            };
          }
          // For other error messages in the error object
          const errorMessages = Object.values(errorData.error)
            .flat()
            .filter(msg => msg)
            .join(', ');
          if (errorMessages) {
            return { success: false, error: errorMessages };
          }
        }

        // If error data has a direct message
        if (errorData.message) {
          return { success: false, error: errorData.message };
        }
      }
      
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/accounts/profile/update/', userData);
      // Update the user state with the returned user data
      if (response.data.user) {
        setUser(response.data.user);
      }
      return { success: true, data: response.data, message: response.data.message };
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data) {
        return { success: false, error: error.response.data };
      }
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await api.post('/api/accounts/profile/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Password change error:', error);
      if (error.response?.data) {
        return { success: false, error: error.response.data };
      }
      return { success: false, error: 'Failed to change password. Please try again.' };
    }
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
  return context;
};