import api from './api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/api/wishlist/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post(`/api/wishlist/${productId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/api/wishlist/${productId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
