import api from './api';

// Register a new user
export const register = async (userData) => {
  const response = await api.post('/api/accounts/register/', userData);
  return response.data;
};

// Login user and get JWT token
export const login = async (credentials) => {
  const response = await api.post('/api/accounts/login/', credentials);
  return response.data;
};

// Refresh JWT token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getProfile = async () => {
  const response = await api.get('/api/accounts/profile/');
  return response.data;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await api.put('/api/accounts/profile/update/', userData);
  return response.data;
};

// Change user password
export const changePassword = async (passwords) => {
  const response = await api.post('/api/accounts/profile/change-password/', passwords);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/api/accounts/logout/');
  return response.data;
};