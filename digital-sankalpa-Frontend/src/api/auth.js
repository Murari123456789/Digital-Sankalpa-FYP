import api from './index';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('accounts/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user and get JWT token
export const login = async (credentials) => {
  try {
    const response = await api.post('/token/', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Refresh JWT token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('accounts/my/account/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('accounts/my/account/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change user password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('accounts//change_password/', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};